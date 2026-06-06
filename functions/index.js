// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Cloud Functions
//  Razorpay (UPI-only) premium upgrade. Three responsibilities:
//    1. createRazorpayOrder      – mint a server-side order (web Checkout)
//    2. verifyRazorpayPayment    – verify the Checkout signature, unlock now
//    3. razorpayWebhook          – authoritative fallback grant (server→server)
//    4. createRazorpayPaymentLink – UPI payment link for the mobile app
//
//  First principles of payment security:
//    • The AMOUNT and the ENTITLEMENT must be decided on the server.
//      The client may *request* an upgrade but can never *grant* itself one.
//    • Premium is written ONLY here (Admin SDK bypasses Firestore rules).
//      The rules (firestore.rules) forbid a client from setting isPremium.
//    • A payment is trusted only after an HMAC signature check against the
//      Razorpay secret — never on the client's say-so.
//
//  SETUP (placeholders until you add real keys) — see RAZORPAY_SETUP.md:
//    firebase functions:secrets:set RAZORPAY_KEY_ID
//    firebase functions:secrets:set RAZORPAY_KEY_SECRET
//    firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
// ─────────────────────────────────────────────────────────

const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { setGlobalOptions } = require('firebase-functions/v2');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const crypto = require('crypto');
const Razorpay = require('razorpay');

admin.initializeApp();

// Run close to the users (India). If you change this, also change the
// region in the web firebase-config.js and the mobile services/payments.js.
setGlobalOptions({ region: 'asia-south1', maxInstances: 10 });

const RZP_KEY_ID = defineSecret('RAZORPAY_KEY_ID');
const RZP_KEY_SECRET = defineSecret('RAZORPAY_KEY_SECRET');
const RZP_WEBHOOK_SECRET = defineSecret('RAZORPAY_WEBHOOK_SECRET');
// The Razorpay Plan id for the ₹49/month auto-debit subscription. Create the
// plan once in Razorpay Dashboard → Subscriptions → Plans (₹49, monthly),
// then: firebase functions:secrets:set RAZORPAY_MONTHLY_PLAN_ID
const RZP_MONTHLY_PLAN_ID = defineSecret('RAZORPAY_MONTHLY_PLAN_ID');

const PREMIUM_PRICE_INR = 399;            // ₹/year — the single source of truth
const PREMIUM_AMOUNT_PAISE = PREMIUM_PRICE_INR * 100;
// Number of monthly billing cycles to authorise up front (Razorpay requires a
// finite count). 120 = 10 years; the mandate keeps charging ₹49 until the user
// cancels or it completes.
const MONTHLY_TOTAL_COUNT = 120;

function rzpClient() {
  return new Razorpay({
    key_id: RZP_KEY_ID.value(),
    key_secret: RZP_KEY_SECRET.value(),
  });
}

// The ONLY place premium is granted. Admin SDK → bypasses security rules.
async function grantPremium(uid, meta = {}) {
  const db = admin.firestore();
  const userDoc = {
    isPremium: true,
    premiumSince: admin.firestore.FieldValue.serverTimestamp(),
    premiumPlan: meta.plan || 'annual',
    premiumOrderId: meta.orderId || null,
  };
  // For subscriptions, remember which subscription owns the entitlement so we
  // only revoke when THAT subscription ends (an annual buyer is never touched).
  if (meta.subscriptionId) userDoc.premiumSubscriptionId = meta.subscriptionId;
  await db.collection('users').doc(uid).set(userDoc, { merge: true });
  if (meta.orderId) {
    await db.collection('orders').doc(meta.orderId).set(
      {
        status: 'paid',
        paymentId: meta.paymentId || null,
        paidVia: meta.via || 'unknown',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    ).catch((e) => logger.warn('order update failed', e));
  }
  logger.info('Premium granted', { uid, via: meta.via, orderId: meta.orderId });
}

// Revoke premium when a MONTHLY subscription ends (cancelled / halted /
// completed). We only revoke if the entitlement is owned by this exact
// subscription, so a separately-purchased annual plan is never affected.
async function revokePremiumForSubscription(subscriptionId, meta = {}) {
  if (!subscriptionId) return;
  const db = admin.firestore();
  let uid = meta.uid;
  if (!uid) {
    const snap = await db.collection('subscriptions').doc(subscriptionId).get();
    if (snap.exists) uid = snap.data().userId;
  }
  if (!uid) { logger.warn('No uid to revoke for subscription', { subscriptionId }); return; }
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const data = userSnap.exists ? userSnap.data() : {};
  if (data.premiumSubscriptionId && data.premiumSubscriptionId === subscriptionId) {
    await userRef.set({ isPremium: false, premiumPlan: null }, { merge: true });
    logger.info('Premium revoked (subscription ended)', { uid, subscriptionId, reason: meta.reason });
  }
  await db.collection('subscriptions').doc(subscriptionId).set(
    { status: meta.reason || 'ended', endedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  ).catch(() => {});
}

// 1) Create an order (web Razorpay Checkout) ───────────────
exports.createRazorpayOrder = onCall(
  { secrets: [RZP_KEY_ID, RZP_KEY_SECRET] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Please sign in to upgrade.');
    const uid = req.auth.uid;
    try {
      const order = await rzpClient().orders.create({
        amount: PREMIUM_AMOUNT_PAISE,
        currency: 'INR',
        receipt: `premium_${uid}_${Date.now()}`,
        notes: { uid, plan: 'premium-annual' },
      });
      await admin.firestore().collection('orders').doc(order.id).set(
        {
          userId: uid,
          orderId: order.id,
          amount: PREMIUM_AMOUNT_PAISE,
          currency: 'INR',
          status: 'created',
          plan: 'premium-annual',
          channel: 'razorpay-checkout',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return {
        orderId: order.id,
        amount: PREMIUM_AMOUNT_PAISE,
        currency: 'INR',
        keyId: RZP_KEY_ID.value(), // publishable — safe to return to the client
      };
    } catch (e) {
      logger.error('createRazorpayOrder failed', e);
      throw new HttpsError('internal', 'Could not start the payment. Please try again.');
    }
  }
);

// 2) Verify the Checkout signature and unlock immediately ───
exports.verifyRazorpayPayment = onCall(
  { secrets: [RZP_KEY_SECRET] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Please sign in.');
    const uid = req.auth.uid;
    const { orderId, paymentId, signature } = req.data || {};
    if (!orderId || !paymentId || !signature) {
      throw new HttpsError('invalid-argument', 'Missing payment details.');
    }
    const expected = crypto
      .createHmac('sha256', RZP_KEY_SECRET.value())
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    // Constant-time compare to avoid timing leaks.
    const ok =
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!ok) throw new HttpsError('permission-denied', 'Payment could not be verified.');

    await grantPremium(uid, { orderId, paymentId, via: 'checkout' });
    return { success: true };
  }
);

// 3) Webhook — the authoritative, server-to-server grant ────
//    Configure in Razorpay Dashboard → Webhooks with events:
//    payment.captured, order.paid, payment_link.paid
exports.razorpayWebhook = onRequest(
  { secrets: [RZP_WEBHOOK_SECRET] },
  async (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const raw = req.rawBody; // Buffer — required for a correct HMAC
      const expected = crypto
        .createHmac('sha256', RZP_WEBHOOK_SECRET.value())
        .update(raw)
        .digest('hex');
      if (
        !signature ||
        expected.length !== String(signature).length ||
        !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature)))
      ) {
        res.status(400).send('invalid signature');
        return;
      }

      const event = req.body;
      const type = event && event.event;

      // ── Subscription (monthly auto-debit) lifecycle ──
      // activated / charged → grant or extend premium; ended states → revoke.
      const SUB_GRANT = ['subscription.activated', 'subscription.charged', 'subscription.resumed'];
      const SUB_REVOKE = ['subscription.cancelled', 'subscription.halted', 'subscription.completed', 'subscription.expired'];
      if (type && type.startsWith('subscription.')) {
        const sub = event.payload && event.payload.subscription && event.payload.subscription.entity;
        if (sub) {
          const subscriptionId = sub.id;
          let uid = sub.notes && sub.notes.uid;
          if (!uid && subscriptionId) {
            const snap = await admin.firestore().collection('subscriptions').doc(subscriptionId).get();
            if (snap.exists) uid = snap.data().userId;
          }
          if (SUB_GRANT.includes(type) && uid) {
            const paymentId = event.payload.payment && event.payload.payment.entity && event.payload.payment.entity.id;
            await grantPremium(uid, { subscriptionId, paymentId, plan: 'monthly', via: 'subscription-webhook' });
          } else if (SUB_REVOKE.includes(type)) {
            await revokePremiumForSubscription(subscriptionId, { uid, reason: type.replace('subscription.', '') });
          } else if (!uid) {
            logger.warn('Subscription webhook had no uid', { type, subscriptionId });
          }
        }
        res.status(200).send('ok');
        return;
      }

      // ── One-time payment (annual) ──
      let entity = null;
      if (type === 'payment.captured') entity = event.payload.payment.entity;
      else if (type === 'order.paid') entity = event.payload.order.entity;
      else if (type === 'payment_link.paid') entity = event.payload.payment_link.entity;

      if (entity) {
        const orderId = entity.order_id || entity.id;
        let uid = entity.notes && entity.notes.uid;
        if (!uid && orderId) {
          const snap = await admin.firestore().collection('orders').doc(orderId).get();
          if (snap.exists) uid = snap.data().userId;
        }
        if (uid) {
          const paymentId =
            type === 'payment.captured' ? entity.id :
            (event.payload.payment && event.payload.payment.entity && event.payload.payment.entity.id) || null;
          await grantPremium(uid, { orderId, paymentId, plan: 'annual', via: 'webhook' });
        } else {
          logger.warn('Webhook had no uid to grant', { type, orderId });
        }
      }
      res.status(200).send('ok');
    } catch (e) {
      logger.error('razorpayWebhook failed', e);
      res.status(500).send('error');
    }
  }
);

// 4) Mobile: UPI payment link (opened via the device browser) ─
exports.createRazorpayPaymentLink = onCall(
  { secrets: [RZP_KEY_ID, RZP_KEY_SECRET] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Please sign in.');
    const uid = req.auth.uid;
    try {
      const link = await rzpClient().paymentLink.create({
        amount: PREMIUM_AMOUNT_PAISE,
        currency: 'INR',
        accept_partial: false,
        description: 'KrishnaVerse Premium (Annual)',
        notes: { uid, plan: 'premium-annual' },
        notify: { sms: false, email: false },
        reminder_enable: false,
        upi_link: true, // UPI-only payment link
      });
      await admin.firestore().collection('orders').doc(link.id).set(
        {
          userId: uid,
          orderId: link.id,
          amount: PREMIUM_AMOUNT_PAISE,
          currency: 'INR',
          status: 'created',
          plan: 'premium-annual',
          channel: 'razorpay-link',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return { url: link.short_url, id: link.id };
    } catch (e) {
      logger.error('createRazorpayPaymentLink failed', e);
      throw new HttpsError('internal', 'Could not create the payment link.');
    }
  }
);

// 5) Monthly auto-debit subscription (₹49/mo) — web + mobile ──
//    Creates a Razorpay Subscription against the monthly plan and returns its
//    hosted short_url. The user authorises the UPI AutoPay mandate there; from
//    then on Razorpay charges ₹49/month and fires `subscription.charged`, which
//    the webhook above turns into a premium grant/extension. Entitlement is
//    NEVER decided on the client.
exports.createRazorpaySubscription = onCall(
  { secrets: [RZP_KEY_ID, RZP_KEY_SECRET, RZP_MONTHLY_PLAN_ID] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Please sign in to subscribe.');
    const uid = req.auth.uid;
    const planId = RZP_MONTHLY_PLAN_ID.value();
    if (!planId) throw new HttpsError('failed-precondition', 'Monthly plan is not configured yet.');
    try {
      const sub = await rzpClient().subscriptions.create({
        plan_id: planId,
        total_count: MONTHLY_TOTAL_COUNT,
        customer_notify: 1,
        notes: { uid, plan: 'premium-monthly' },
      });
      await admin.firestore().collection('subscriptions').doc(sub.id).set(
        {
          userId: uid,
          subscriptionId: sub.id,
          planId,
          plan: 'premium-monthly',
          status: sub.status || 'created',
          channel: 'razorpay-subscription',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return { url: sub.short_url, id: sub.id, status: sub.status };
    } catch (e) {
      logger.error('createRazorpaySubscription failed', e);
      throw new HttpsError('internal', 'Could not start the subscription. Please try again.');
    }
  }
);

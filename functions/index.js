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

const PREMIUM_PRICE_INR = 199;            // ₹/year — the single source of truth
const PREMIUM_AMOUNT_PAISE = PREMIUM_PRICE_INR * 100;

function rzpClient() {
  return new Razorpay({
    key_id: RZP_KEY_ID.value(),
    key_secret: RZP_KEY_SECRET.value(),
  });
}

// The ONLY place premium is granted. Admin SDK → bypasses security rules.
async function grantPremium(uid, meta = {}) {
  const db = admin.firestore();
  await db.collection('users').doc(uid).set(
    {
      isPremium: true,
      premiumSince: admin.firestore.FieldValue.serverTimestamp(),
      premiumPlan: 'annual',
      premiumOrderId: meta.orderId || null,
    },
    { merge: true }
  );
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
          await grantPremium(uid, { orderId, paymentId, via: 'webhook' });
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

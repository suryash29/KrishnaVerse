// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Shop Admin Console  (classic script / compat SDK)
//  Add / edit / delete products in Cloud Firestore. Login-gated
//  and restricted to the admin email allowlist below + enforced
//  again server-side by firestore.rules.
//
//  Uses the Firebase compat globals from firebase-config.js:
//    window.kvAuth, window.kvDb, and window.KV_SEED_PRODUCTS (shop-data.js)
// ─────────────────────────────────────────────────────────

(function () {
  'use strict';

  var auth = window.kvAuth;
  var db = window.kvDb;
  var serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
  var SEED_PRODUCTS = window.KV_SEED_PRODUCTS || [];

  // 👇 EDIT THIS: emails allowed to manage the shop. Must match firestore.rules.
  var ADMIN_EMAILS = [
    "1997sharmasurya@gmail.com",
  ];

  var $ = function (id) { return document.getElementById(id); };
  var isAdmin = function (user) { return !!user && ADMIN_EMAILS.includes((user.email || "").toLowerCase()); };

  function show(view) {
    $("loginView").classList.toggle("hidden", view !== "login");
    $("adminView").classList.toggle("hidden", view !== "admin");
  }
  function msg(el, text, type) {
    type = type || "ok";
    el.textContent = text;
    el.className = "msg " + type;
    if (type === "ok") setTimeout(function () { el.className = "msg"; }, 3500);
  }

  // ── Auth gate ───────────────────────────────────────────
  auth.onAuthStateChanged(function (user) {
    if (user && isAdmin(user)) {
      $("whoami").textContent = user.email;
      show("admin");
      loadList();
    } else if (user && !isAdmin(user)) {
      msg($("loginMsg"), "This account is not an authorized admin.", "err");
      auth.signOut();
      show("login");
    } else {
      show("login");
    }
  });

  $("loginBtn").addEventListener("click", async function () {
    var email = $("email").value.trim();
    var password = $("password").value;
    if (!email || !password) return msg($("loginMsg"), "Enter email and password.", "err");
    $("loginBtn").disabled = true;
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      msg($("loginMsg"), "Login failed: " + (e.code || e.message), "err");
    } finally {
      $("loginBtn").disabled = false;
    }
  });
  $("password").addEventListener("keydown", function (e) { if (e.key === "Enter") $("loginBtn").click(); });
  $("logoutBtn").addEventListener("click", function () { auth.signOut(); });

  // ── Form helpers ────────────────────────────────────────
  function resetForm() {
    $("formTitle").textContent = "➕ Add a product";
    $("pid").value = "";
    ["f_name", "f_price", "f_sort", "f_desc", "f_emoji", "f_tag", "f_img"].forEach(function (id) { $(id).value = ""; });
    $("f_category").value = "idols";
    $("f_stock").checked = true;
    $("cancelBtn").classList.add("hidden");
  }
  $("cancelBtn").addEventListener("click", resetForm);

  function fillForm(p) {
    $("formTitle").textContent = "✏️ Edit: " + p.name;
    $("pid").value = p.id;
    $("f_name").value = p.name || "";
    $("f_category").value = p.category || "idols";
    $("f_price").value = typeof p.price === "number" ? p.price : (parseInt(String(p.price).replace(/[^0-9]/g, "")) || "");
    $("f_sort").value = p.sortOrder != null ? p.sortOrder : "";
    $("f_desc").value = p.desc || "";
    $("f_emoji").value = p.emoji || "";
    $("f_tag").value = p.tag || "";
    $("f_img").value = p.imageUrl || "";
    $("f_stock").checked = p.inStock !== false;
    $("cancelBtn").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Save (create or update) ─────────────────────────────
  $("saveBtn").addEventListener("click", async function () {
    var name = $("f_name").value.trim();
    var price = parseInt($("f_price").value, 10);
    if (!name) return msg($("formMsg"), "Product name is required.", "err");
    if (isNaN(price) || price < 0) return msg($("formMsg"), "Enter a valid price.", "err");

    var editingId = $("pid").value;
    var id = editingId || slugify(name);
    var data = {
      name: name,
      category: $("f_category").value,
      price: price,
      sortOrder: parseInt($("f_sort").value, 10) || 99,
      desc: $("f_desc").value.trim(),
      emoji: $("f_emoji").value.trim() || "🛍️",
      tag: $("f_tag").value.trim(),
      imageUrl: $("f_img").value.trim(),
      inStock: $("f_stock").checked,
      updatedAt: serverTimestamp(),
    };
    if (!editingId) data.createdAt = serverTimestamp();

    $("saveBtn").disabled = true;
    try {
      await db.collection("products").doc(id).set(data, { merge: true });
      msg($("formMsg"), editingId ? "Product updated ✓" : "Product added ✓", "ok");
      resetForm();
      loadList();
    } catch (e) {
      msg($("formMsg"), "Save failed: " + (e.code || e.message), "err");
    } finally {
      $("saveBtn").disabled = false;
    }
  });

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)
      + "-" + Math.random().toString(36).slice(2, 6);
  }

  // ── List + edit/delete ──────────────────────────────────
  async function loadList() {
    var list = $("plist");
    list.innerHTML = '<p class="muted">Loading…</p>';
    try {
      var snap = await db.collection("products").orderBy("sortOrder", "asc").get();
      var items = [];
      snap.forEach(function (d) { items.push(Object.assign({ id: d.id }, d.data())); });
      $("count").textContent = items.length;
      if (!items.length) {
        list.innerHTML = '<p class="muted">No products yet. Add one above, or click “Seed sample catalog”.</p>';
        return;
      }
      list.innerHTML = "";
      items.forEach(function (p) {
        var row = document.createElement("div");
        row.className = "prow";
        var media = p.imageUrl
          ? '<img src="' + p.imageUrl + '" alt="" />'
          : '<div class="em">' + (p.emoji || "🛍️") + '</div>';
        row.innerHTML =
          media +
          '<div class="info">' +
          '  <div class="nm">' + escapeHtml(p.name) +
          (p.tag ? '<span class="chip">' + escapeHtml(p.tag) + '</span>' : "") +
          (p.inStock === false ? '<span class="chip" style="background:rgba(192,57,43,.15);color:#ff8a7a">Sold out</span>' : "") +
          '  </div>' +
          '  <div class="meta">' + p.category + ' · ₹' + (typeof p.price === "number" ? p.price.toLocaleString("en-IN") : p.price) + ' · sort ' + (p.sortOrder != null ? p.sortOrder : "—") + '</div>' +
          '</div>';
        var edit = document.createElement("button");
        edit.className = "btn btn-ghost btn-sm";
        edit.textContent = "Edit";
        edit.onclick = function () { fillForm(p); };
        var del = document.createElement("button");
        del.className = "btn btn-danger btn-sm";
        del.textContent = "Delete";
        del.onclick = function () { removeProduct(p); };
        row.appendChild(edit);
        row.appendChild(del);
        list.appendChild(row);
      });
    } catch (e) {
      list.innerHTML = '<p class="muted">Could not load: ' + (e.code || e.message) + '</p>';
    }
  }

  async function removeProduct(p) {
    if (!confirm('Delete "' + p.name + '"? This cannot be undone.')) return;
    try {
      await db.collection("products").doc(p.id).delete();
      loadList();
    } catch (e) {
      alert("Delete failed: " + (e.code || e.message));
    }
  }

  // ── Seed sample catalog ─────────────────────────────────
  $("seedBtn").addEventListener("click", async function () {
    if (!confirm("Add the sample catalog (idols, counters, etc.) to Firestore? Existing products with the same id will be overwritten.")) return;
    $("seedBtn").disabled = true;
    try {
      var n = 0;
      for (var i = 0; i < SEED_PRODUCTS.length; i++) {
        var p = SEED_PRODUCTS[i];
        var id = p.id;
        var rest = Object.assign({}, p);
        delete rest.id;
        await db.collection("products").doc(id).set(
          Object.assign({}, rest, { updatedAt: serverTimestamp(), createdAt: serverTimestamp() }),
          { merge: true });
        n++;
      }
      msg($("formMsg"), "Seeded " + n + " sample products ✓", "ok");
      loadList();
    } catch (e) {
      msg($("formMsg"), "Seed failed: " + (e.code || e.message), "err");
    } finally {
      $("seedBtn").disabled = false;
    }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
})();

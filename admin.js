// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Shop Admin Console
//  Add / edit / delete products in Cloud Firestore. Login-gated
//  and restricted to the admin email allowlist below + enforced
//  again server-side by firestore.rules.
// ─────────────────────────────────────────────────────────

import {
  auth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
  db, collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp,
} from "./firebase-config.js";
import { SEED_PRODUCTS } from "./shop-data.js";

// 👇 EDIT THIS: emails allowed to manage the shop. Must match firestore.rules.
const ADMIN_EMAILS = [
  "1997sharmasurya@gmail.com",
];

const $ = (id) => document.getElementById(id);
const isAdmin = (user) => !!user && ADMIN_EMAILS.includes((user.email || "").toLowerCase());

function show(view) {
  $("loginView").classList.toggle("hidden", view !== "login");
  $("adminView").classList.toggle("hidden", view !== "admin");
}
function msg(el, text, type = "ok") {
  el.textContent = text;
  el.className = "msg " + type;
  if (type === "ok") setTimeout(() => { el.className = "msg"; }, 3500);
}

// ── Auth gate ───────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user && isAdmin(user)) {
    $("whoami").textContent = user.email;
    show("admin");
    loadList();
  } else if (user && !isAdmin(user)) {
    msg($("loginMsg"), "This account is not an authorized admin.", "err");
    signOut(auth);
    show("login");
  } else {
    show("login");
  }
});

$("loginBtn").addEventListener("click", async () => {
  const email = $("email").value.trim();
  const password = $("password").value;
  if (!email || !password) return msg($("loginMsg"), "Enter email and password.", "err");
  $("loginBtn").disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    msg($("loginMsg"), "Login failed: " + (e.code || e.message), "err");
  } finally {
    $("loginBtn").disabled = false;
  }
});
$("password").addEventListener("keydown", (e) => { if (e.key === "Enter") $("loginBtn").click(); });
$("logoutBtn").addEventListener("click", () => signOut(auth));

// ── Form helpers ────────────────────────────────────────
function resetForm() {
  $("formTitle").textContent = "➕ Add a product";
  $("pid").value = "";
  ["f_name", "f_price", "f_sort", "f_desc", "f_emoji", "f_tag", "f_img"].forEach(id => $(id).value = "");
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
  $("f_sort").value = p.sortOrder ?? "";
  $("f_desc").value = p.desc || "";
  $("f_emoji").value = p.emoji || "";
  $("f_tag").value = p.tag || "";
  $("f_img").value = p.imageUrl || "";
  $("f_stock").checked = p.inStock !== false;
  $("cancelBtn").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Save (create or update) ─────────────────────────────
$("saveBtn").addEventListener("click", async () => {
  const name = $("f_name").value.trim();
  const price = parseInt($("f_price").value, 10);
  if (!name) return msg($("formMsg"), "Product name is required.", "err");
  if (isNaN(price) || price < 0) return msg($("formMsg"), "Enter a valid price.", "err");

  const editingId = $("pid").value;
  const id = editingId || slugify(name);
  const data = {
    name,
    category: $("f_category").value,
    price,
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
    await setDoc(doc(db, "products", id), data, { merge: true });
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
  const list = $("plist");
  list.innerHTML = '<p class="muted">Loading…</p>';
  try {
    const snap = await getDocs(query(collection(db, "products"), orderBy("sortOrder", "asc")));
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    $("count").textContent = items.length;
    if (!items.length) {
      list.innerHTML = '<p class="muted">No products yet. Add one above, or click “Seed sample catalog”.</p>';
      return;
    }
    list.innerHTML = "";
    items.forEach(p => {
      const row = document.createElement("div");
      row.className = "prow";
      const media = p.imageUrl
        ? `<img src="${p.imageUrl}" alt="" />`
        : `<div class="em">${p.emoji || "🛍️"}</div>`;
      row.innerHTML = `
        ${media}
        <div class="info">
          <div class="nm">${escapeHtml(p.name)}${p.tag ? `<span class="chip">${escapeHtml(p.tag)}</span>` : ""}${p.inStock === false ? `<span class="chip" style="background:rgba(192,57,43,.15);color:#ff8a7a">Sold out</span>` : ""}</div>
          <div class="meta">${p.category} · ₹${typeof p.price === "number" ? p.price.toLocaleString("en-IN") : p.price} · sort ${p.sortOrder ?? "—"}</div>
        </div>`;
      const edit = document.createElement("button");
      edit.className = "btn btn-ghost btn-sm";
      edit.textContent = "Edit";
      edit.onclick = () => fillForm(p);
      const del = document.createElement("button");
      del.className = "btn btn-danger btn-sm";
      del.textContent = "Delete";
      del.onclick = () => removeProduct(p);
      row.appendChild(edit);
      row.appendChild(del);
      list.appendChild(row);
    });
  } catch (e) {
    list.innerHTML = `<p class="muted">Could not load: ${e.code || e.message}</p>`;
  }
}

async function removeProduct(p) {
  if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
  try {
    await deleteDoc(doc(db, "products", p.id));
    loadList();
  } catch (e) {
    alert("Delete failed: " + (e.code || e.message));
  }
}

// ── Seed sample catalog ─────────────────────────────────
$("seedBtn").addEventListener("click", async () => {
  if (!confirm("Add the sample catalog (idols, counters, etc.) to Firestore? Existing products with the same id will be overwritten.")) return;
  $("seedBtn").disabled = true;
  try {
    let n = 0;
    for (const p of SEED_PRODUCTS) {
      const { id, ...rest } = p;
      await setDoc(doc(db, "products", id), {
        ...rest, updatedAt: serverTimestamp(), createdAt: serverTimestamp(),
      }, { merge: true });
      n++;
    }
    msg($("formMsg"), `Seeded ${n} sample products ✓`, "ok");
    loadList();
  } catch (e) {
    msg($("formMsg"), "Seed failed: " + (e.code || e.message), "err");
  } finally {
    $("seedBtn").disabled = false;
  }
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

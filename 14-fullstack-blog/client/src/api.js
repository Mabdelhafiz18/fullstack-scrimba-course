// Centralised fetch helpers for the blog API.
// All calls hit relative /api URLs — Vite proxies them to Express in dev,
// and Express serves them directly in production.

const BASE = "/api/posts";

// --- Auth token (single admin) ---
// Kept in memory + sessionStorage so it survives reloads within a tab.
let authToken = sessionStorage.getItem("token") || null;

export function setAuthToken(token) {
  authToken = token || null;
  if (authToken) sessionStorage.setItem("token", authToken);
  else sessionStorage.removeItem("token");
}

export function getAuthToken() {
  return authToken;
}

function authHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

export function login(password) {
  return fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  }).then(handle);
}

async function handle(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // A 401 means the token is missing/expired — drop it so the UI re-gates.
    if (res.status === 401) setAuthToken(null);
    // Surface validation errors or a generic message.
    const message = data.errors ? data.errors.join(" ") : data.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export function listPosts({ q = "", tag = "", sort = "" } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (tag.trim()) params.set("tag", tag.trim());
  if (sort && sort !== "newest") params.set("sort", sort);
  const query = params.toString();
  return fetch(query ? `${BASE}?${query}` : BASE).then(handle);
}

export function getPost(slug) {
  return fetch(`${BASE}/${slug}`).then(handle);
}

export function getRelated(slug) {
  return fetch(`${BASE}/${slug}/related`).then(handle);
}

export function createPost(post) {
  return fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(post),
  }).then(handle);
}

export function updatePost(id, post) {
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(post),
  }).then(handle);
}

export function deletePost(id) {
  return fetch(`${BASE}/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle);
}

// Shared helpers used across components.
export function parseTags(tags) {
  return (tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatDate(iso) {
  // Accepts ISO timestamps (Postgres) or "2026-06-16 15:14:41" — show the date.
  const date = new Date((iso || "").replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Rough reading-time estimate from the Markdown body (~200 words/minute).
export function readingTime(body) {
  const words = (body || "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// True when a post was edited well after it was created (more than a minute
// later), so a brand-new post — where created_at == updated_at — isn't flagged.
export function isEdited(created, updated) {
  const c = new Date((created || "").replace(" ", "T")).getTime();
  const u = new Date((updated || "").replace(" ", "T")).getTime();
  if (Number.isNaN(c) || Number.isNaN(u)) return false;
  return u - c > 60000;
}

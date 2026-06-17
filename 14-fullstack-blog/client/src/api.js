// Centralised fetch helpers for the blog API.
// All calls hit relative /api URLs — Vite proxies them to Express in dev,
// and Express serves them directly in production.

const BASE = "/api/posts";

async function handle(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Surface validation errors or a generic message.
    const message = data.errors ? data.errors.join(" ") : data.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export function listPosts() {
  return fetch(BASE).then(handle);
}

export function getPost(slug) {
  return fetch(`${BASE}/${slug}`).then(handle);
}

export function createPost(post) {
  return fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  }).then(handle);
}

export function updatePost(id, post) {
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  }).then(handle);
}

export function deletePost(id) {
  return fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle);
}

// Shared helpers used across components.
export function parseTags(tags) {
  return (tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatDate(iso) {
  // SQLite gives "2026-06-16 15:14:41" — take the date part.
  const date = new Date((iso || "").replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

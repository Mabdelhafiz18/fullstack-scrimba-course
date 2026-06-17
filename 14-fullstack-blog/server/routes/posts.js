import { Router } from "express";
import db from "../db.js";

const router = Router();

// Turn a title into a URL-safe slug, e.g. "Hello, World!" -> "hello-world".
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Make sure a slug is unique. If "my-post" exists, try "my-post-2", etc.
// `ignoreId` lets a post keep/refresh its own slug when editing.
function uniqueSlug(title, ignoreId = null) {
  const base = slugify(title) || "post";
  let slug = base;
  let n = 2;
  const find = db.prepare("SELECT id FROM posts WHERE slug = ?");
  while (true) {
    const row = find.get(slug);
    if (!row || row.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
}

// Validate a create/update body. Returns an array of error messages.
function validatePost(body) {
  const errors = [];
  if (typeof body.title !== "string" || body.title.trim() === "") {
    errors.push("`title` is required.");
  }
  if (typeof body.body !== "string" || body.body.trim() === "") {
    errors.push("`body` is required.");
  }
  return errors;
}

// Normalise the tags field to a clean comma-separated string.
function cleanTags(tags) {
  if (!tags) return "";
  const list = Array.isArray(tags) ? tags : String(tags).split(",");
  return list
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .join(",");
}

// GET /api/posts — all posts, newest first.
router.get("/", (_req, res) => {
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC, id DESC").all();
  res.json(posts);
});

// GET /api/posts/:slug — a single post by slug.
router.get("/:slug", (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(req.params.slug);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// POST /api/posts — create a post.
router.post("/", (req, res) => {
  const errors = validatePost(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { title, body, excerpt } = req.body;
  const slug = uniqueSlug(title);
  const info = db
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, body, tags)
       VALUES (@slug, @title, @excerpt, @body, @tags)`
    )
    .run({
      slug,
      title: title.trim(),
      excerpt: (excerpt || "").trim(),
      body: body.trim(),
      tags: cleanTags(req.body.tags),
    });

  const created = db.prepare("SELECT * FROM posts WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/posts/:id — update a post.
router.put("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Post not found" });

  const errors = validatePost(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { title, body, excerpt } = req.body;
  // Regenerate the slug only when the title actually changed.
  const slug =
    title.trim() === existing.title ? existing.slug : uniqueSlug(title, existing.id);

  db.prepare(
    `UPDATE posts
     SET slug = @slug, title = @title, excerpt = @excerpt, body = @body,
         tags = @tags, updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    id: existing.id,
    slug,
    title: title.trim(),
    excerpt: (excerpt || "").trim(),
    body: body.trim(),
    tags: cleanTags(req.body.tags),
  });

  res.json(db.prepare("SELECT * FROM posts WHERE id = ?").get(existing.id));
});

// DELETE /api/posts/:id — delete a post.
router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Post not found" });
  res.status(204).end();
});

export default router;

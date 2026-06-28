import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

// Columns returned to clients — excludes the internal `search` tsvector.
const COLS =
  "id, slug, title, excerpt, body, tags, author, cover_url, created_at, updated_at";

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
async function uniqueSlug(title, ignoreId = null) {
  const base = slugify(title) || "post";
  let slug = base;
  let n = 2;
  while (true) {
    const { rows } = await pool.query("SELECT id FROM posts WHERE slug = $1", [slug]);
    const row = rows[0];
    if (!row || row.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
}

// Field length caps (characters) — a guard against oversized input.
const LIMITS = { title: 200, excerpt: 500, body: 50000, tags: 200 };

// Validate a create/update body. Returns an array of error messages.
function validatePost(body) {
  const errors = [];
  if (typeof body.title !== "string" || body.title.trim() === "") {
    errors.push("`title` is required.");
  }
  if (typeof body.body !== "string" || body.body.trim() === "") {
    errors.push("`body` is required.");
  }
  for (const [field, max] of Object.entries(LIMITS)) {
    if (typeof body[field] === "string" && body[field].length > max) {
      errors.push(`\`${field}\` must be ${max} characters or fewer.`);
    }
  }
  const cover = typeof body.cover_url === "string" ? body.cover_url.trim() : "";
  if (cover) {
    if (cover.length > 2000) {
      errors.push("`cover_url` is too long.");
    } else {
      try {
        const u = new URL(cover);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          errors.push("`cover_url` must be an http(s) URL.");
        }
      } catch {
        errors.push("`cover_url` must be a valid URL.");
      }
    }
  }
  return errors;
}

// Trim the cover URL to a value or null (empty/whitespace -> no cover).
function cleanCover(url) {
  const s = typeof url === "string" ? url.trim() : "";
  return s === "" ? null : s;
}

// Normalise the tags field to a clean comma-separated string.
function cleanTags(tags) {
  if (!tags) return "";
  const list = Array.isArray(tags) ? tags : String(tags).split(",");
  return [...new Set(list.map((t) => t.trim().toLowerCase()).filter(Boolean))].join(",");
}

// Postgres `id` is an integer column — a non-numeric path param would make the
// query error. Treat anything that isn't a plain integer as "not found".
function parseId(raw) {
  return /^\d+$/.test(raw) ? Number(raw) : null;
}

// Allowed ?sort= values mapped to their ORDER BY clause. Keys are the only
// values accepted from the client; the SQL is fixed here, never user input.
// Tag count = commas + 1 for a non-empty tags string, else 0.
const SORTS = {
  newest: "created_at DESC, id DESC",
  oldest: "created_at ASC, id ASC",
  "most-tags":
    "(CASE WHEN tags = '' THEN 0 ELSE length(tags) - length(replace(tags, ',', '')) + 1 END) DESC, created_at DESC, id DESC",
};

// GET /api/posts — all posts, newest first.
// Optional filters: ?q= (case-insensitive title/excerpt search) and
// ?tag= (exact tag membership). Both can be combined. ?sort= reorders.
router.get("/", async (req, res, next) => {
  try {
    const conditions = [];
    const params = [];

    // Full-text search across title/excerpt/body via the generated tsvector.
    let rankOrder = null;
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (q) {
      params.push(q);
      const p = params.length;
      conditions.push(`search @@ websearch_to_tsquery('english', $${p})`);
      rankOrder = `ts_rank(search, websearch_to_tsquery('english', $${p})) DESC`;
    }

    const tag = typeof req.query.tag === "string" ? req.query.tag.trim().toLowerCase() : "";
    if (tag) {
      // Wrap stored tags in commas so the match is exact-per-tag:
      // ",node,backend," ILIKE "%,node,%" matches, but "nodemon" never does.
      params.push(`%,${tag},%`);
      conditions.push(`(',' || tags || ',') ILIKE $${params.length}`);
    }

    // Whitelisted sort orders (never interpolate user input into SQL).
    // An explicit ?sort= wins; otherwise a search defaults to best-match
    // ranking, and a plain feed defaults to newest first.
    const explicitSort = SORTS[req.query.sort];
    const orderBy =
      explicitSort ||
      (rankOrder ? `${rankOrder}, created_at DESC, id DESC` : SORTS.newest);

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM posts ${where} ORDER BY ${orderBy}`,
      params
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:slug — a single post by slug.
router.get("/:slug", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT ${COLS} FROM posts WHERE slug = $1`, [
      req.params.slug,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Post not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:slug/related — up to 3 posts sharing the most tags.
router.get("/:slug/related", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${COLS} FROM posts WHERE slug = $1`,
      [req.params.slug]
    );
    const post = rows[0];
    if (!post) return res.status(404).json({ error: "Post not found" });

    const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];
    if (tags.length === 0) return res.json([]);

    // Candidates sharing at least one tag (exclude the post itself).
    const conditions = tags.map((_, i) => `(',' || tags || ',') LIKE $${i + 2}`);
    const params = [post.id, ...tags.map((t) => `%,${t},%`)];
    const { rows: candidates } = await pool.query(
      `SELECT ${COLS} FROM posts WHERE id <> $1 AND (${conditions.join(" OR ")})`,
      params
    );

    // Rank by number of shared tags, then newest, and keep the top 3.
    const tagSet = new Set(tags);
    const related = candidates
      .map((c) => ({
        post: c,
        overlap: (c.tags ? c.tags.split(",") : []).filter((t) => tagSet.has(t)).length,
      }))
      .sort(
        (a, b) =>
          b.overlap - a.overlap ||
          new Date(b.post.created_at) - new Date(a.post.created_at)
      )
      .slice(0, 3)
      .map((r) => r.post);

    res.json(related);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts — create a post. (auth required)
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const errors = validatePost(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { title, body, excerpt } = req.body;
    const slug = await uniqueSlug(title);
    const { rows } = await pool.query(
      `INSERT INTO posts (slug, title, excerpt, body, tags, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${COLS}`,
      [
        slug,
        title.trim(),
        (excerpt || "").trim(),
        body.trim(),
        cleanTags(req.body.tags),
        cleanCover(req.body.cover_url),
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id — update a post. (auth required)
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).json({ error: "Post not found" });

    const { rows: existingRows } = await pool.query(
      `SELECT ${COLS} FROM posts WHERE id = $1`,
      [id]
    );
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Post not found" });

    const errors = validatePost(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { title, body, excerpt } = req.body;
    // Regenerate the slug only when the title actually changed.
    const slug =
      title.trim() === existing.title
        ? existing.slug
        : await uniqueSlug(title, existing.id);

    const { rows } = await pool.query(
      `UPDATE posts
       SET slug = $1, title = $2, excerpt = $3, body = $4, tags = $5,
           cover_url = $6, updated_at = now()
       WHERE id = $7
       RETURNING ${COLS}`,
      [
        slug,
        title.trim(),
        (excerpt || "").trim(),
        body.trim(),
        cleanTags(req.body.tags),
        cleanCover(req.body.cover_url),
        existing.id,
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id — delete a post. (auth required)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(404).json({ error: "Post not found" });

    const { rowCount } = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Post not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;

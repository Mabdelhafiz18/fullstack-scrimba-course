// One-off seed script: `npm run seed`.
// Creates the schema (if needed) and inserts a few starter posts, but only when
// the table is empty — so re-running it is safe and won't duplicate.
import "dotenv/config";
import { pool, initSchema } from "./db.js";

const posts = [
  {
    slug: "hello-world",
    title: "Hello, World (and this blog)",
    excerpt: "Why I built a tiny blog from scratch instead of reaching for a platform.",
    tags: "meta,writing",
    body: `Welcome to **Paper Trail** — a little corner of the internet I built by hand.

I wanted somewhere to keep notes as I learn, so I made a blog the long way:
an Express API, a PostgreSQL database, and a React frontend.

## Why bother?

- I learn more by building than by configuring.
- Owning the whole stack means no surprises.
- It's just *fun* to ship something small and complete.

More posts soon. Thanks for reading!`,
  },
  {
    slug: "what-i-learned-building-a-rest-api",
    title: "What I learned building a REST API",
    excerpt: "Validation, status codes, and why parameterised queries matter.",
    tags: "node,express,sql",
    body: `Building the API behind this blog taught me a few things that stuck.

## 1. Validate at the edge

Every \`POST\` and \`PUT\` checks its input before touching the database. Bad
requests get a clear \`400\` with a list of what's wrong — not a crash.

## 2. Status codes are an API's vocabulary

- \`201\` when something is created
- \`204\` when something is deleted
- \`404\` when it isn't there

## 3. Always use parameterised queries

\`\`\`js
pool.query("SELECT * FROM posts WHERE slug = $1", [slug]);
\`\`\`

Parameterised queries keep user input *data*, never *code*. That's how you stay
safe from SQL injection.`,
  },
  {
    slug: "markdown-is-underrated",
    title: "Markdown is underrated",
    excerpt: "A plain-text format that turns into clean HTML — what's not to like?",
    tags: "writing,markdown",
    body: `I write every post here in **Markdown**, and the blog renders it to HTML.

It keeps writing fast and distraction-free:

> Focus on the words, let the formatting follow.

You get headings, **bold**, *italics*, lists, and code — all from plain text:

1. Easy to write
2. Easy to read as-is
3. Easy to render safely

That last point matters: this blog renders Markdown without allowing raw HTML,
so a post can never inject a script.`,
  },
];

async function seed() {
  await initSchema();

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM posts");
  if (rows[0].count > 0) {
    console.log(`Posts table already has ${rows[0].count} row(s) — skipping seed.`);
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of posts) {
      await client.query(
        `INSERT INTO posts (slug, title, excerpt, body, tags)
         VALUES ($1, $2, $3, $4, $5)`,
        [p.slug, p.title, p.excerpt, p.body, p.tags]
      );
    }
    await client.query("COMMIT");
    console.log(`Seeded ${posts.length} posts.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

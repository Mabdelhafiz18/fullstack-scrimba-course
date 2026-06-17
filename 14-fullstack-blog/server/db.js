import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

// Open (or create) the SQLite database file.
const db = new Database(join(dataDir, "blog.db"));
db.pragma("journal_mode = WAL");

// Create the posts table on first run. `IF NOT EXISTS` keeps startup idempotent.
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT UNIQUE NOT NULL,
    title      TEXT NOT NULL,
    excerpt    TEXT,
    body       TEXT NOT NULL,
    tags       TEXT DEFAULT '',
    author     TEXT NOT NULL DEFAULT 'Mohamed Abdelhafiz',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed a few Markdown posts the first time so the blog isn't empty.
const { count } = db.prepare("SELECT COUNT(*) AS count FROM posts").get();
if (count === 0) {
  const insert = db.prepare(
    `INSERT INTO posts (slug, title, excerpt, body, tags)
     VALUES (@slug, @title, @excerpt, @body, @tags)`
  );
  const seed = db.transaction((rows) => rows.forEach((r) => insert.run(r)));

  seed([
    {
      slug: "hello-world",
      title: "Hello, World (and this blog)",
      excerpt: "Why I built a tiny blog from scratch instead of reaching for a platform.",
      tags: "meta,writing",
      body: `Welcome to **Paper Trail** — a little corner of the internet I built by hand.

I wanted somewhere to keep notes as I learn, so I made a blog the long way:
an Express API, a SQLite database, and a React frontend.

## Why bother?

- I learn more by building than by configuring.
- Owning the whole stack means no surprises.
- It's just *fun* to ship something small and complete.

More posts soon. Thanks for reading!`,
    },
    {
      slug: "what-i-learned-building-a-rest-api",
      title: "What I learned building a REST API",
      excerpt: "Validation, status codes, and why prepared statements matter.",
      tags: "node,express,sql",
      body: `Building the API behind this blog taught me a few things that stuck.

## 1. Validate at the edge

Every \`POST\` and \`PUT\` checks its input before touching the database. Bad
requests get a clear \`400\` with a list of what's wrong — not a crash.

## 2. Status codes are an API's vocabulary

- \`201\` when something is created
- \`204\` when something is deleted
- \`404\` when it isn't there

## 3. Always use prepared statements

\`\`\`js
db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug);
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
  ]);
}

export default db;

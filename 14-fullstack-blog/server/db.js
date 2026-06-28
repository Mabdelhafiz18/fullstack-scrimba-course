import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — copy .env.example to .env");
}

// A single shared connection pool for the whole app. `pg` is async — every
// query returns a Promise, unlike the old synchronous better-sqlite3 calls.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the posts table on first run. `IF NOT EXISTS` keeps startup idempotent.
// Postgres equivalents of the old SQLite types:
//   INTEGER PRIMARY KEY AUTOINCREMENT  ->  INTEGER GENERATED ALWAYS AS IDENTITY
//   datetime('now') / TEXT timestamps  ->  TIMESTAMPTZ DEFAULT now()
export async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      excerpt     TEXT,
      body        TEXT NOT NULL,
      tags        TEXT DEFAULT '',
      author      TEXT NOT NULL DEFAULT 'Mohamed Abdelhafiz',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  // Optional cover image URL (FEATURES.md Phase 9).
  await pool.query("ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_url TEXT");

  // Helps the "newest first" feed once posts grow (see FEATURES.md Phase 4).
  await pool.query(
    "CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC)"
  );

  // Full-text search (FEATURES.md Phase 8): a generated tsvector over title,
  // excerpt and body, weighted A > B > C so title matches outrank body matches.
  // ADD COLUMN IF NOT EXISTS migrates databases created before this column.
  await pool.query(`
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS search tsvector
      GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')),   'A') ||
        setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(body, '')),    'C')
      ) STORED
  `);
  await pool.query(
    "CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN (search)"
  );
}

export default pool;

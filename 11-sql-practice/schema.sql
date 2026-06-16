-- Schema for a simple task manager.
-- Two related tables: users and tasks (one user has many tasks).
-- Written to be compatible with SQLite; minor tweaks may be needed for
-- Postgres/MySQL (noted in the README).

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT NOT NULL DEFAULT 'medium'  -- low | medium | high
                CHECK (priority IN ('low', 'medium', 'high')),
  completed   INTEGER NOT NULL DEFAULT 0,      -- 0 = false, 1 = true
  due_date    TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Index to speed up lookups of a user's tasks.
CREATE INDEX idx_tasks_user_id ON tasks (user_id);

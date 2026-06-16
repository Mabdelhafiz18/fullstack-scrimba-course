# 11 · SQL Practice

A small **task manager** database used to practice core SQL: schema design,
seeding, and CRUD/JOIN queries.

## Files

- `schema.sql` — `CREATE TABLE` statements for `users` and `tasks` (with a
  foreign key, a `CHECK` constraint, and an index).
- `seed.sql` — sample `INSERT` data.
- `queries.sql` — `SELECT`, `JOIN`, aggregation, `UPDATE`, and `DELETE` examples.

## Data model

```
users (1) ───< (many) tasks
```

A user has many tasks; each task belongs to one user via `tasks.user_id`.

## Run it (SQLite — easiest)

```bash
sqlite3 tasks.db < schema.sql
sqlite3 tasks.db < seed.sql
sqlite3 tasks.db < queries.sql
```

Or interactively:

```bash
sqlite3 tasks.db
sqlite> .read schema.sql
sqlite> .read seed.sql
sqlite> .read queries.sql
```

> ⚠️ `queries.sql` includes `UPDATE` and `DELETE` statements that change the
> data. Re-run `schema.sql` + `seed.sql` to reset.

## Porting to Postgres / MySQL

- Replace `INTEGER PRIMARY KEY` with `SERIAL PRIMARY KEY` (Postgres) or
  `INT AUTO_INCREMENT PRIMARY KEY` (MySQL).
- Replace `datetime('now')` with `CURRENT_TIMESTAMP`.
- `completed` can become a real `BOOLEAN` instead of `0/1`.

## Concepts practiced

- Table creation, constraints (`NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`)
- Indexing
- `SELECT` / `WHERE` / `ORDER BY`
- `JOIN` and `LEFT JOIN`
- `GROUP BY` with `COUNT` / `SUM`
- `UPDATE` and `DELETE`

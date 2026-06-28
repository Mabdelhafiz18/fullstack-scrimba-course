# 14 · Full-Stack Blog ("Paper Trail")

A complete full-stack blog: an **Express + PostgreSQL** API (`server/`) and a
**React (Vite)** frontend (`client/`) — two separate apps that run
independently. Posts are stored in a real database and written in Markdown.
This is the database-backed counterpart to the static
[`12-nextjs-mini-blog`](../12-nextjs-mini-blog).

## Features

- Home feed of posts (cards with title, excerpt, date, tags)
- Single post pages with **Markdown** rendered to HTML
- **Create / edit / delete** posts (with a live Markdown preview while writing)
- Slugged URLs generated from the title (e.g. `/posts/hello-world`)
- Tags shown as colourful "sticker" pills
- Server-side validation and proper HTTP status codes

## Design

A **warm zine** look built with intentional choices, not templated defaults:
warm paper background with a dotted texture, rounded **Fredoka** headlines,
**Inter** body text, and **Space Mono** labels. The signature element is the
post cards — "cut-paper stickers" with a thick ink border, a hard offset
shadow, and a slight tilt that straightens on hover. Tag pills use a small flat
palette (tomato / teal / mustard / berry). Responsive, keyboard-accessible, and
respects `prefers-reduced-motion`.

## Tech

- **Backend:** Node.js + Express, PostgreSQL via `pg`
- **Auth & security:** JWT (`jsonwebtoken`) + `bcryptjs`, `helmet`, `cors`, `express-rate-limit`
- **Frontend:** React + React Router + Vite
- **Markdown:** `react-markdown` + `remark-gfm` (no raw HTML → XSS-safe)
- **Tests:** Vitest + Supertest (API routes against a dedicated test database)

## Run it (two terminals)

The backend and frontend are **separate apps**. Install and run each on its own.

**Terminal 1 — backend (API):**

First you need a PostgreSQL database. The quickest way is Docker:

```bash
docker run -d --name paper-trail-postgres \
  -e POSTGRES_USER=dev -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=paper_trail \
  -p 127.0.0.1:5434:5432 postgres:16
```

Then configure and start the API:

```bash
cd server
npm install
cp .env.example .env   # then edit DATABASE_URL if your DB differs
npm run seed           # create the schema + insert starter posts (safe to re-run)
npm run dev            # API on http://localhost:5050
```

> The schema is created automatically on startup too; `npm run seed` just adds
> the example posts. A managed database (Neon, Supabase, Railway) works the same
> way — point `DATABASE_URL` at it (add `?sslmode=require` if needed).

**Terminal 2 — frontend (UI):**

```bash
cd client
npm install
npm run dev        # UI on http://localhost:5173  ← open this one
```

The Vite dev server proxies `/api` to the backend on port 5050, so the frontend
just calls `/api/posts`. Start the backend first so the API is ready.

> **Port 5050 already in use?** Run the API on another free port and update the
> proxy target in `client/vite.config.js` to match:
> ```powershell
> $env:PORT=5174; npm run dev      # (in server/)
> ```
> (Port 4000 is intentionally avoided — it's taken by a system service on the
> author's machine.)

### Frontend production build

```bash
cd client
npm run build      # outputs client/dist
npm run preview    # serves the built UI
```

## API

Write routes (POST/PUT/DELETE) require a Bearer token from `POST /api/login`.
Reads are public.

| Method | Path               | Description                       |
|--------|--------------------|-----------------------------------|
| POST   | `/api/login`       | Exchange the admin password for a token |
| GET    | `/api/posts`       | List posts (newest first)         |
| GET    | `/api/posts?q=`    | Full-text search (title, excerpt, body; ranked) |
| GET    | `/api/posts?tag=`  | Filter by exact tag (combine with `q`) |
| GET    | `/api/posts?sort=` | Order: `newest` (default), `oldest`, `most-tags` |
| GET    | `/api/posts/:slug` | Get one post by slug              |
| GET    | `/api/posts/:slug/related` | Up to 3 posts sharing the most tags |
| POST   | `/api/posts`       | Create a post                     |
| PUT    | `/api/posts/:id`   | Update a post                     |
| DELETE | `/api/posts/:id`   | Delete a post                     |

### Post shape

```json
{
  "id": 1,
  "slug": "hello-world",
  "title": "Hello, World",
  "excerpt": "Short summary",
  "body": "# Markdown body",
  "tags": "meta,writing",
  "author": "Mohamed Abdelhafiz",
  "cover_url": "https://example.com/cover.jpg",
  "created_at": "2026-06-16T12:00:00.000Z",
  "updated_at": "2026-06-16T12:00:00.000Z"
}
```

## Project structure

```
server/                # Backend app (its own package.json)
  package.json
  .env.example         # copy to .env and set DATABASE_URL
  server.js            # Boots: init schema, then listen
  app.js              # Builds the Express app (exported for tests)
  db.js                # pg connection pool + initSchema()
  routes/posts.js      # CRUD routes, slug generation, validation
  seed.js              # One-off: insert starter posts (npm run seed)
  test/posts.test.js   # API route tests (Vitest + Supertest)
client/                # Frontend app (its own package.json)
  package.json
  index.html
  vite.config.js       # proxies /api -> http://localhost:5050
  src/
    api.js             # fetch helpers
    App.jsx            # routes
    components/        # Layout, PostCard, TagPill, PostForm, Markdown
    pages/             # Home, Post, NewPost, EditPost, NotFound
    index.css          # warm-zine design system
```

## Notes & scope

- **Single-admin auth** — create/edit/delete require signing in with the admin
  password (`POST /api/login` returns a short-lived JWT; the frontend sends it as
  a Bearer token). Reads stay public. Set `ADMIN_PASSWORD_HASH` (a bcrypt hash)
  and `JWT_SECRET` in `.env`.
- **Hardening** — `helmet` security headers, a `cors` allowlist (`CLIENT_ORIGIN`),
  rate limiting (stricter on login), a 100 kb body cap, and per-field length
  limits.
- The database runs in Postgres (Docker locally or a managed host); the schema
  is created on startup and `npm run seed` adds the example posts.
- Run the tests with `npm test` in `server/` (needs `TEST_DATABASE_URL` set).


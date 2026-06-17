# 14 · Full-Stack Blog ("Paper Trail")

A complete full-stack blog: an **Express + SQLite** API (`server/`) and a
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

- **Backend:** Node.js + Express, SQLite via `better-sqlite3`
- **Frontend:** React + React Router + Vite
- **Markdown:** `react-markdown` + `remark-gfm` (no raw HTML → XSS-safe)

## Run it (two terminals)

The backend and frontend are **separate apps**. Install and run each on its own.

**Terminal 1 — backend (API):**

```bash
cd server
npm install
npm run dev        # API on http://localhost:5050
```

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

| Method | Path               | Description                       |
|--------|--------------------|-----------------------------------|
| GET    | `/api/posts`       | List posts (newest first)         |
| GET    | `/api/posts/:slug` | Get one post by slug              |
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
  "created_at": "2026-06-16 12:00:00",
  "updated_at": "2026-06-16 12:00:00"
}
```

## Project structure

```
server/                # Backend app (its own package.json)
  package.json
  server.js            # Express API
  db.js                # Opens SQLite, creates schema, seeds Markdown posts
  routes/posts.js      # CRUD routes, slug generation, validation
  data/blog.db         # created at runtime (gitignored)
client/                # Frontend app (its own package.json)
  package.json
  index.html
  vite.config.js       # proxies /api -> http://localhost:4000
  src/
    api.js             # fetch helpers
    App.jsx            # routes
    components/        # Layout, PostCard, TagPill, PostForm, Markdown
    pages/             # Home, Post, NewPost, EditPost, NotFound
    index.css          # warm-zine design system
```

## Notes & scope

- **No authentication** — create/edit/delete are open, since this is a learning
  demo. Adding a login gate would be the natural next step.
- The SQLite file is gitignored, so every clone starts fresh and reseeds.
- Out of scope (kept deliberately small): comments, tag-filter pages, search.

## Concepts practiced

- Full-stack data flow: React → `fetch` → Express → SQL → SQLite → UI
- REST design, validation, and status codes
- Prepared statements / parameterised queries (SQL-injection safe)
- Client-side routing and shared form components
- Rendering user Markdown safely
- One package running an API + a frontend, with a dev proxy and a prod build

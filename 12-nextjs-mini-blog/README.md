# 12 · Next.js Mini Blog

A small blog built with **Next.js (App Router)**, **React**, and **TypeScript**.
Posts come from a typed static data file — no database needed.

## Features

- **Home page** with a hero and the latest posts
- **Posts list** page (`/posts`)
- **Dynamic post detail** page (`/posts/[id]`)
- Static data file (`data/posts.ts`) as the content source
- Reusable components (`Header`, `PostCard`)
- Shared layout with header + footer
- Responsive, clean styling
- Statically generated post pages (`generateStaticParams`)
- Proper 404 handling for unknown post ids

## Project structure

```
app/
  layout.tsx           # Root layout (header, footer, global styles)
  page.tsx             # Home page
  globals.css          # Styles
  posts/
    page.tsx           # All posts
    [id]/
      page.tsx         # Dynamic post detail
components/
  Header.tsx           # Site navigation
  PostCard.tsx         # Reusable post preview card
data/
  posts.ts             # Typed static post data + helpers
```

## Routes

| Route          | Description            |
|----------------|------------------------|
| `/`            | Home                   |
| `/posts`       | List of all posts      |
| `/posts/[id]`  | A single post          |

## Concepts practiced

- Next.js App Router (file-based routing, dynamic segments)
- Layouts and shared UI
- TypeScript types for data (`Post`)
- `generateStaticParams` and `generateMetadata`
- `next/link` for client-side navigation
- The `@/*` path alias

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Build with `npm run build` then `npm start`.

## Add a post

Append a new object to the `posts` array in `data/posts.ts`. Its `id` becomes
the URL slug, and a static page is generated for it automatically.

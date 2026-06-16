import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostById } from "@/data/posts";

// Pre-generate a static page for each post at build time.
export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

// Per-post metadata (title in the browser tab).
export function generateMetadata({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);
  return { title: post ? `${post.title} · Mini Blog` : "Post not found" };
}

// Dynamic post detail page. `params.id` comes from the [id] folder segment.
export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);

  // Show the built-in 404 page if the id doesn't match a post.
  if (!post) {
    notFound();
  }

  return (
    <article className="post">
      <Link href="/posts" className="post__back">
        ← Back to posts
      </Link>
      <h1 className="post__title">{post.title}</h1>
      <p className="post__meta">
        By {post.author} · {post.date}
      </p>
      {post.body.map((paragraph, index) => (
        <p key={index} className="post__paragraph">
          {paragraph}
        </p>
      ))}
    </article>
  );
}

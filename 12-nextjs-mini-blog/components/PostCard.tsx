import Link from "next/link";
import type { Post } from "@/data/posts";

// A reusable preview card for a single post.
export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card">
      <h2 className="card__title">
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="card__meta">
        By {post.author} · {post.date}
      </p>
      <p className="card__excerpt">{post.excerpt}</p>
      <Link href={`/posts/${post.id}`} className="card__link">
        Read more →
      </Link>
    </article>
  );
}

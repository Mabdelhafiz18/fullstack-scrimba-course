import Link from "next/link";
import PostCard from "@/components/PostCard";
import { posts } from "@/data/posts";

// Home page — a hero plus the latest few posts.
export default function HomePage() {
  const latestPosts = posts.slice(0, 2);

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Welcome to Mini Blog</h1>
        <p className="hero__text">
          Short articles on web development, written while learning full-stack
          development. Built with Next.js, React, and TypeScript.
        </p>
        <Link href="/posts" className="btn">
          Browse all posts
        </Link>
      </section>

      <section>
        <h2 className="section-title">Latest posts</h2>
        <div className="grid">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}

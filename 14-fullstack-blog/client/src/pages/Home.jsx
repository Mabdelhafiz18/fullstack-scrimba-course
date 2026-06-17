import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import { listPosts } from "../api.js";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listPosts().then(setPosts).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <section className="intro">
        <p className="intro__eyebrow">Paper Trail · a blog</p>
        <h1 className="intro__title">Notes I keep while learning to build things.</h1>
        <p className="intro__text">
          Short posts on web development — written in Markdown, stored in a real
          database, and served from a little API I built by hand.
        </p>
        <div className="intro__actions">
          <Link to="/new" className="btn">Write a post</Link>
        </div>
      </section>

      {error && <p className="empty">Couldn't load posts: {error}</p>}
      {!posts && !error && <p className="empty">Loading posts…</p>}
      {posts && posts.length === 0 && (
        <p className="empty">No posts yet. Be the first to write one!</p>
      )}

      {posts && posts.length > 0 && (
        <section className="grid">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </section>
      )}
    </>
  );
}

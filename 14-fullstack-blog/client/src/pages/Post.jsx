import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Markdown from "../components/Markdown.jsx";
import TagPill from "../components/TagPill.jsx";
import { getPost, deletePost, parseTags, formatDate } from "../api.js";

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    getPost(slug).then(setPost).catch((e) => setError(e.message));
  }, [slug]);

  async function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    await deletePost(post.id);
    navigate("/");
  }

  if (error) {
    return (
      <div className="center">
        <p className="empty">Post not found.</p>
        <Link to="/" className="btn btn--ghost">Back home</Link>
      </div>
    );
  }

  if (!post) return <p className="empty">Loading…</p>;

  const tags = parseTags(post.tags);

  return (
    <article className="post">
      <Link to="/" className="post__back">← All posts</Link>
      <h1 className="post__title">{post.title}</h1>
      <p className="post__meta">
        {formatDate(post.created_at)} · by {post.author}
      </p>

      {tags.length > 0 && (
        <div className="tags">
          {tags.map((tag) => <TagPill key={tag} tag={tag} />)}
        </div>
      )}

      <div className="post__actions">
        <Link to={`/edit/${post.id}`} className="btn btn--ghost btn--small">Edit</Link>
        <button onClick={handleDelete} className="btn btn--danger btn--small">Delete</button>
      </div>

      <Markdown>{post.body}</Markdown>
    </article>
  );
}

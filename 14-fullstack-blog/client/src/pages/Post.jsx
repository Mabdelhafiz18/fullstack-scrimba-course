import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Markdown from "../components/Markdown.jsx";
import TagPill from "../components/TagPill.jsx";
import PostCard from "../components/PostCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { extractHeadings } from "../lib/toc.js";
import { useAuth } from "../context/auth.jsx";
import {
  getPost,
  getRelated,
  deletePost,
  parseTags,
  formatDate,
  readingTime,
  isEdited,
} from "../api.js";

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [related, setRelated] = useState([]);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    setPost(null);
    setError("");
    setRelated([]);
    setCoverError(false);
    getPost(slug).then(setPost).catch((e) => setError(e.message));
    getRelated(slug).then(setRelated).catch(() => setRelated([]));
  }, [slug]);

  async function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    await deletePost(post.id);
    navigate("/");
  }

  async function handleShare() {
    const url = window.location.href;
    // Prefer the native share sheet where it exists (mostly mobile).
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // reader dismissed the sheet
      }
    }
    // Otherwise copy the link and confirm.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  }

  if (error) {
    return (
      <EmptyState
        tone="error"
        icon="🔍"
        title="Post not found"
        message="That post may have been moved or deleted."
        action={<Link to="/" className="btn btn--ghost">Back home</Link>}
      />
    );
  }

  if (!post) {
    return (
      <article className="post" aria-busy="true" aria-label="Loading post">
        <span className="skel skel--back" />
        <span className="skel skel--posttitle" />
        <span className="skel skel--meta" />
        <div className="post__skel-body">
          <span className="skel skel--text" />
          <span className="skel skel--text" />
          <span className="skel skel--text skel--short" />
        </div>
      </article>
    );
  }

  const tags = parseTags(post.tags);
  const toc = extractHeadings(post.body);

  return (
    <article className="post">
      <Link to="/" className="post__back">← All posts</Link>
      <h1 className="post__title">{post.title}</h1>
      <p className="post__meta">
        {formatDate(post.created_at)} · {readingTime(post.body)} · by {post.author}
      </p>
      {isEdited(post.created_at, post.updated_at) && (
        <p className="post__updated">Updated {formatDate(post.updated_at)}</p>
      )}

      {tags.length > 0 && (
        <div className="tags">
          {tags.map((tag) => (
            <TagPill key={tag} tag={tag} to={`/tags/${encodeURIComponent(tag)}`} />
          ))}
        </div>
      )}

      {post.cover_url && !coverError && (
        <img
          className="post__cover"
          src={post.cover_url}
          alt={post.title}
          loading="lazy"
          onError={() => setCoverError(true)}
        />
      )}

      <div className="post__actions">
        <button
          type="button"
          onClick={handleShare}
          className={`btn btn--ghost btn--small${copied ? " is-copied" : ""}`}
        >
          {copied ? "Link copied!" : "Share"}
        </button>
        {isAuthed && (
          <>
            <Link to={`/edit/${post.id}`} className="btn btn--ghost btn--small">Edit</Link>
            <button onClick={handleDelete} className="btn btn--danger btn--small">Delete</button>
          </>
        )}
      </div>

      {toc.length >= 3 && (
        <nav className="toc" aria-label="Table of contents">
          <p className="toc__label">On this page</p>
          <ul className="toc__list">
            {toc.map((h) => (
              <li key={h.id} className={`toc__item toc__item--h${h.depth}`}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <Markdown>{post.body}</Markdown>

      {related.length > 0 && (
        <section className="related">
          <h2 className="related__title">You might also like</h2>
          <div className="grid">
            {related.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

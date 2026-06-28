import { useState } from "react";
import Markdown from "./Markdown.jsx";

// Shared create/edit form. `initial` pre-fills it for editing.
// `onSubmit` receives the post object; `submitLabel` names the button.
export default function PostForm({ initial = {}, onSubmit, submitLabel = "Publish" }) {
  const [title, setTitle] = useState(initial.title || "");
  const [excerpt, setExcerpt] = useState(initial.excerpt || "");
  const [tags, setTags] = useState(initial.tags || "");
  const [coverUrl, setCoverUrl] = useState(initial.cover_url || "");
  const [body, setBody] = useState(initial.body || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({ title, excerpt, tags, body, cover_url: coverUrl });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A good title"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="excerpt">Excerpt</label>
        <input
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="One-line summary shown on cards"
        />
      </div>

      <div className="field">
        <label htmlFor="cover_url">Cover image URL</label>
        <input
          id="cover_url"
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://… (optional)"
        />
      </div>

      <div className="field">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, sql, writing"
        />
      </div>

      <div className="field">
        <label htmlFor="body">Body (Markdown)</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post in **Markdown**…"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>

      {body.trim() && (
        <div className="preview">
          <p className="preview__label">Live preview</p>
          <Markdown>{body}</Markdown>
        </div>
      )}
    </form>
  );
}

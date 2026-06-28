import { useState } from "react";
import { Link } from "react-router-dom";
import TagPill from "./TagPill.jsx";
import { parseTags, formatDate, readingTime, isEdited } from "../api.js";

// Colour of the card's top strip, rotating through the zine palette.
const STRIPS = ["var(--tomato)", "var(--teal)", "var(--mustard)", "var(--berry)"];

export default function PostCard({ post, index = 0 }) {
  const tags = parseTags(post.tags);
  const [coverError, setCoverError] = useState(false);
  const showCover = post.cover_url && !coverError;
  return (
    // "Stretched link" pattern: the whole card is clickable (via the title
    // link's ::after overlay) while tag pills stay as independent links on top.
    <article className="card">
      {showCover ? (
        // Decorative (the title is adjacent); fall back to the strip if it fails.
        <img
          className="card__cover"
          src={post.cover_url}
          alt=""
          loading="lazy"
          onError={() => setCoverError(true)}
        />
      ) : (
        <div className="card__strip" style={{ backgroundColor: STRIPS[index % STRIPS.length] }} />
      )}
      <div className="card__body">
        <span className="card__date">
          {formatDate(post.created_at)} · {readingTime(post.body)}
          {isEdited(post.created_at, post.updated_at) && (
            <span className="card__edited"> · edited</span>
          )}
        </span>
        <h2 className="card__title">
          <Link to={`/posts/${post.slug}`} className="card__link">
            {post.title}
          </Link>
        </h2>
        <p className="card__excerpt">{post.excerpt}</p>
        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} to={`/tags/${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

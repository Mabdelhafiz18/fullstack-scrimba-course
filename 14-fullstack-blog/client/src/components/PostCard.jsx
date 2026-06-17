import { Link } from "react-router-dom";
import TagPill from "./TagPill.jsx";
import { parseTags, formatDate } from "../api.js";

// Colour of the card's top strip, rotating through the zine palette.
const STRIPS = ["var(--tomato)", "var(--teal)", "var(--mustard)", "var(--berry)"];

export default function PostCard({ post, index = 0 }) {
  const tags = parseTags(post.tags);
  return (
    <Link to={`/posts/${post.slug}`} className="card">
      <div className="card__strip" style={{ backgroundColor: STRIPS[index % STRIPS.length] }} />
      <div className="card__body">
        <span className="card__date">{formatDate(post.created_at)}</span>
        <h2 className="card__title">{post.title}</h2>
        <p className="card__excerpt">{post.excerpt}</p>
        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

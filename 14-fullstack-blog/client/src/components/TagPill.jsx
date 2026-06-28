import { Link } from "react-router-dom";

// A flat colour "sticker" tag. The colour is chosen deterministically from the
// tag text so the same tag always looks the same. Pass `to` to render it as a
// link (e.g. to a tag-filter page); otherwise it's a plain label.
export default function TagPill({ tag, to }) {
  const hash = [...tag].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const className = `pill pill--${hash % 4}`;
  if (to) {
    return (
      <Link to={to} className={className}>
        {tag}
      </Link>
    );
  }
  return <span className={className}>{tag}</span>;
}

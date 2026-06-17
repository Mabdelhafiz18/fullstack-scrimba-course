// A flat colour "sticker" tag. The colour is chosen deterministically from the
// tag text so the same tag always looks the same.
export default function TagPill({ tag }) {
  const hash = [...tag].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const variant = hash % 4;
  return <span className={`pill pill--${variant}`}>{tag}</span>;
}

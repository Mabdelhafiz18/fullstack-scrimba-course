// A single tilted "sticker" panel for empty and error states — keeps the
// cut-paper identity instead of a flat grey message. `tone` switches the badge
// colour; `action` is an optional CTA node (a link or button).
export default function EmptyState({ icon, title, message, action, tone = "default" }) {
  return (
    <div className={`emptystate emptystate--${tone}`}>
      <div className="emptystate__badge" aria-hidden="true">
        {icon}
      </div>
      <h2 className="emptystate__title">{title}</h2>
      {message && <p className="emptystate__text">{message}</p>}
      {action && <div className="emptystate__action">{action}</div>}
    </div>
  );
}

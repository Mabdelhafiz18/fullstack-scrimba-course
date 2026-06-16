// A single die. Renders as a button so it's keyboard-accessible.
export default function Die({ value, isHeld, onClick }) {
  return (
    <button
      className={`die ${isHeld ? "die--held" : ""}`}
      onClick={onClick}
      aria-pressed={isHeld}
      aria-label={`Die showing ${value}, ${isHeld ? "held" : "not held"}`}
    >
      {value}
    </button>
  );
}

// A loading placeholder shaped exactly like a real PostCard — same border,
// offset shadow and tilt, with the coloured strip kept so the feed still feels
// alive while loading. Blank blocks stand in for date / title / excerpt / tags.
const STRIPS = ["var(--tomato)", "var(--teal)", "var(--mustard)", "var(--berry)"];

export default function SkeletonCard({ index = 0 }) {
  return (
    <div className="card card--skeleton" aria-hidden="true">
      <div className="card__strip" style={{ backgroundColor: STRIPS[index % STRIPS.length] }} />
      <div className="card__body">
        <span className="skel skel--date" />
        <span className="skel skel--title" />
        <span className="skel skel--title skel--short" />
        <span className="skel skel--text" />
        <span className="skel skel--text skel--short" />
        <div className="tags">
          <span className="skel skel--pill" />
          <span className="skel skel--pill" />
        </div>
      </div>
    </div>
  );
}

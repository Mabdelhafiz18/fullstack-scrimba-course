import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="center">
      <h1 className="intro__title">Page not found</h1>
      <p className="intro__text" style={{ margin: "0 auto 1.5rem" }}>
        That page wandered off the trail.
      </p>
      <Link to="/" className="btn">Back home</Link>
    </div>
  );
}

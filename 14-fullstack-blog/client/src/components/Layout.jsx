import { Link } from "react-router-dom";

// App shell: masthead with wordmark + tagline, page content, footer.
export default function Layout({ children }) {
  return (
    <div className="shell">
      <header className="masthead">
        <div className="masthead__inner">
          <div>
            <Link to="/" className="wordmark">
              Paper<span>Trail</span>
            </Link>
            <p className="tagline">notes while learning to code</p>
          </div>
          <Link to="/new" className="btn btn--small">
            Write a post
          </Link>
        </div>
      </header>

      <main className="wrap">{children}</main>

      <footer className="footer">
        <div className="footer__inner">
          <span>Paper Trail — a full-stack blog demo</span>
          
        </div>
      </footer>
    </div>
  );
}

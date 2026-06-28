import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/auth.jsx";

// App shell: masthead with wordmark + tagline, page content, footer.
export default function Layout({ children }) {
  const { isAuthed, logout } = useAuth();
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
          <div className="masthead__actions">
            <ThemeToggle />
            {isAuthed ? (
              <>
                <Link to="/new" className="btn btn--small">
                  Write a post
                </Link>
                <button type="button" className="btn btn--ghost btn--small" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn--ghost btn--small">
                Log in
              </Link>
            )}
          </div>
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

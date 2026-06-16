import Link from "next/link";

// Shared site header, rendered by the root layout on every page.
export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <Link href="/" className="header__logo">
          ✍️ Mini Blog
        </Link>
        <div className="header__links">
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
        </div>
      </nav>
    </header>
  );
}

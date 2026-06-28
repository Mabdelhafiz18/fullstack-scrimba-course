import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PostList from "../components/PostList.jsx";
import { usePosts } from "../hooks/usePosts.js";
import { useAuth } from "../context/auth.jsx";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-tags", label: "Most tags" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthed } = useAuth();

  // Sort lives in the URL so a sorted view is shareable / bookmarkable.
  const sort = searchParams.get("sort") || "newest";
  function changeSort(value) {
    const next = new URLSearchParams(searchParams);
    if (value === "newest") next.delete("sort");
    else next.set("sort", value);
    setSearchParams(next, { replace: true });
  }

  // Debounce the search box so we fetch once the user pauses, not per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const { posts, error, loading, reload } = usePosts({ q: debounced, sort });
  const searching = debounced.trim() !== "";

  const empty = searching
    ? {
        icon: "🔍",
        title: "No matches",
        message: `Nothing matches “${debounced.trim()}”. Try another word.`,
        action: (
          <button type="button" className="btn btn--ghost" onClick={() => setQuery("")}>
            Clear search
          </button>
        ),
      }
    : {
        icon: "✏️",
        title: "A blank page",
        message: "No posts yet — the first one could be yours.",
        action: (
          <Link to="/new" className="btn">
            Write a post
          </Link>
        ),
      };

  return (
    <>
      <section className="intro">
        <p className="intro__eyebrow">Paper Trail · a blog</p>
        <h1 className="intro__title">Notes I keep while learning to build things.</h1>
        <p className="intro__text">
          Short posts on web development — written in Markdown, stored in a real
          database, and served from a little API I built by hand.
        </p>
        {isAuthed && (
          <div className="intro__actions">
            <Link to="/new" className="btn">Write a post</Link>
          </div>
        )}
      </section>

      <div className="controls">
        <input
          type="search"
          className="searchbar__input"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search posts"
        />
        <label className="sort">
          <span className="sort__label">Sort</span>
          <select
            className="sort__select"
            value={sort}
            onChange={(e) => changeSort(e.target.value)}
            aria-label="Sort posts"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <PostList
        posts={posts}
        loading={loading}
        error={error}
        onRetry={reload}
        empty={empty}
      />
    </>
  );
}

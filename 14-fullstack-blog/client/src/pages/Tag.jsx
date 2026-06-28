import { useParams, Link } from "react-router-dom";
import PostList from "../components/PostList.jsx";
import { usePosts } from "../hooks/usePosts.js";

export default function Tag() {
  const { tag } = useParams();
  const { posts, error, loading, reload } = usePosts({ tag });

  const empty = {
    icon: "🏷️",
    title: "Nothing tagged that",
    message: `No posts are tagged “${tag}”.`,
    action: (
      <Link to="/" className="btn btn--ghost">
        Show all posts
      </Link>
    ),
  };

  return (
    <>
      <section className="intro">
        <p className="intro__eyebrow">Tagged</p>
        <h1 className="intro__title">#{tag}</h1>
        <div className="intro__actions">
          <Link to="/" className="btn btn--ghost">← All posts</Link>
        </div>
      </section>

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

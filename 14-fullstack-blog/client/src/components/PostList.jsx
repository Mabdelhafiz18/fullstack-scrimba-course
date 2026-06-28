import PostCard from "./PostCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import EmptyState from "./EmptyState.jsx";

// Renders a feed of posts and the states around it: error, first-load
// skeletons, contextual empty state, or the grid. Used by Home and Tag.
//   posts === null  -> not loaded yet
//   empty           -> { icon, title, message, action } shown when zero results
export default function PostList({ posts, loading, error, onRetry, empty, skeletonCount = 6 }) {
  if (error) {
    return (
      <EmptyState
        tone="error"
        icon="!"
        title="Couldn't load posts"
        message={error}
        action={
          onRetry && (
            <button type="button" className="btn btn--ghost" onClick={onRetry}>
              Try again
            </button>
          )
        }
      />
    );
  }

  if (loading && !posts) {
    return (
      <section className="grid" aria-busy="true" aria-label="Loading posts">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </section>
    );
  }

  if (posts && posts.length === 0) {
    return <EmptyState {...empty} />;
  }

  return (
    <section className="grid">
      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} index={i} />
      ))}
    </section>
  );
}

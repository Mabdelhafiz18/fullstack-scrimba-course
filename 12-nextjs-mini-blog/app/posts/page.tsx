import PostCard from "@/components/PostCard";
import { posts } from "@/data/posts";

export const metadata = {
  title: "All Posts · Mini Blog",
};

// Posts listing page.
export default function PostsPage() {
  return (
    <>
      <h1 className="section-title">All posts</h1>
      <div className="grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

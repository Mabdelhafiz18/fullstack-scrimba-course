import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm.jsx";
import { listPosts, updatePost } from "../api.js";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  // The list endpoint returns every field, so we find our post by id from it.
  useEffect(() => {
    listPosts()
      .then((posts) => {
        const found = posts.find((p) => String(p.id) === id);
        if (found) setPost(found);
        else setError("Post not found");
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleUpdate(values) {
    const updated = await updatePost(id, values);
    navigate(`/posts/${updated.slug}`);
  }

  if (error) return <p className="empty">{error}</p>;
  if (!post) return <p className="empty">Loading…</p>;

  return (
    <div className="form-page">
      <h1 className="form-page__title">Edit post</h1>
      <PostForm initial={post} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm.jsx";
import { createPost } from "../api.js";

export default function NewPost() {
  const navigate = useNavigate();

  async function handleCreate(values) {
    const post = await createPost(values);
    navigate(`/posts/${post.slug}`);
  }

  return (
    <div className="form-page">
      <h1 className="form-page__title">Write a post</h1>
      <PostForm onSubmit={handleCreate} submitLabel="Publish" />
    </div>
  );
}

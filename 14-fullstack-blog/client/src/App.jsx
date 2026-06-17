import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Post from "./pages/Post.jsx";
import NewPost from "./pages/NewPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

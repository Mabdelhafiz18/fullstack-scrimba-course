import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Tag from "./pages/Tag.jsx";
import Post from "./pages/Post.jsx";
import NewPost from "./pages/NewPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./context/auth.jsx";

// Redirects to /login (remembering where you were) unless signed in.
function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tags/:tag" element={<Tag />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new" element={<RequireAuth><NewPost /></RequireAuth>} />
        <Route path="/edit/:id" element={<RequireAuth><EditPost /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

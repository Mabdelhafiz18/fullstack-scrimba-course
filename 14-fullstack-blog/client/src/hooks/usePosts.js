import { useState, useEffect, useCallback } from "react";
import { listPosts } from "../api.js";

// Fetches the post feed for the given params ({ q, tag }) and exposes
// loading / error state plus a `reload` for retrying. Previous results are kept
// while a new request is in flight, so re-fetches (e.g. typing in search) don't
// flash a loading state — only the first load shows skeletons.
export function usePosts(params = {}) {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const key = JSON.stringify(params);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    listPosts(JSON.parse(key))
      .then((data) => active && setPosts(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [key, nonce]);

  return { posts, error, loading, reload };
}

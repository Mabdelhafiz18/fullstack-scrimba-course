import express from "express";
import postsRouter from "./routes/posts.js";

const app = express();
// Default to 5050 (port 4000 is taken by a system service on some machines).
const PORT = process.env.PORT || 5050;

app.use(express.json());

// Allow the Vite dev frontend to call the API directly if it ever bypasses the
// proxy. Harmless for a local learning project.
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// API routes.
app.use("/api/posts", postsRouter);

// 404 for unknown API routes.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Blog API running at http://localhost:${PORT}`);
});

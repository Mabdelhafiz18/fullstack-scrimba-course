import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";

// Builds the Express app without starting a server, so tests can drive it with
// supertest. server.js imports this, initialises the DB, then calls listen().
export function createApp() {
  const app = express();
  const isTest = process.env.NODE_ENV === "test";

  // Secure HTTP headers. Allow the JSON API to be read cross-origin (the
  // frontend may live on another origin in production); CORS still gates access.
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  // Restrict browser callers to the configured frontend origin.
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );

  // Parse JSON and cap the body size (a basic DoS guard).
  app.use(express.json({ limit: "100kb" }));

  // Rate limiting — disabled under tests so the suite isn't throttled.
  if (!isTest) {
    const limit = (max) =>
      rateLimit({ windowMs: 15 * 60 * 1000, max, standardHeaders: true, legacyHeaders: false });
    app.use("/api", limit(300)); // general
    app.use("/api/login", limit(10)); // stricter on login (brute-force guard)
  }

  // API routes.
  app.use("/api/login", authRouter);
  app.use("/api/posts", postsRouter);

  // 404 for unknown API routes.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Central error handler. Client errors (bad/too-large JSON) report their own
  // status; everything else is a 500.
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode;
    if (status && status < 500) {
      return res.status(status).json({ error: "Bad request" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

const app = createApp();
export default app;

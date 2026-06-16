import express from "express";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies.
app.use(express.json());

// Simple request logger.
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check / root route.
app.get("/", (_req, res) => {
  res.json({
    message: "Tasks API is running.",
    endpoints: [
      "GET    /tasks",
      "GET    /tasks/:id",
      "POST   /tasks",
      "PUT    /tasks/:id",
      "DELETE /tasks/:id",
    ],
  });
});

app.use("/tasks", tasksRouter);

// 404 handler for unknown routes.
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

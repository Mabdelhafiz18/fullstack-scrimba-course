import { Router } from "express";

const router = Router();

// In-memory store. Resets when the server restarts — fine for a learning demo.
let tasks = [
  { id: 1, title: "Learn Express", completed: true },
  { id: 2, title: "Build a REST API", completed: false },
  { id: 3, title: "Write a README", completed: false },
];
let nextId = 4;

// Validate the body of a create/update request.
// Returns an array of error messages (empty if valid).
function validateTask(body) {
  const errors = [];
  if (typeof body.title !== "string" || body.title.trim() === "") {
    errors.push("`title` is required and must be a non-empty string.");
  }
  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("`completed` must be a boolean.");
  }
  return errors;
}

// GET /tasks — list all tasks.
router.get("/", (_req, res) => {
  res.json(tasks);
});

// GET /tasks/:id — get one task.
router.get("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

// POST /tasks — create a task.
router.post("/", (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const task = {
    id: nextId++,
    title: req.body.title.trim(),
    completed: req.body.completed ?? false,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id — replace/update a task.
router.put("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const errors = validateTask(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  task.title = req.body.title.trim();
  task.completed = req.body.completed ?? task.completed;
  res.json(task);
});

// DELETE /tasks/:id — remove a task.
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
});

export default router;

import { Router } from "express";
import { verifyPassword, signToken } from "../auth.js";

const router = Router();

// POST /api/login — exchange the admin password for a token.
router.post("/", (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== "string" || password === "") {
    return res.status(400).json({ error: "`password` is required." });
  }
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  res.json({ token: signToken() });
});

export default router;

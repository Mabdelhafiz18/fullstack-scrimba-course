import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set — login will not work. See .env.example");
}

// Single-admin auth: compare the submitted password against the stored bcrypt
// hash. There are no user accounts — just one shared admin password.
export function verifyPassword(password) {
  if (!ADMIN_PASSWORD_HASH || typeof password !== "string") return false;
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

// Issue a short-lived signed token after a successful login.
export function signToken() {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "2h" });
}

// Express middleware: require a valid Bearer token, else 401.
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

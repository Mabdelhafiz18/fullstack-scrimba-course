// Runs before every test file (and before the test file imports db.js/app.js).
// Point the connection at the dedicated TEST database so tests never touch dev data.
import "dotenv/config";
import bcrypt from "bcryptjs";

if (!process.env.TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is not set — see .env.example");
}

// db.js reads DATABASE_URL when it creates the pool. dotenv won't override a value
// that's already set, so overriding it here wins.
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

// Self-contained auth config for tests (independent of .env).
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("test-password", 10);

// Shared across tests: the admin password the login route expects.
export const TEST_PASSWORD = "test-password";

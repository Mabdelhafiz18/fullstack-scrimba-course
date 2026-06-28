import "dotenv/config";
import app from "./app.js";
import { initSchema } from "./db.js";

const PORT = process.env.PORT || 5050;

// Create the schema (if needed) before accepting requests.
initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Blog API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialise the database:", err);
    process.exit(1);
  });

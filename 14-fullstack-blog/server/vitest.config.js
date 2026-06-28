import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.js"],
    // One shared test database — never run test files in parallel against it.
    fileParallelism: false,
  },
});

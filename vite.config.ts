import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { host: "0.0.0.0", port: 5174, strictPort: true, proxy: {"/api":"http://127.0.0.1:5175", "/media":"http://127.0.0.1:5175"} },
  preview: { host: "0.0.0.0", port: 5174, strictPort: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
    setupFiles: "./src/test-setup.ts",
  },
});

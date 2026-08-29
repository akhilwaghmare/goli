import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@goli/ui/globals.css", replacement: path.resolve(import.meta.dirname, "../../packages/ui/src/styles/globals.css") },
      { find: "@goli/ui", replacement: path.resolve(import.meta.dirname, "../../packages/ui/src") },
      { find: "@", replacement: path.resolve(import.meta.dirname, "./src") },
    ],
  },
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
});

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    emptyOutDir: true,
    outDir: "dist-electron",
    lib: { entry: "src/main.ts", formats: ["cjs"], fileName: "main" },
    rollupOptions: { external: ["electron"] },
  },
});

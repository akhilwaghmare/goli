import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    emptyOutDir: false,
    outDir: "dist-electron",
    lib: { entry: "src/preload.ts", formats: ["cjs"], fileName: "preload" },
    rollupOptions: { external: ["electron"] },
  },
});

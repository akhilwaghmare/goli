import { defineConfig } from "vite";

// Release CI supplies the repository. Development builds should not query a production feed.
const updateRepository = process.env.GOLI_UPDATE_REPOSITORY ?? process.env.GITHUB_REPOSITORY ?? "";

export default defineConfig({
  define: { __GOLI_UPDATE_REPOSITORY__: JSON.stringify(updateRepository) },
  build: {
    ssr: true,
    emptyOutDir: true,
    outDir: "dist-electron",
    lib: { entry: "src/main.ts", formats: ["cjs"], fileName: "main" },
    rollupOptions: { external: ["electron"] },
  },
});

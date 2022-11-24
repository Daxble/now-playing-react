import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "esbuild",
  },
  plugins: [
    preact(),
    viteSingleFile({
      removeViteModuleLoader: true,
    }),
  ],
});

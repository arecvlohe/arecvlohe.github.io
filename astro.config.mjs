import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

export default defineConfig({
  integrations: [preact(), tailwind()],
  site: process.env.BUILD_GITLAB ? "https://arecvlohe.gitlab.com" : "https://arecvlohe.github.io",
  outDir: process.env.BUILD_GITLAB ? "public" : undefined,
});

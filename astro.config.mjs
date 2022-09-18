import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [preact(), tailwind(), sitemap()],
  site: process.env.BUILD_GITLAB
    ? "https://adamrecvlohe.com"
    : "https://arecvlohe.github.io",
  outDir: process.env.BUILD_GITLAB ? "public" : undefined,
});

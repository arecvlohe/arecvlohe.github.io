import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [preact(), sitemap()],
  site: process.env.BUILD_GITLAB
    ? "https://adamrecvlohe.com"
    : "https://arecvlohe.github.io",
  outDir: process.env.BUILD_GITLAB ? "public" : undefined,
  publicDir: process.env.BUILD_GITLAB ? "static" : undefined,
});

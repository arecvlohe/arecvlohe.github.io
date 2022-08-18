import preact from "@astrojs/preact";
// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
  // Enable the Preact renderer to support Preact JSX components.
  integrations: [preact()],
  site: process.env.BUILD_GITLAB ? "https://arecvlohe.gitlab.com" : "https://arecvlohe.github.io",
  outDir: process.env.BUILD_GITLAB ? "public" : undefined,
});

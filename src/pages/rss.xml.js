import rss from "@astrojs/rss";

const postImportResult = import.meta.glob("./posts/**/*.md", { eager: true });
const posts = Object.values(postImportResult);

export const get = () =>
  rss({
    title: "Adam Recvlohe’s Blog",
    description: "An archive of Adam's personal blog.",
    site: process.env.BUILD_GITLAB
      ? "https://adamrecvlohe.com"
      : "https://arecvlohe.github.io",
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.publishDate,
    })),
    ...(process.env.BUILD_GITLAB
      ? { stylesheet: "/rss/pretty-feed-v3.xsl" }
      : {}),
  });

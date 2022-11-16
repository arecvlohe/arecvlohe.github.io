import rss from "@astrojs/rss";
import sortBy from "lodash.sortby";

const articleImportResult = import.meta.glob("./**/*.mdx", { eager: true });
const articles = Object.values(articleImportResult);
const nextArticles = sortBy(articles, [
  "frontmatter.publishDate",
  "frontmatter.title",
]);

export const get = () =>
  rss({
    title: "Adam Recvlohe's Blog",
    description: "An archive of Adam's personal blog.",
    site: process.env.BUILD_GITLAB
      ? "https://adamrecvlohe.com"
      : "https://arecvlohe.github.io",
    items: nextArticles.map((article) => ({
      link: article.url,
      title: article.frontmatter.title,
      pubDate: article.frontmatter.publishDate,
    })),
    ...(process.env.BUILD_GITLAB
      ? { stylesheet: "/rss/pretty-feed-v3.xsl" }
      : {}),
  });

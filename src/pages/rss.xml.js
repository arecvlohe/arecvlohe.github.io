import rss from "@astrojs/rss";
import sortBy from "lodash.sortby";

const posts = import.meta.glob("./posts/*.mdx", { eager: true });
const tutorials = import.meta.glob("./tutorials/*.mdx", { eager: true });
const articles = Object.values(posts).concat(Object.values(tutorials));
const nextArticles = sortBy(articles, [
  "frontmatter.publishDate",
  "frontmatter.title",
]);
nextArticles.reverse();

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
      description: article.frontmatter.description,
      guid: article.url,
    })),
    ...(process.env.BUILD_GITLAB
      ? { stylesheet: "/rss/pretty-feed-v3.xsl" }
      : {}),
  });

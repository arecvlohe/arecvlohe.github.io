import type { MarkdownInstance } from "astro";

export interface Frontmatter {
  title: string;
  publishDate: string;
  description?: string;
  layout: string;
}

export interface ArticlePreview {
  post: MarkdownInstance<Frontmatter>;
}

export type Markdown = MarkdownInstance<Frontmatter>;

export type Article = Pick<Markdown["frontmatter"], "title" | "publishDate"> &
  Pick<Markdown, "url">;

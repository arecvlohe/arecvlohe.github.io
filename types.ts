import type { MarkdownInstance } from "astro";

export interface Frontmatter {
  title: string;
  publishDate: string;
  description?: string;
  layout: string;
}

export interface PostPreview {
  post: MarkdownInstance<Frontmatter>;
}

export type Post = MarkdownInstance<Frontmatter>;

export type BlogPost = Pick<Post["frontmatter"], "title" | "publishDate">;

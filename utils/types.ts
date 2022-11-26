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

export type WebMentions = {
  count: number;
  type: {
    bookmark?: number;
    mention?: number;
    "rsvp-maybe"?: number;
    "rsvp-no"?: number;
    "rsvp-yes"?: number;
  };
};

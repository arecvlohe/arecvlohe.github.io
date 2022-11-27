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

export type Webmentions = {
  count: number;
  type: {
    bookmark?: number;
    mention?: number;
    "rsvp-maybe"?: number;
    "rsvp-no"?: number;
    "rsvp-yes"?: number;
  };
};

export type WebmentionsFeed = {
  type: string;
  name: string;
  children: Array<{
    type: string;
    author: {
      type: string;
      name: string;
      photo: string;
      url: string;
    };
    url: string;
    published: string | null;
    "wm-received": string;
    "wm-id": number;
    "wm-source": string;
    "wm-target": string;
    "mention-of": string;
    "wm-property": string;
    "wm-private": boolean;
  }>;
};

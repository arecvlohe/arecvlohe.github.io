import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { WebmentionsFeed } from "../../utils/types";

export const Webmentions = ({ url }: { url: string }) => {
  const [mentions, setMentions] = useState<WebmentionsFeed | null>(null);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((r) => setMentions(r));
  }, []);

  return mentions?.children.length === 0 ? (
    <p>
      This article has no{" "}
      <a
        rel="noopener noreferrer"
        href="https://www.ctrl.blog/entry/setup-webmention.html"
      >
        Webmentions
      </a>
    </p>
  ) : (
    <p>
      This article has {mentions?.children.length}{" "}
      <a
        rel="noopener noreferrer"
        href="https://www.ctrl.blog/entry/setup-webmention.html"
      >
        Webmentions
      </a>
    </p>
  );
};

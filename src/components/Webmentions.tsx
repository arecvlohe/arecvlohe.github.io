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
        href="https://www.w3.org/TR/webmention/#h-abstract"
      >
        Webmentions
      </a>
    </p>
  ) : (
    <p>
      This article has {mentions?.children.length}{" "}
      <a
        rel="noopener noreferrer"
        href="https://www.w3.org/TR/webmention/#h-abstract"
      >
        {["Webmention", mentions?.children.length === 1 ? "" : "s"].join("")}
      </a>
      <ul>
        {mentions?.children.map((m) => {
          return (
            <li>
              <a rel="noopener" href={m["wm-source"]}>
                {m["wm-source"]}
              </a>
            </li>
          );
        })}
      </ul>
    </p>
  );
};

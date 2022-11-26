import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { WebMentions as WebMentionsType } from "../../utils/types";

export const WebMentions = ({ url }: { url: string }) => {
  const [mentions, setMentions] = useState<WebMentionsType | null>(null);

  useEffect(() => {
    fetch(`https://webmention.io/api/count?target=${url}`)
      .then((r) => r.json())
      .then((r) => setMentions(r));
  }, []);

  return mentions?.type?.mention || 0 < 1 ? (
    <p>
      This article has no{" "}
      <a
        rel="noopener noreferrer"
        href="https://www.w3.org/TR/webmention/#h-abstract"
      >
        WebMentions
      </a>
    </p>
  ) : (
    <p>
      This article has {mentions?.type.mention}{" "}
      <a
        rel="noopener noreferrer"
        href="https://www.w3.org/TR/webmention/#h-abstract"
      >
        WebMentions
      </a>
    </p>
  );
};

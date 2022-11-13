import * as git from "git-last-commit";

export const mkAssetsPath = (path: string): string => {
  return process.env.NODE_ENV === "production"
    ? `/assets/${path}`
    : `/static/assets/${path}`;
};

const options = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "America/Chicago",
} as const;

export const lastUpdated = (): Promise<{ date: string; hash: string }> => {
  return new Promise((res, rej) => {
    git.getLastCommit((err, commit) => {
      if (err) {
        return rej(`Failed to get last commit with: ${err.message}`);
      }

      try {
        const unixTimestamp = parseInt(commit.authoredOn, 10) * 1000;
        const date = new Date(unixTimestamp)
          .toLocaleDateString("en", options)
          .replace(/,/g, "");
        const hash = commit.hash;
        const result = {
          date,
          hash,
        };
        res(result);
      } catch (e) {
        return rej(`Failed to parse last commit with: ${e}`);
      }
    });
  });
};

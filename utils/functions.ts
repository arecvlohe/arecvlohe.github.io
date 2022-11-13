import * as git from "git-last-commit";

export const mkAssetsPath = (path: string): string => {
  return process.env.NODE_ENV === "production"
    ? `/assets/${path}`
    : `/static/assets/${path}`;
};

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

export const lastUpdated = (): Promise<string> => {
  return new Promise((res, rej) => {
    git.getLastCommit((err, commit) => {
      if (err) {
        return rej(`Failed to get last commit with: ${err.message}`);
      }

      try {
        const unixTimestamp = parseInt(commit.authoredOn, 10) * 1000;
        const date = new Date(unixTimestamp);
        res(date.toLocaleDateString("en", options));
      } catch (e) {
        return rej(`Failed to parse last commit with: ${e}`);
      }
    });
  });
};

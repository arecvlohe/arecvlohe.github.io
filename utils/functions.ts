export const mkAssetsPath = (path: string): string => {
  return process.env.NODE_ENV === "production"
    ? `/assets/${path}`
    : `/static/assets/${path}`;
};

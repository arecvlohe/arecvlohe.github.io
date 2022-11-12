export function Gist({ src }: { src: string }) {
  return (
    <iframe frameborder="0" scrolling="no" width="100%" src={src}></iframe>
  );
}

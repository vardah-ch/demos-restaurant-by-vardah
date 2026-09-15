export function SafeImage({ src, alt, className, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src =
          'data:image/svg+xml;utf8,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect fill="#E8E0D4" width="800" height="600"/><text x="50%" y="50%" text-anchor="middle" fill="#5C6B64" font-family="sans-serif" font-size="28">Image unavailable</text></svg>`,
          );
      }}
      {...props}
    />
  );
}

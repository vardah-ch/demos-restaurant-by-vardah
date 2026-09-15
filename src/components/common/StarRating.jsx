export function StarRating({ value = 0, size = 16, className = '' }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className={`inline-flex items-center gap-0.5 text-accent ${className}`} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={index < rounded ? 'fill-current' : 'fill-none stroke-current opacity-30'}
        >
          <path
            strokeWidth="1.6"
            d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z"
          />
        </svg>
      ))}
    </span>
  );
}

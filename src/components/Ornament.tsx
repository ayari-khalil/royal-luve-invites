export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M10 20 H70" />
      <path d="M130 20 H190" />
      <path d="M100 8 C 92 14 92 26 100 32 C 108 26 108 14 100 8 Z" />
      <circle cx="100" cy="20" r="2" fill="currentColor" />
      <circle cx="80" cy="20" r="1.5" fill="currentColor" />
      <circle cx="120" cy="20" r="1.5" fill="currentColor" />
      <path d="M70 20 q 5 -8 10 0" />
      <path d="M120 20 q 5 -8 10 0" />
      <path d="M70 20 q 5 8 10 0" />
      <path d="M120 20 q 5 8 10 0" />
    </svg>
  );
}
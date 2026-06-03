import { useMemo } from "react";

export function FloatingPetals({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 14,
        size: 14 + Math.random() * 22,
        rotate: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {petals.map((p) => (
        <svg
          key={p.id}
          width={p.size}
          height={p.size}
          viewBox="0 0 24 24"
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-10vh",
            opacity: p.opacity,
            animation: `float-petal ${p.duration}s linear ${p.delay}s infinite`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <path
            d="M12 2 C16 6 18 10 12 22 C6 10 8 6 12 2 Z"
            fill="url(#petalGrad)"
          />
          <defs>
            <linearGradient id="petalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8E8E8" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
}
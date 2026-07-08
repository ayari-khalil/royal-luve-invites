"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ─── Deterministic pseudo-random (no hydration mismatch) ───────────────────
function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. FLOATING HEARTS  — soft, slow, organic drift upward
// ═══════════════════════════════════════════════════════════════════════════
interface FloatingHeartsProps {
  count?: number;
  /** "gold" for Noir-Émeraude palette, "rose" for Royal-Or palette */
  palette?: "gold" | "rose";
  className?: string;
}

export function FloatingHearts({
  count = 18,
  palette = "gold",
  className = "",
}: FloatingHeartsProps) {
  const hearts = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: seeded(i) * 90 + 5,          // 5–95 %
      delay: seeded(i + 50) * 12,          // 0–12 s
      duration: 14 + seeded(i + 100) * 10, // 14–24 s
      size: 8 + seeded(i + 150) * 14,      // 8–22 px
      opacity: 0.18 + seeded(i + 200) * 0.22, // 0.18–0.40
      drift: (seeded(i + 250) - 0.5) * 80,    // horizontal drift px
      rotate: (seeded(i + 300) - 0.5) * 30,   // gentle tilt
    })),
    [count]
  );

  const colors =
    palette === "gold"
      ? ["#d4af37", "#f0d78c", "#b8972e", "#e8c96a"]
      : ["#c084a0", "#e8a0bc", "#d4607a", "#f0c0d0"];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: "-5%",
            animation: `floatHeart ${h.duration}s ease-in-out ${h.delay}s infinite`,
            "--drift": `${h.drift}px`,
            "--rotate": `${h.rotate}deg`,
          } as React.CSSProperties}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={colors[h.id % colors.length]}
            style={{ opacity: h.opacity, filter: "blur(0.3px)" }}
          >
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. GOLDEN PARTICLES  — tiny glimmering dust motes
// ═══════════════════════════════════════════════════════════════════════════
interface GoldenParticlesProps {
  count?: number;
  color?: string;
  glowColor?: string;
  className?: string;
}

export function GoldenParticles({
  count = 45,
  color = "#d4af37",
  glowColor = "#d4af37",
  className = "",
}: GoldenParticlesProps) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: seeded(i + 10) * 100,
      top: seeded(i + 60) * 100,
      size: 1 + seeded(i + 110) * 2.2,
      duration: 4 + seeded(i + 160) * 5,
      delay: seeded(i + 210) * 6,
    })),
    [count]
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${glowColor}`,
            animation: `particlePulse ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. FLOATING PETALS  — classic soft petal fall (replaces or extends existing)
// ═══════════════════════════════════════════════════════════════════════════
interface FloatingPetalsEnhancedProps {
  count?: number;
  palette?: "gold" | "rose";
  className?: string;
}

export function FloatingPetalsEnhanced({
  count = 20,
  palette = "rose",
  className = "",
}: FloatingPetalsEnhancedProps) {
  const petals = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: seeded(i + 5) * 95 + 2,
      delay: seeded(i + 55) * 14,
      duration: 16 + seeded(i + 105) * 12,
      size: 10 + seeded(i + 155) * 10,
      opacity: 0.25 + seeded(i + 205) * 0.35,
      drift: (seeded(i + 255) - 0.5) * 120,
      rotate: seeded(i + 305) * 360,
    })),
    [count]
  );

  const petalPath =
    "M12 2C12 2 8 6 8 10C8 14 10 16 12 21C14 16 16 14 16 10C16 6 12 2 12 2Z";

  const colors =
    palette === "rose"
      ? ["#f9c8d8", "#f0a0b8", "#e87898", "#fde0ea"]
      : ["#d4af37", "#e8c96a", "#b8972e", "#f0d78c"];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-5%",
            animation: `petalFall ${p.duration}s ease-in-out ${p.delay}s infinite`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            style={{
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
              filter: "blur(0.4px)",
            }}
          >
            <path d={petalPath} fill={colors[p.id % colors.length]} />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. TITLE GLOW  — delicate text shimmer on headings
//    Wrap any heading text to add a soft repeating shimmer
// ═══════════════════════════════════════════════════════════════════════════
interface TitleGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string; // glow color, default gold
}

export function TitleGlow({
  children,
  className = "",
  color = "rgba(212,175,55,0.6)",
}: TitleGlowProps) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        animation: "titleGlow 4s ease-in-out infinite",
        "--glow-color": color,
      } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. SCROLL REVEAL  — elegant fade + lift, with optional stagger for children
// ═══════════════════════════════════════════════════════════════════════════
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. PARALLAX BACKGROUND LAYER  — subtle depth on scroll
// ═══════════════════════════════════════════════════════════════════════════
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // 0.1 (slow) – 0.5 (fast)
  className?: string;
}

export function ParallaxLayer({
  children,
  speed = 0.15,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  const y = useSpring(raw, { stiffness: 60, damping: 25 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. HOVER CARD LIFT  — refined card elevation on hover
// ═══════════════════════════════════════════════════════════════════════════
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function HoverLift({
  children,
  className = "",
  scale = 1.015,
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        y: -4,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      whileTap={{ scale: 0.99 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. ANIMATED DIVIDER  — gold line that draws itself on scroll
// ═══════════════════════════════════════════════════════════════════════════
interface AnimatedDividerProps {
  color?: string;
  width?: string;
  className?: string;
}

export function AnimatedDivider({
  color = "#d4af37",
  width = "120px",
  className = "",
}: AnimatedDividerProps) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`origin-center mx-auto ${className}`}
      style={{
        height: "1px",
        width,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. PULSE RING  — subtle concentric ring pulse (good around monogram / seal)
// ═══════════════════════════════════════════════════════════════════════════
interface PulseRingProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PulseRing({
  size = 120,
  color = "rgba(212,175,55,0.35)",
  className = "",
}: PulseRingProps) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${color}`,
            animation: `pulseRing 3s ease-out ${i * 1}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. STAGGER CHILDREN  — wraps children and staggers their scroll reveal
// ═══════════════════════════════════════════════════════════════════════════
interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.12,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

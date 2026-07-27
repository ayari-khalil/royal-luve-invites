import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { MapPin, Calendar, MessageCircle, Sparkles as SparkleIcon, Volume2, VolumeX } from "lucide-react";
import type { Invitation } from "@/data/invitations";
import { useCountdown } from "@/hooks/useCountdown";
import {
  FloatingHearts,
  GoldenParticles,
  ScrollReveal,
  TitleGlow,
  HoverLift,
  AnimatedDivider,
  PulseRing,
  StaggerChildren,
  staggerItem,
} from "@/components/WeddingAnimations";

const DEFAULT_WEDDING_PHOTO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";

/* ────────────────────────────────────────────────────────────────────────────
   PREMIUM VELVET CURTAIN DEFINITIONS
   ──────────────────────────────────────────────────────────────────────────── */

/** High-detail vertical folds of dark crimson velvet with light catches and shadows. */
const VELVET_BG_LEFT = `
  linear-gradient(90deg, rgba(0,0,0,0.85) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.4) 100%),
  repeating-linear-gradient(
    90deg,
    #2b020a 0px,
    #4a0510 12px,
    #700a1b 24px,
    #98152c 36px,
    #c4233c 48px,
    #98152c 60px,
    #700a1b 72px,
    #4a0510 84px,
    #2b020a 96px
  )
`;

const VELVET_BG_RIGHT = `
  linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.85) 100%),
  repeating-linear-gradient(
    90deg,
    #2b020a 0px,
    #4a0510 12px,
    #700a1b 24px,
    #98152c 36px,
    #c4233c 48px,
    #98152c 60px,
    #700a1b 72px,
    #4a0510 84px,
    #2b020a 96px
  )
`;

function VelvetPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute inset-y-0 w-full"
      style={{
        background: side === "left" ? VELVET_BG_LEFT : VELVET_BG_RIGHT,
        boxShadow:
          side === "left"
            ? "inset -25px 0 50px rgba(0,0,0,0.65)"
            : "inset 25px 0 50px rgba(0,0,0,0.65)",
      }}
    >
      {/* Dynamic specular light filter overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,230,170,0.14) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Gold embroidery lace trim on the parting borders */}
      <div
        className="absolute inset-y-0 w-2.5"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          background: "repeating-linear-gradient(180deg, #d4af37 0px, #f0d78c 4px, #b8860b 8px, #d4af37 12px)",
          boxShadow: "0 0 10px rgba(212,175,55,0.5)",
        }}
      />
    </div>
  );
}

/** Luxury scalloped pelmet/valance that crowns the top edge. */
function Valance() {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <svg
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
        className="w-full h-28 md:h-36 block drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]"
      >
        <defs>
          <linearGradient id="valanceVelvetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f0512" />
            <stop offset="60%" stopColor="#2e020a" />
            <stop offset="100%" stopColor="#150004" />
          </linearGradient>
        </defs>
        {/* Six deep regal swags */}
        <path
          d="M0 0 H1200 V60
             Q1100 135 1000 60
             Q900 135 800 60
             Q700 135 600 60
             Q500 135 400 60
             Q300 135 200 60
             Q100 135 0 60 Z"
          fill="url(#valanceVelvetGrad)"
        />
        {/* Intricate gold lace pattern outline */}
        <path
          d="M0 60 
             Q100 135 200 60
             Q300 135 400 60
             Q500 135 600 60
             Q700 135 800 60
             Q900 135 1000 60
             Q1100 135 1200 60"
          fill="none"
          stroke="#d4af37"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M0 65 
             Q100 140 200 65
             Q300 140 400 65
             Q500 140 600 65
             Q700 140 800 65
             Q900 140 1000 65
             Q1100 140 1200 65"
          fill="none"
          stroke="#f0d78c"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  );
}

/** Tassel model hanging from valance. */
function Tassel({ left, delay = 0 }: { left: string; delay?: number }) {
  return (
    <div
      className="absolute top-18 md:top-26 z-30 pointer-events-none tassel-swing"
      style={{ left, animationDelay: `${delay}s`, transformOrigin: "top center" }}
    >
      <svg width="30" height="85" viewBox="0 0 30 85" fill="none">
        {/* Hanging gold cord */}
        <path d="M15 0 L15 32" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="2 2" />
        {/* Monogram Seal Connector */}
        <circle cx="15" cy="36" r="6.5" fill="#f0d78c" stroke="#b8860b" strokeWidth="1.5" />
        <circle cx="15" cy="36" r="3" fill="#8a6d1f" />
        {/* Tassel Cap */}
        <path d="M6 42 C6 42 6 48 15 48 C24 48 24 42 24 42 L26 50 H4 L6 42 Z" fill="#d4af37" stroke="#b8860b" />
        {/* Soft fringing */}
        <path d="M5 50 L5 78 M8 50 L8 80 M11 50 L11 82 M14 50 L14 83 M17 50 L17 83 M20 50 L20 82 M23 50 L23 80 M25 50 L25 78" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
        {/* Shine highlight */}
        <path d="M15 50 L15 82" stroke="#fff4d0" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   STAGE REVEAL COMPONENT
   ──────────────────────────────────────────────────────────────────────────── */

const CURTAIN_EASE = [0.85, 0, 0.15, 1] as const;

function CurtainStage({
  open,
  onClickOpen,
  children,
}: {
  open: boolean;
  onClickOpen: () => void;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#16030a]">
      {/* Stage contents (rendered behind the curtains) */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* Radiant Stage Spotlight — activates on curtain open */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.8, duration: 2.2 }}
        style={{
          background:
            "radial-gradient(ellipse 65% 75% at 50% 32%, rgba(255,225,160,0.18), transparent 75%)",
        }}
      />

      {/* LEFT VELVET CURTAIN PANEL */}
      <motion.div
        className="absolute inset-y-0 left-0 z-20 w-[51%] origin-left cursor-pointer"
        initial={{ x: "0%", scaleX: 1, skewY: 0 }}
        animate={
          open
            ? { x: "-86%", scaleX: 0.18, skewY: 1.5 }
            : { x: "0%", scaleX: 1, skewY: 0 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.5, ease: CURTAIN_EASE }
        }
        onClick={onClickOpen}
      >
        <VelvetPanel side="left" />
      </motion.div>

      {/* RIGHT VELVET CURTAIN PANEL */}
      <motion.div
        className="absolute inset-y-0 right-0 z-20 w-[51%] origin-right cursor-pointer"
        initial={{ x: "0%", scaleX: 1, skewY: 0 }}
        animate={
          open
            ? { x: "86%", scaleX: 0.18, skewY: -1.5 }
            : { x: "0%", scaleX: 1, skewY: 0 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.5, ease: CURTAIN_EASE }
        }
        onClick={onClickOpen}
      >
        <VelvetPanel side="right" />
      </motion.div>

      {/* Hanging gold cords with central knot/monogram seal that parts with curtains */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="absolute inset-y-0 left-0 right-0 z-22 pointer-events-none"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left gold hanging cord */}
            <div
              className="absolute top-0 bottom-0 w-1 origin-top-left"
              style={{
                left: "calc(50% - 24px)",
                background: "linear-gradient(to bottom, #d4af37, #b8860b)",
                boxShadow: "-2px 0 10px rgba(0,0,0,0.5)",
              }}
            />
            {/* Right gold hanging cord */}
            <div
              className="absolute top-0 bottom-0 w-1 origin-top-right"
              style={{
                right: "calc(50% - 24px)",
                background: "linear-gradient(to bottom, #d4af37, #b8860b)",
                boxShadow: "2px 0 10px rgba(0,0,0,0.5)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permanent valance & hanging side tassels */}
      <Valance />
      <Tassel left="8%" delay={0.2} />
      <Tassel left="90%" delay={0.9} />

      {/* Central Interactive Callout */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="absolute inset-0 z-25 flex flex-col items-center justify-center text-center pointer-events-none"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="glass-velvet p-8 rounded-full border-2 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.45)] flex flex-col items-center justify-center pointer-events-auto cursor-pointer animate-[curtainBreathe_3.2s_ease-in-out_infinite]"
              onClick={onClickOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <SparkleIcon className="text-[#d4af37] mb-2 animate-spin-slow" size={28} />
              <p className="font-[family-name:var(--font-display)] text-base font-bold text-champagne-gradient tracking-[0.2em] uppercase">
                بداية المراسم
              </p>
              <p className="mt-1 text-[10px] text-[#fbeed7]/70 font-[family-name:var(--font-serif)]">
                اضغط لفتح الستار
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   COUNTDOWN & GOOGLE MAPS RESOLVERS
   ──────────────────────────────────────────────────────────────────────────── */

function getGoogleMapsEmbedUrl(inv: {
  googleMapsLink?: string;
  address?: string;
  venue?: string;
}) {
  if (inv.googleMapsLink) {
    const link = inv.googleMapsLink.trim();
    if (link.includes("/embed") || link.includes("output=embed")) {
      return link;
    }
    if (link.includes("google.com/maps") || link.includes("maps.google.com")) {
      return link.includes("?") ? `${link}&output=embed` : `${link}?output=embed`;
    }
  }
  const queryParts = [inv.venue, inv.address].filter(Boolean);
  const query = queryParts.join(", ");
  if (!query) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function getGoogleMapsOpenUrl(inv: {
  googleMapsLink?: string;
  address?: string;
  venue?: string;
}) {
  if (inv.googleMapsLink) {
    return inv.googleMapsLink.replace("&output=embed", "").replace("?output=embed", "");
  }
  const queryParts = [inv.venue, inv.address].filter(Boolean);
  const query = queryParts.join(", ");
  if (!query) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function Countdown({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  const items = [
    { l: "أيام", v: days },
    { l: "ساعات", v: hours },
    { l: "دقائق", v: minutes },
    { l: "ثواني", v: seconds },
  ];
  return (
    <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
      {items.map((it) => (
        <motion.div
          key={it.l}
          variants={staggerItem}
          className="glass-velvet rounded-2xl p-5 md:p-7 text-center transition-all duration-300 border border-[#d4af37]/35 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#d4af37]/60 hover:shadow-[0_15px_45px_rgba(212,175,55,0.12)]"
        >
          <div className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl text-champagne-gradient leading-none tabular-nums font-bold">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="mt-2 text-xs md:text-sm tracking-[0.1em] uppercase text-[#fbeed7]/80 font-[family-name:var(--font-serif)] font-medium">
            {it.l}
          </div>
        </motion.div>
      ))}
    </StaggerChildren>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   TEMPLATE ENTRY COMPONENT
   ──────────────────────────────────────────────────────────────────────────── */

export function VeloursRougeTemplate({ inv }: { inv: Invitation }) {
  const [open, setOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Handle curtain drawing open automatically after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      setOpen(true);
    }, reduceMotion ? 100 : 5000);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  // Audio Play Logic when curtain state changes
  useEffect(() => {
    if (open && inv.musicUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(inv.musicUrl);
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay blocked by browser policy. Interaction needed:", err);
      });
    }
  }, [open, inv.musicUrl]);

  // Audio volume controller
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleOpenCurtain = () => {
    setOpen(true);
  };

  const dateObj = new Date(inv.weddingDate);
  const dateLabel = dateObj.toLocaleDateString("ar-TN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Tunis",
  });
  const timeLabel = dateObj.toLocaleTimeString("ar-TN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Tunis",
  });

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: open
      ? { opacity: 1, y: 0, transitionEnd: { transform: "none" } }
      : { opacity: 0, y: 28 },
    transition: { delay: reduceMotion ? 0 : delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div dir="rtl" className="relative min-h-screen bg-velours text-[#fbeed7] overflow-x-hidden">
      <style>{`
        .bg-velours {
          background:
            radial-gradient(ellipse 90% 60% at 50% 0%, #2a0510 0%, transparent 60%),
            linear-gradient(180deg, #16030a 0%, #0d0206 100%);
        }
        .glass-velvet {
          background: rgba(46, 2, 10, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .text-champagne-gradient {
          background: linear-gradient(135deg, #fff4d0 0%, #d4af37 40%, #f3e5b5 70%, #aa8010 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-velours-gold {
          background: linear-gradient(135deg, #d4af37, #aa8010);
          border: 1px solid rgba(255,255,255,0.25);
          color: #120104;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(212,175,55,0.25);
          transition: all 0.3s ease;
        }
        .btn-velours-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(212,175,55,0.4);
        }
        @keyframes curtainBreathe {
          0%, 100% { transform: scale(1) translateY(0); box-shadow: 0 0 40px rgba(212,175,55,0.45); }
          50% { transform: scale(1.03) translateY(-4px); box-shadow: 0 0 50px rgba(212,175,55,0.65); }
        }
        @keyframes tasselSwing {
          0%, 100% { transform: rotate(-3.5deg); }
          50% { transform: rotate(3.5deg); }
        }
        .tassel-swing { animation: tasselSwing 3.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tassel-swing { animation: none; }
        }
        .img-vignette-velours::after {
          content: "";
          position: absolute; inset: 0;
          box-shadow: inset 0 0 140px rgba(5,0,1,0.9);
          pointer-events: none;
        }
        .animate-spin-slow {
          animation: spin 90s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* AUDIO PLAYER CONTROL (sticky on bottom left) */}
      {inv.musicUrl && open && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-[#d4af37] text-[#120104] border border-white/20 shadow-[0_6px_20px_rgba(212,175,55,0.45)] hover:scale-105 transition-all cursor-pointer"
          title={isMuted ? "Unmute Music" : "Mute Music"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
        </button>
      )}

      {/* ── STAGE / CURTAIN REVEAL SECTION ───────────────────────────────── */}
      <section className="relative min-h-screen">
        <CurtainStage open={open} onClickOpen={handleOpenCurtain}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {/* Premium Particles */}
            <GoldenParticles count={50} color="#d4af37" glowColor="#d4af37" className="z-0" />
            <FloatingHearts count={12} palette="gold" className="z-0" />

            <motion.p
              {...reveal(1.0)}
              className="relative z-10 text-xs tracking-[0.25em] uppercase text-[#d4af37] font-[family-name:var(--font-display)] font-semibold mb-6"
            >
              ❖ بداية حياة مشتركة سعيدة ❖
            </motion.p>

            {/* Custom Monogram Badge with spinning ornament circle & correct Arabic coordinator "و" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={open ? { opacity: 1, scale: 1, transitionEnd: { transform: "none" } } : { opacity: 0, scale: 0.6 }}
              transition={{ delay: reduceMotion ? 0 : 1.2, duration: 1.1 }}
              className="relative inline-flex items-center justify-center mb-8 z-10"
            >
              <PulseRing
                size={120}
                color="rgba(212,175,55,0.4)"
                className="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              />
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                {/* Intricate rotating gold frame border */}
                <svg className="absolute inset-0 w-full h-full text-[#d4af37] animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M50 4 A 4 4 0 0 1 54 8 A 4 4 0 0 1 50 12 A 4 4 0 0 1 46 8 A 4 4 0 0 1 50 4" fill="currentColor" />
                  <path d="M50 88 A 4 4 0 0 1 54 92 A 4 4 0 0 1 50 96 A 4 4 0 0 1 46 92 A 4 4 0 0 1 50 88" fill="currentColor" />
                  <path d="M4 50 A 4 4 0 0 1 8 54 A 4 4 0 0 1 12 50 A 4 4 0 0 1 8 46 A 4 4 0 0 1 4 50" fill="currentColor" />
                  <path d="M88 50 A 4 4 0 0 1 92 54 A 4 4 0 0 1 96 50 A 4 4 0 0 1 92 46 A 4 4 0 0 1 88 50" fill="currentColor" />
                </svg>
                {/* Inner calligraphy sphere */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#d4af37]/60 bg-gradient-to-br from-[#2f040d] to-[#120104] shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center relative z-10">
                  <span className="font-[family-name:var(--font-script)] text-2xl md:text-3xl text-champagne-gradient select-none">
                    {inv.brideName[0]} و {inv.groomName[0]}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Names rendering with premium scale and styling */}
            <motion.h1
              {...reveal(1.4)}
              className="relative z-10 font-[family-name:var(--font-serif)] text-5xl md:text-8xl text-champagne-gradient leading-[1.1] font-bold"
            >
              <TitleGlow color="rgba(212,175,55,0.6)">{inv.brideName}</TitleGlow>
              <span className="block text-2xl md:text-4xl my-3 text-[#d4af37]/90 font-[family-name:var(--font-display)] tracking-[0.25em] font-medium">
                ❖ و ❖
              </span>
              <TitleGlow color="rgba(212,175,55,0.6)">{inv.groomName}</TitleGlow>
            </motion.h1>

            <motion.div {...reveal(1.8)} className="relative z-10">
              <AnimatedDivider color="#d4af37" width="130px" className="my-8" />
              <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl text-[#fbeed7]/95 font-medium">
                {dateLabel}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] tracking-widest text-sm md:text-base text-[#d4af37] font-semibold">
                {timeLabel} — {inv.venue}
              </p>
            </motion.div>
          </div>
        </CurtainStage>
      </section>

      {/* ── INVITATION MESSAGE SECTION ───────────────────────────────────── */}
      <section className="relative px-4 py-28 max-w-5xl mx-auto">
        <ScrollReveal>
          <HoverLift>
            <div className="glass-velvet rounded-3xl p-10 md:p-20 text-center relative border border-[#d4af37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-3.5 rounded-2xl border border-[#d4af37]/20 pointer-events-none" />
              <SparkleIcon className="mx-auto text-[#d4af37] animate-[pulse_2s_infinite]" size={24} />
              <AnimatedDivider color="#d4af37" width="90px" className="my-5" />
              <p className="mt-4 font-[family-name:var(--font-serif)] text-xl md:text-3xl leading-relaxed text-[#fbeed7] font-medium">
                « {inv.message} »
              </p>
              <AnimatedDivider color="#d4af37" width="90px" className="mt-7" />
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── COUNTDOWN SECTION ────────────────────────────────────────────── */}
      <section className="relative px-4 py-24 bg-black/25">
        <Title eyebrow="العد التنازلي" title="في انتظار دقيقة البدء" />
        <Countdown date={inv.weddingDate} />
      </section>

      {/* ── COUPLE PHOTO SECTION ─────────────────────────────────────────── */}
      <section className="relative px-4 py-24">
        <Title eyebrow="حكايتنا" title="قلبان ودرب واحد" />
        <ScrollReveal>
          <HoverLift scale={1.01}>
            <div className="max-w-3xl mx-auto relative">
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-[#d4af37]/45 img-vignette-velours shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                <img
                  src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                  alt={`${inv.brideName} & ${inv.groomName}`}
                  className="w-full h-[540px] object-cover transition-transform duration-1000 hover:scale-[1.04]"
                  style={{ filter: "saturate(0.95) contrast(1.02)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050001] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-5 rounded-[2rem] border border-[#d4af37]/25 pointer-events-none" />
                <div className="absolute bottom-10 left-0 right-0 text-center z-10">
                  <TitleGlow color="rgba(212,175,55,0.65)">
                    <p className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl text-champagne-gradient font-bold">
                      {inv.brideName} و {inv.groomName}
                    </p>
                  </TitleGlow>
                </div>
              </div>
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── VENUE DETAILS SECTION ────────────────────────────────────────── */}
      <section className="relative px-4 py-24 bg-black/20">
        <Title eyebrow="مكان الاحتفال" title="قاعة زفافنا" />
        <ScrollReveal delay={0.1}>
          <HoverLift>
            <div className="glass-velvet max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center border border-[#d4af37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl text-champagne-gradient font-bold leading-tight">
                {inv.venue}
              </h3>
              <p className="mt-4 text-[#fbeed7]/80 font-[family-name:var(--font-serif)] text-lg md:text-xl font-medium">
                {inv.address}
              </p>
              <AnimatedDivider color="#d4af37" width="110px" className="my-8" />
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-2.5 text-[#d4af37] font-semibold">
                  <Calendar size={20} />
                  <span className="font-[family-name:var(--font-serif)] text-lg capitalize">{dateLabel}</span>
                </div>
                <span className="hidden md:inline text-[#d4af37]/75">❖</span>
                <p className="text-3xl text-champagne-gradient font-[family-name:var(--font-serif)] font-bold">
                  {timeLabel}
                </p>
              </div>
              {inv.additionalDates && inv.additionalDates.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[#d4af37]/20 flex flex-col gap-4">
                  <p className="text-xs tracking-[0.2em] uppercase text-[#d4af37] font-[family-name:var(--font-display)]">
                    ❖ مراسم إضافية ❖
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
                    {inv.additionalDates.map((item, idx) => {
                      const d = new Date(item.date);
                      const formatted = d.toLocaleDateString("ar-TN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      });
                      return (
                        <div key={idx} className="glass-velvet rounded-xl p-4 border border-[#d4af37]/15">
                          <p className="text-sm font-semibold text-[#d4af37] font-[family-name:var(--font-serif)]">{item.label}</p>
                          <p className="mt-1 text-xs text-[#fbeed7]/80 font-[family-name:var(--font-body)]">{formatted}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── GOOGLE MAPS EMBED SECTION ────────────────────────────────────── */}
      <section className="relative px-4 py-24">
        <Title eyebrow="خريطة الموقع" title="شاركونا هذه الليلة الاستثنائية" />
        {(() => {
          const embedUrl = getGoogleMapsEmbedUrl(inv);
          const openUrl = getGoogleMapsOpenUrl(inv);
          return (
            <>
              {embedUrl ? (
                <ScrollReveal>
                  <div
                    className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden border border-[#d4af37]/45 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
                    style={{ filter: "hue-rotate(315deg) saturate(0.55) brightness(0.8)" }}
                  >
                    <iframe
                      src={embedUrl}
                      title="Carte"
                      width="100%"
                      height="440"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                    />
                  </div>
                </ScrollReveal>
              ) : (
                <ScrollReveal>
                  <div className="max-w-3xl mx-auto rounded-3xl border border-[#d4af37]/40 bg-black/40 px-8 py-16 text-center">
                    <MapPin className="mx-auto mb-4 text-[#d4af37]" size={40} />
                    <p className="text-[#fbeed7]/90 font-[family-name:var(--font-display)] tracking-wider uppercase text-sm font-semibold">
                      Lieu de réception
                    </p>
                    {inv.venue && (
                      <p className="mt-5 text-3xl text-white font-[family-name:var(--font-serif)] font-bold">{inv.venue}</p>
                    )}
                    {inv.address && (
                      <p className="mt-3 text-white/80">{inv.address}</p>
                    )}
                  </div>
                </ScrollReveal>
              )}
              {openUrl && (
                <div className="text-center mt-8">
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-[#d4af37] hover:text-[#fbeed7] font-[family-name:var(--font-display)] tracking-wider text-base font-semibold transition-colors duration-300 cursor-pointer"
                  >
                    <MapPin size={18} /> الموقع على الخريطة
                  </a>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* ── RSVP INVITATION SECTION ──────────────────────────────────────── */}
      <section className="relative px-4 py-28 text-center bg-black/15">
        <FloatingHearts count={10} palette="gold" />
        <Title eyebrow="تأكيد الحضور" title="بانتظار تشريفكم لنا" />
        <ScrollReveal delay={0.1}>
          <p className="max-w-2xl mx-auto text-[#fbeed7]/80 font-[family-name:var(--font-serif)] text-lg md:text-xl mb-10 leading-relaxed font-medium">
            ستفتح أبواب الفرح قريباً. نرجو حضوركم لتشهدوا معنا أجمل فصول العمر ونرسم معاً ذكرى حب لا تزول.
          </p>

        </ScrollReveal>
      </section>

      {/* ── FOOTER DESIGN ────────────────────────────────────────────────── */}
      <footer className="relative px-4 py-20 text-center bg-[#050001]">
        <ScrollReveal>
          <TitleGlow color="rgba(212,175,55,0.55)">
            <p className="font-[family-name:var(--font-script)] text-3xl md:text-4xl text-champagne-gradient">
              يسدل الستار، ويبقى الحب خالداً
            </p>
          </TitleGlow>
          <p className="mt-4 text-xs tracking-[0.25em] uppercase text-[#d4af37]/70 font-[family-name:var(--font-display)] font-semibold">
            ❖ {inv.brideName} و {inv.groomName} ❖
          </p>
        </ScrollReveal>
      </footer>
    </div>
  );
}

function Title({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <ScrollReveal className="text-center mb-16">
      <p className="text-[11px] md:text-xs tracking-[0.6em] uppercase text-[#d4af37] font-[family-name:var(--font-display)] font-bold">
        ❖ {eyebrow} ❖
      </p>
      <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl md:text-6xl text-champagne-gradient font-bold">
        <TitleGlow color="rgba(212,175,55,0.5)">{title}</TitleGlow>
      </h2>
      <AnimatedDivider color="#d4af37" width="160px" className="mt-5" />
    </ScrollReveal>
  );
}

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";
import { MapPin, Calendar, Volume2, VolumeX } from "lucide-react";
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
   DESIGN NOTE — "Rideau de Soie"

   A curtain built from independent silk strips animating in 3D
   (perspective + rotateY + translateZ), each on its own stagger, so the
   parting reads as flowing fabric rather than two flat planes sliding.
   Palette moves off the earlier green into something warmer and more
   romantic: wine, blush, rose-gold — "amoureux" rather than corporate.
   Petals drift continuously through the whole hero so the page feels
   alive even before anyone touches it, closer to a short film's opening
   shot than a static banner.
   ──────────────────────────────────────────────────────────────────────────── */

const STRAND_COUNT = 6;
const SILK_EASE = [0.45, 0, 0.2, 1] as const;

/* ────────────────────────────────────────────────────────────────────────────
   SILK STRAND — one vertical fold of curtain, animated with keyframes so it
   visibly billows mid-transit instead of just translating flat.
   ──────────────────────────────────────────────────────────────────────────── */

function SilkStrand({
    side,
    index,
    open,
    reduceMotion,
}: {
    side: "left" | "right";
    index: number;
    open: boolean;
    reduceMotion: boolean;
}) {
    const dir = side === "left" ? -1 : 1;
    const hueShift = 6 + (index % 3) * 10; // subtle per-strand color variance
    return (
        <motion.div
            className="absolute inset-y-0"
            style={{
                width: `${100 / STRAND_COUNT}%`,
                [side === "left" ? "left" : "right"]: `${(index * 100) / STRAND_COUNT}%`,
                transformStyle: "preserve-3d",
                transformOrigin: side === "left" ? "right center" : "left center",
            }}
            initial={false}
            animate={
                reduceMotion
                    ? { x: open ? `${dir * 650}%` : "0%" }
                    : open
                        ? { x: ["0%", `${dir * 300}%`, `${dir * 650}%`], rotateY: [0, dir * -34, 0], z: [0, -140, 0] }
                        : { x: "0%", rotateY: 0, z: 0 }
            }
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 1.9,
                        delay: 0.035 * index,
                        times: [0, 0.55, 1],
                        ease: SILK_EASE,
                    }
            }
        >
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(${side === "left" ? "100deg" : "80deg"
                        }, hsl(340 ${58 - hueShift}% ${16 + hueShift}%) 0%, hsl(338 55% 22%) 45%, hsl(345 60% 14%) 100%)`,
                    boxShadow: side === "left" ? "inset -10px 0 24px rgba(0,0,0,0.4)" : "inset 10px 0 24px rgba(0,0,0,0.4)",
                }}
            />
            {/* shimmering sweep, always alive */}
            <div
                className="absolute inset-0 silk-shimmer"
                style={{ animationDelay: `${index * 0.3}s` }}
            />
            {/* fold seam highlight */}
            <div
                className="absolute inset-y-0 w-px opacity-40"
                style={{
                    [side === "left" ? "left" : "right"]: 0,
                    background: "linear-gradient(180deg, transparent, #D9A66C 20%, #D9A66C 80%, transparent)",
                }}
            />
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   PETALS — continuous ambient drift, deterministic so no SSR/CSR mismatch.
   ──────────────────────────────────────────────────────────────────────────── */

function Petals({ count = 14 }: { count?: number }) {
    const petals = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => ({
                left: (i * 137.5) % 100,
                delay: (i * 0.7) % 6,
                duration: 9 + (i % 5) * 1.6,
                size: 8 + (i % 4) * 3,
                drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 3) * 10),
            })),
        [count]
    );
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {petals.map((p, i) => (
                <span
                    key={i}
                    className="petal"
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size * 1.25,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        // @ts-expect-error custom property for drift keyframe
                        "--drift": `${p.drift}px`,
                    }}
                />
            ))}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   CURTAIN STAGE
   ──────────────────────────────────────────────────────────────────────────── */

function CurtainStage({
    open,
    onOpen,
    brideInitial,
    groomInitial,
    children,
}: {
    open: boolean;
    onOpen: () => void;
    brideInitial: string;
    groomInitial: string;
    children: React.ReactNode;
}) {
    const reduceMotion = !!useReducedMotion();

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#2B0713]" style={{ perspective: "1900px" }}>
            <div className="absolute inset-0 z-0">{children}</div>

            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 1 : 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.7, duration: 1.8 }}
                style={{
                    background: "radial-gradient(ellipse 60% 55% at 50% 30%, rgba(217,166,108,0.22), transparent 70%)",
                }}
            />

            <div className="absolute inset-y-0 left-0 z-20 w-1/2" style={{ transformStyle: "preserve-3d" }}>
                {Array.from({ length: STRAND_COUNT }).map((_, i) => (
                    <SilkStrand key={i} side="left" index={i} open={open} reduceMotion={reduceMotion} />
                ))}
            </div>
            <div className="absolute inset-y-0 right-0 z-20 w-1/2" style={{ transformStyle: "preserve-3d" }}>
                {Array.from({ length: STRAND_COUNT }).map((_, i) => (
                    <SilkStrand key={i} side="right" index={i} open={open} reduceMotion={reduceMotion} />
                ))}
            </div>

            <div
                className="absolute top-0 left-0 right-0 z-30 h-[3px] pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, #D9A66C 15%, #F6D9DE 50%, #D9A66C 85%, transparent)" }}
            />

            {/* Rose seal — tap to open */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        type="button"
                        onClick={onOpen}
                        className="absolute inset-0 z-25 flex flex-col items-center justify-center text-center cursor-pointer"
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.6 }}
                        aria-label="افتحوا الستارة"
                    >
                        <motion.div
                            className="relative flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 rounded-full"
                            style={{
                                background: "radial-gradient(circle at 35% 30%, #6B1836, #2B0713)",
                                border: "1.5px solid #D9A66C",
                                boxShadow: "0 0 0 1px rgba(217,166,108,0.15), 0 20px 45px rgba(0,0,0,0.55)",
                            }}
                            animate={reduceMotion ? {} : { scale: [1, 1.045, 1] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <PulseRing size={144} color="rgba(217,166,108,0.35)" className="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                            <svg width="30" height="30" viewBox="0 0 24 24" className="relative mb-1" fill="none">
                                <path
                                    d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.6 4.8 6.3 4.4c2-.2 3.7.9 5.7 3 2-2.1 3.7-3.2 5.7-3 3.7.4 5.8 4 4.3 7.4C19.5 16.4 12 21 12 21z"
                                    fill="url(#rg)"
                                />
                                <defs>
                                    <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#F6D9DE" />
                                        <stop offset="100%" stopColor="#D9A66C" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="relative font-[family-name:var(--font-script)] text-xl md:text-2xl text-rose-gradient">
                                {brideInitial} · {groomInitial}
                            </span>
                            <span className="relative mt-1.5 text-[10px] tracking-[0.25em] uppercase text-[#F6D9DE]/80 font-[family-name:var(--font-display)]">
                                افتحوا الستارة
                            </span>
                        </motion.div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   COUNTDOWN
   ──────────────────────────────────────────────────────────────────────────── */

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
                    className="panel rounded-2xl p-5 md:p-7 text-center border border-[#D9A66C]/25 shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:border-[#D9A66C]/50 transition-colors duration-300"
                >
                    <div className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl text-rose-gradient leading-none tabular-nums font-bold">
                        {String(it.v).padStart(2, "0")}
                    </div>
                    <div className="mt-2 text-xs md:text-sm tracking-[0.1em] uppercase text-[#FBEFE8]/75 font-[family-name:var(--font-serif)] font-medium">
                        {it.l}
                    </div>
                </motion.div>
            ))}
        </StaggerChildren>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   MAPS
   ──────────────────────────────────────────────────────────────────────────── */

function getGoogleMapsEmbedUrl(inv: { googleMapsLink?: string; address?: string; venue?: string }) {
    if (inv.googleMapsLink) {
        const link = inv.googleMapsLink.trim();
        if (link.includes("/embed") || link.includes("output=embed")) return link;
        if (link.includes("google.com/maps") || link.includes("maps.google.com")) {
            return link.includes("?") ? `${link}&output=embed` : `${link}?output=embed`;
        }
    }
    const query = [inv.venue, inv.address].filter(Boolean).join(", ");
    if (!query) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function getGoogleMapsOpenUrl(inv: { googleMapsLink?: string; address?: string; venue?: string }) {
    if (inv.googleMapsLink) {
        return inv.googleMapsLink.replace("&output=embed", "").replace("?output=embed", "");
    }
    const query = [inv.venue, inv.address].filter(Boolean).join(", ");
    if (!query) return "";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/* ────────────────────────────────────────────────────────────────────────────
   TEMPLATE ENTRY
   ──────────────────────────────────────────────────────────────────────────── */

export function RideauSoieTemplate({ inv }: { inv: Invitation }) {
    const [open, setOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const t = setTimeout(() => setOpen(true), reduceMotion ? 100 : 4600);
        return () => clearTimeout(t);
    }, [reduceMotion]);

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

    useEffect(() => {
        if (audioRef.current) audioRef.current.muted = isMuted;
    }, [isMuted]);

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted((m) => !m);
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
        initial: { opacity: 0, y: 24 },
        animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
        transition: { delay: reduceMotion ? 0 : delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    });

    return (
        <div dir="rtl" className="relative min-h-screen bg-rideau text-[#FBEFE8] overflow-x-hidden">
            <style>{`
        .bg-rideau {
          background:
            radial-gradient(ellipse 85% 50% at 50% 0%, rgba(107,24,54,0.55) 0%, transparent 60%),
            linear-gradient(180deg, #3A0A1D 0%, #200510 100%);
        }
        .panel {
          background: rgba(107,24,54,0.32);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        @media (max-width: 768px) {
          .panel {
            background: rgba(40,7,20,0.93);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }
        .text-rose-gradient {
          background: linear-gradient(135deg, #F6D9DE 0%, #D9A66C 45%, #C24868 78%, #8C2A46 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-rose {
          background: linear-gradient(135deg, #F6D9DE, #D9A66C);
          border: 1px solid rgba(255,255,255,0.2);
          color: #3A0A1D;
          font-weight: 700;
          box-shadow: 0 10px 26px rgba(217,166,108,0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-rose:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(217,166,108,0.42); }
        .img-vignette::after {
          content: "";
          position: absolute; inset: 0;
          box-shadow: inset 0 0 120px rgba(20,3,10,0.85);
          pointer-events: none;
        }
        .rule { height: 1px; background: linear-gradient(90deg, transparent, #D9A66C, transparent); }

        .silk-shimmer {
          background: linear-gradient(115deg, transparent 30%, rgba(246,217,222,0.16) 48%, transparent 66%);
          background-size: 260% 260%;
          animation: shimmerSweep 5.5s ease-in-out infinite;
        }
        @keyframes shimmerSweep {
          0% { background-position: 120% 0%; }
          50% { background-position: -20% 100%; }
          100% { background-position: 120% 0%; }
        }

        .petal {
          position: absolute;
          top: -5%;
          display: block;
          border-radius: 50% 4% 50% 4%;
          background: linear-gradient(135deg, #F6D9DE, #D9A66C 55%, #C24868);
          opacity: 0.75;
          animation-name: petalFall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes petalFall {
          0% { transform: translate(0, -10%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translate(var(--drift), 55vh) rotate(180deg); }
          90% { opacity: 0.7; }
          100% { transform: translate(calc(var(--drift) * -1), 115vh) rotate(360deg); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .silk-shimmer, .petal { animation: none; }
        }
      `}</style>

            {inv.musicUrl && open && (
                <button
                    onClick={toggleMute}
                    className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-[#D9A66C] text-[#3A0A1D] border border-white/20 shadow-[0_6px_20px_rgba(217,166,108,0.4)] hover:scale-105 transition-transform cursor-pointer"
                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
                </button>
            )}

            {/* ── CURTAIN / HERO ────────────────────────────────────────────── */}
            <section className="relative min-h-screen">
                <CurtainStage
                    open={open}
                    onOpen={() => setOpen(true)}
                    brideInitial={inv.brideName[0]}
                    groomInitial={inv.groomName[0]}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                        <Petals count={16} />
                        <GoldenParticles count={22} color="#D9A66C" glowColor="#F6D9DE" className="z-0" />
                        <FloatingHearts count={8} palette="gold" className="z-0" />

                        <motion.p
                            {...reveal(0.5)}
                            className="relative z-10 text-xs tracking-[0.3em] uppercase text-[#D9A66C] font-[family-name:var(--font-display)] font-semibold mb-6"
                        >
                            حكاية عشقٍ تتوّج اليوم
                        </motion.p>

                        <motion.h1
                            {...reveal(0.9)}
                            className="relative z-10 font-[family-name:var(--font-serif)] text-5xl md:text-8xl text-rose-gradient leading-[1.1] font-bold"
                        >
                            <TitleGlow color="rgba(217,166,108,0.5)">{inv.brideName}</TitleGlow>
                            <span className="block text-xl md:text-3xl my-3 text-[#D9A66C]/85 font-[family-name:var(--font-display)] tracking-[0.3em] font-medium">
                                و
                            </span>
                            <TitleGlow color="rgba(217,166,108,0.5)">{inv.groomName}</TitleGlow>
                        </motion.h1>

                        <motion.div {...reveal(1.2)} className="relative z-10">
                            <AnimatedDivider color="#D9A66C" width="120px" className="my-7" />
                            <p className="font-[family-name:var(--font-serif)] text-lg md:text-2xl text-[#FBEFE8]/95 font-medium">
                                {dateLabel}
                            </p>
                            <p className="mt-2 font-[family-name:var(--font-display)] tracking-widest text-sm md:text-base text-[#D9A66C] font-semibold">
                                {timeLabel} — {inv.venue}
                            </p>
                        </motion.div>
                    </div>
                </CurtainStage>
            </section>

            {/* ── CELEBRATION DATES ─────────────────────────────────────────── */}
            <section className="relative px-4 pt-16 pb-20 md:pt-20 md:pb-24">
                <ScrollReveal className="text-center mb-10 md:mb-12">
                    <p className="text-[11px] md:text-xs tracking-[0.5em] uppercase text-[#D9A66C] font-[family-name:var(--font-display)] font-bold">
                        مواعيد الاحتفال
                    </p>
                    <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl md:text-6xl text-rose-gradient font-bold">
                        <TitleGlow color="rgba(217,166,108,0.45)">أيام لا تُنسى</TitleGlow>
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div
                        className={`grid gap-5 md:gap-7 max-w-5xl mx-auto ${inv.additionalDates && inv.additionalDates.length > 0
                                ? "grid-cols-1 md:grid-cols-[1.3fr_repeat(auto-fit,minmax(220px,1fr))]"
                                : "grid-cols-1 max-w-xl"
                            }`}
                    >
                        <HoverLift>
                            <div className="panel relative h-full rounded-3xl p-8 md:p-10 text-center border-2 border-[#D9A66C]/50 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                <span className="inline-block text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#3A0A1D] bg-gradient-to-r from-[#F6D9DE] to-[#D9A66C] px-4 py-1.5 rounded-full font-bold font-[family-name:var(--font-display)]">
                                    الحفل الرئيسي
                                </span>
                                <p className="mt-5 font-[family-name:var(--font-serif)] text-2xl md:text-4xl text-rose-gradient font-bold leading-snug capitalize">
                                    {dateLabel}
                                </p>
                                <div className="rule w-24 mx-auto my-4" />
                                <p className="flex items-center justify-center gap-2 text-[#FBEFE8]/90 font-[family-name:var(--font-serif)] text-lg md:text-xl font-medium">
                                    <Calendar size={18} className="text-[#D9A66C]" /> {timeLabel}
                                </p>
                                <p className="mt-1 text-[#D9A66C]/85 text-sm md:text-base">{inv.venue}</p>
                            </div>
                        </HoverLift>

                        {inv.additionalDates?.map((item, idx) => {
                            const d = new Date(item.date);
                            const formatted = d.toLocaleDateString("ar-TN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            });
                            const t = d.toLocaleTimeString("ar-TN", { hour: "2-digit", minute: "2-digit" });
                            return (
                                <HoverLift key={idx}>
                                    <div className="panel h-full rounded-3xl p-7 md:p-8 text-center border border-[#D9A66C]/30 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
                                        <span className="inline-block text-[10px] tracking-[0.25em] uppercase text-[#D9A66C] border border-[#D9A66C]/50 px-3.5 py-1 rounded-full font-[family-name:var(--font-display)] font-semibold">
                                            {item.label}
                                        </span>
                                        <p className="mt-4 font-[family-name:var(--font-serif)] text-xl md:text-2xl text-[#FBEFE8] font-bold leading-snug capitalize">
                                            {formatted}
                                        </p>
                                        <div className="rule w-16 mx-auto my-3.5" />
                                        <p className="text-[#D9A66C]/85 text-sm md:text-base font-[family-name:var(--font-serif)]">{t}</p>
                                    </div>
                                </HoverLift>
                            );
                        })}
                    </div>
                </ScrollReveal>
            </section>

            {/* ── MESSAGE ───────────────────────────────────────────────────── */}
            <section className="relative px-4 pb-24 max-w-4xl mx-auto">
                <ScrollReveal>
                    <HoverLift>
                        <div className="panel rounded-3xl p-10 md:p-16 text-center border border-[#D9A66C]/25 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                            <div className="rule w-16 mx-auto mb-6" />
                            <p className="font-[family-name:var(--font-serif)] text-xl md:text-3xl leading-relaxed text-[#FBEFE8] font-medium">
                                {inv.message}
                            </p>
                            <div className="rule w-16 mx-auto mt-6" />
                        </div>
                    </HoverLift>
                </ScrollReveal>
            </section>

            {/* ── COUNTDOWN ─────────────────────────────────────────────────── */}
            <section className="relative px-4 py-24 bg-black/15">
                <Title eyebrow="العد التنازلي" title="اقتربت اللحظة" />
                <Countdown date={inv.weddingDate} />
            </section>

            {/* ── PHOTO ─────────────────────────────────────────────────────── */}
            <section className="relative px-4 py-24">
                <Title eyebrow="حكايتنا" title="قلبان ودرب واحد" />
                <ScrollReveal>
                    <HoverLift scale={1.01}>
                        <div className="max-w-3xl mx-auto relative rounded-[2.5rem] overflow-hidden border-2 border-[#D9A66C]/40 img-vignette shadow-[0_25px_55px_rgba(0,0,0,0.6)]">
                            <img
                                src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                                alt={`${inv.brideName} & ${inv.groomName}`}
                                className="w-full h-[460px] md:h-[540px] object-cover transition-transform duration-1000 hover:scale-[1.04]"
                                style={{ filter: "saturate(0.97) contrast(1.03)" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#14030A] via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-9 left-0 right-0 text-center z-10">
                                <TitleGlow color="rgba(217,166,108,0.55)">
                                    <p className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl text-rose-gradient font-bold">
                                        {inv.brideName} و {inv.groomName}
                                    </p>
                                </TitleGlow>
                            </div>
                        </div>
                    </HoverLift>
                </ScrollReveal>
            </section>

            {/* ── VENUE ─────────────────────────────────────────────────────── */}
            <section className="relative px-4 py-24 bg-black/15">
                <Title eyebrow="مكان الاحتفال" title="قاعة زفافنا" />
                <ScrollReveal delay={0.1}>
                    <HoverLift>
                        <div className="panel max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center border border-[#D9A66C]/30 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                            <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl text-rose-gradient font-bold leading-tight">
                                {inv.venue}
                            </h3>
                            <p className="mt-4 text-[#FBEFE8]/80 font-[family-name:var(--font-serif)] text-lg md:text-xl font-medium">
                                {inv.address}
                            </p>
                        </div>
                    </HoverLift>
                </ScrollReveal>
            </section>

            {/* ── MAP ───────────────────────────────────────────────────────── */}
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
                                        className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden border border-[#D9A66C]/40 shadow-[0_25px_55px_rgba(0,0,0,0.55)]"
                                        style={{ filter: "hue-rotate(300deg) saturate(0.55) brightness(0.85)" }}
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
                                    <div className="max-w-3xl mx-auto rounded-3xl border border-[#D9A66C]/35 bg-black/30 px-8 py-16 text-center">
                                        <MapPin className="mx-auto mb-4 text-[#D9A66C]" size={38} />
                                        {inv.venue && (
                                            <p className="mt-4 text-3xl text-white font-[family-name:var(--font-serif)] font-bold">{inv.venue}</p>
                                        )}
                                        {inv.address && <p className="mt-3 text-white/75">{inv.address}</p>}
                                    </div>
                                </ScrollReveal>
                            )}
                            {openUrl && (
                                <div className="text-center mt-8">
                                    <a
                                        href={openUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2.5 text-[#D9A66C] hover:text-[#FBEFE8] font-[family-name:var(--font-display)] tracking-wider text-base font-semibold transition-colors duration-300"
                                    >
                                        <MapPin size={18} /> الموقع على الخريطة
                                    </a>
                                </div>
                            )}
                        </>
                    );
                })()}
            </section>

            {/* ── RSVP ──────────────────────────────────────────────────────── */}
            <section className="relative px-4 py-28 text-center bg-black/10">
                <FloatingHearts count={7} palette="gold" />
                <Title eyebrow="تأكيد الحضور" title="بانتظار تشريفكم لنا" />
                <ScrollReveal delay={0.1}>
                    <p className="max-w-2xl mx-auto text-[#FBEFE8]/80 font-[family-name:var(--font-serif)] text-lg md:text-xl leading-relaxed font-medium">
                        نرجو حضوركم لتشهدوا معنا أجمل فصول العمر، ونرسم معاً ذكرى حب لا تزول.
                    </p>
                </ScrollReveal>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <footer className="relative px-4 py-20 text-center bg-[#14030A]">
                <ScrollReveal>
                    <TitleGlow color="rgba(217,166,108,0.5)">
                        <p className="font-[family-name:var(--font-script)] text-3xl md:text-4xl text-rose-gradient">
                            يسدل الستار، ويبقى الحب خالداً
                        </p>
                    </TitleGlow>
                    <p className="mt-4 text-xs tracking-[0.3em] uppercase text-[#D9A66C]/70 font-[family-name:var(--font-display)] font-semibold">
                        {inv.brideName} و {inv.groomName}
                    </p>
                </ScrollReveal>
            </footer>
        </div>
    );
}

function Title({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <ScrollReveal className="text-center mb-16">
            <p className="text-[11px] md:text-xs tracking-[0.5em] uppercase text-[#D9A66C] font-[family-name:var(--font-display)] font-bold">
                {eyebrow}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl md:text-6xl text-rose-gradient font-bold">
                <TitleGlow color="rgba(217,166,108,0.45)">{title}</TitleGlow>
            </h2>
            <AnimatedDivider color="#D9A66C" width="140px" className="mt-5" />
        </ScrollReveal>
    );
}
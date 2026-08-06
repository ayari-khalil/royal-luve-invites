import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useId } from "react";
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
   DESIGN NOTE
   ────────────────────────────────────────────────────────────────────────────
   "La Porte d'Or" — the golden mashrabiya gate.

   Instead of a Western theatre curtain, the reveal is a pair of carved
   lattice screens (mashrabiya / moucharabieh), a motif rooted in the same
   architectural language as the couple's own celebration. The screens part
   on a single translateX + fade (no skew, no scale, no drop-shadow stacking)
   so it stays smooth on low-powered phones. Ornament is spent once, on the
   gate itself; everything after it is quiet: a hairline rule, one gold, one
   ink, one warm rose used only as a whisper.
   ──────────────────────────────────────────────────────────────────────────── */

const GATE_EASE = [0.65, 0, 0.2, 1] as const;

/* ────────────────────────────────────────────────────────────────────────────
   MASHRABIYA LATTICE — a single tiny SVG <pattern>, reused as a fill.
   Cheap to render at any panel size because it's one pattern definition,
   not thousands of DOM nodes.
   ──────────────────────────────────────────────────────────────────────────── */

function LatticeDefs({ id }: { id: string }) {
    return (
        <defs>
            <pattern id={id} width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="46" height="46" fill="none" />
                <path
                    d="M23 2 L44 23 L23 44 L2 23 Z"
                    fill="none"
                    stroke="#C9A24B"
                    strokeWidth="1"
                    opacity="0.55"
                />
                <circle cx="23" cy="23" r="4.5" fill="none" stroke="#C9A24B" strokeWidth="0.8" opacity="0.5" />
                <path d="M23 2 L23 44 M2 23 L44 23" stroke="#C9A24B" strokeWidth="0.5" opacity="0.3" />
            </pattern>
            <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#123D36" />
                <stop offset="55%" stopColor="#0D2B26" />
                <stop offset="100%" stopColor="#071C18" />
            </linearGradient>
        </defs>
    );
}

function GatePanel({ side }: { side: "left" | "right" }) {
    const uid = useId().replace(/:/g, "");
    const latticeId = `lattice-${side}-${uid}`;
    return (
        <div className="absolute inset-y-0 w-full">
            <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
            >
                <LatticeDefs id={latticeId} />
                <rect x="0" y="0" width="100" height="100" fill={`url(#${latticeId}-panel)`} />
                <rect x="0" y="0" width="100" height="100" fill={`url(#${latticeId})`} />
            </svg>
            {/* Soft top-to-bottom sheen */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(180deg, rgba(232,201,122,0.10) 0%, transparent 35%, rgba(0,0,0,0.35) 100%)",
                }}
            />
            {/* Inner carved edge — the seam where the gate parts */}
            <div
                className="absolute inset-y-0 w-[3px]"
                style={{
                    [side === "left" ? "right" : "left"]: 0,
                    background: "linear-gradient(180deg, transparent, #E4C77E 15%, #E4C77E 85%, transparent)",
                    boxShadow: "0 0 16px rgba(228,199,126,0.55)",
                }}
            />
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
   GATE STAGE — the reveal
   ──────────────────────────────────────────────────────────────────────────── */

function GateStage({
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
    const reduceMotion = useReducedMotion();

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#071C18]">
            <div className="absolute inset-0 z-0">{children}</div>

            {/* Bloom of light once the gate has parted */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: open ? 1 : 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.5, duration: 1.6 }}
                style={{
                    background: "radial-gradient(ellipse 60% 55% at 50% 30%, rgba(228,199,126,0.16), transparent 70%)",
                }}
            />

            <motion.div
                className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left"
                initial={false}
                animate={open ? { x: "-102%", opacity: 0.4 } : { x: "0%", opacity: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 1.5, ease: GATE_EASE }}
            >
                <GatePanel side="left" />
            </motion.div>

            <motion.div
                className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right"
                initial={false}
                animate={open ? { x: "102%", opacity: 0.4 } : { x: "0%", opacity: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 1.5, ease: GATE_EASE }}
            >
                <GatePanel side="right" />
            </motion.div>

            {/* Hairline top and bottom rules — replaces the old heavy valance/tassels */}
            <div className="absolute top-0 left-0 right-0 z-30 h-[3px] pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, #C9A24B 15%, #E4C77E 50%, #C9A24B 85%, transparent)" }} />
            <div className="absolute bottom-0 left-0 right-0 z-30 h-[1px] pointer-events-none opacity-40"
                style={{ background: "linear-gradient(90deg, transparent, #C9A24B, transparent)" }} />

            {/* Seal — tap to open */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        type="button"
                        onClick={onOpen}
                        className="absolute inset-0 z-25 flex flex-col items-center justify-center text-center cursor-pointer"
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.6 }}
                        aria-label="افتحوا البوابة"
                    >
                        <motion.div
                            className="relative flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 rounded-full"
                            style={{
                                background: "radial-gradient(circle at 35% 30%, #123D36, #071C18)",
                                border: "1.5px solid #C9A24B",
                                boxShadow: "0 0 0 1px rgba(201,162,75,0.15), 0 20px 45px rgba(0,0,0,0.55)",
                            }}
                            animate={reduceMotion ? {} : { scale: [1, 1.035, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <PulseRing size={144} color="rgba(201,162,75,0.35)" className="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                            <span className="relative font-[family-name:var(--font-script)] text-2xl md:text-3xl text-gold-gradient">
                                {brideInitial} · {groomInitial}
                            </span>
                            <span className="relative mt-2 text-[10px] tracking-[0.25em] uppercase text-[#E4C77E]/80 font-[family-name:var(--font-display)]">
                                افتحوا البوابة
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
                    className="panel rounded-2xl p-5 md:p-7 text-center border border-[#C9A24B]/25 shadow-[0_15px_35px_rgba(0,0,0,0.35)] hover:border-[#C9A24B]/50 transition-colors duration-300"
                >
                    <div className="font-[family-name:var(--font-serif)] text-4xl md:text-6xl text-gold-gradient leading-none tabular-nums font-bold">
                        {String(it.v).padStart(2, "0")}
                    </div>
                    <div className="mt-2 text-xs md:text-sm tracking-[0.1em] uppercase text-[#F8F1E1]/75 font-[family-name:var(--font-serif)] font-medium">
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

export function PorteDOrTemplate({ inv }: { inv: Invitation }) {
    const [open, setOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const t = setTimeout(() => setOpen(true), reduceMotion ? 100 : 4200);
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
        <div dir="rtl" className="relative min-h-screen bg-jardin text-[#F8F1E1] overflow-x-hidden">
            <style>{`
        .bg-jardin {
          background:
            radial-gradient(ellipse 85% 50% at 50% 0%, rgba(18,61,54,0.55) 0%, transparent 60%),
            linear-gradient(180deg, #0D2B26 0%, #071C18 100%);
        }
        .panel {
          background: rgba(18,61,54,0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        @media (max-width: 768px) {
          .panel {
            background: rgba(10,34,30,0.92);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }
        .text-gold-gradient {
          background: linear-gradient(135deg, #F3E2AE 0%, #E4C77E 35%, #C9A24B 70%, #9C7B2E 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-gold {
          background: linear-gradient(135deg, #E4C77E, #C9A24B);
          border: 1px solid rgba(255,255,255,0.2);
          color: #0D2B26;
          font-weight: 700;
          box-shadow: 0 10px 26px rgba(201,162,75,0.25);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(201,162,75,0.4); }
        .img-vignette::after {
          content: "";
          position: absolute; inset: 0;
          box-shadow: inset 0 0 120px rgba(4,12,10,0.85);
          pointer-events: none;
        }
        .rule {
          height: 1px;
          background: linear-gradient(90deg, transparent, #C9A24B, transparent);
        }
        .flourish { color: #C9A24B; opacity: 0.85; }
      `}</style>

            {inv.musicUrl && open && (
                <button
                    onClick={toggleMute}
                    className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-[#C9A24B] text-[#0D2B26] border border-white/20 shadow-[0_6px_20px_rgba(201,162,75,0.4)] hover:scale-105 transition-transform cursor-pointer"
                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
                </button>
            )}

            {/* ── GATE / HERO ───────────────────────────────────────────────── */}
            <section className="relative min-h-screen">
                <GateStage
                    open={open}
                    onOpen={() => setOpen(true)}
                    brideInitial={inv.brideName[0]}
                    groomInitial={inv.groomName[0]}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                        <GoldenParticles count={26} color="#C9A24B" glowColor="#E4C77E" className="z-0" />
                        <FloatingHearts count={7} palette="gold" className="z-0" />

                        <motion.p
                            {...reveal(0.5)}
                            className="relative z-10 text-xs tracking-[0.3em] uppercase text-[#C9A24B] font-[family-name:var(--font-display)] font-semibold mb-6"
                        >
                            دعوة زفاف
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                            transition={{ delay: reduceMotion ? 0 : 0.7, duration: 0.9 }}
                            className="relative z-10 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mb-7"
                        >
                            <div className="absolute inset-0 rounded-full border border-[#C9A24B]/50" />
                            <div className="absolute inset-2 rounded-full border border-[#C9A24B]/25" />
                            <span className="font-[family-name:var(--font-script)] text-2xl md:text-3xl text-gold-gradient">
                                {inv.brideName[0]} · {inv.groomName[0]}
                            </span>
                        </motion.div>

                        <motion.h1
                            {...reveal(0.9)}
                            className="relative z-10 font-[family-name:var(--font-serif)] text-5xl md:text-8xl text-gold-gradient leading-[1.1] font-bold"
                        >
                            <TitleGlow color="rgba(201,162,75,0.5)">{inv.brideName}</TitleGlow>
                            <span className="block text-xl md:text-3xl my-3 text-[#C9A24B]/85 font-[family-name:var(--font-display)] tracking-[0.3em] font-medium">
                                و
                            </span>
                            <TitleGlow color="rgba(201,162,75,0.5)">{inv.groomName}</TitleGlow>
                        </motion.h1>

                        <motion.div {...reveal(1.2)} className="relative z-10">
                            <AnimatedDivider color="#C9A24B" width="120px" className="my-7" />
                            <p className="font-[family-name:var(--font-serif)] text-lg md:text-2xl text-[#F8F1E1]/95 font-medium">
                                {dateLabel}
                            </p>
                            <p className="mt-2 font-[family-name:var(--font-display)] tracking-widest text-sm md:text-base text-[#C9A24B] font-semibold">
                                {timeLabel} — {inv.venue}
                            </p>
                        </motion.div>
                    </div>
                </GateStage>
            </section>

            {/* ── CELEBRATION DATES — front and prominent, right under the gate ── */}
            <section className="relative px-4 pt-16 pb-20 md:pt-20 md:pb-24">
                <ScrollReveal className="text-center mb-10 md:mb-12">
                    <p className="text-[11px] md:text-xs tracking-[0.5em] uppercase text-[#C9A24B] font-[family-name:var(--font-display)] font-bold">
                        مواعيد الاحتفال
                    </p>
                    <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl md:text-6xl text-gold-gradient font-bold">
                        <TitleGlow color="rgba(201,162,75,0.45)">أيام لا تُنسى</TitleGlow>
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div
                        className={`grid gap-5 md:gap-7 max-w-5xl mx-auto ${inv.additionalDates && inv.additionalDates.length > 0
                                ? "grid-cols-1 md:grid-cols-[1.3fr_repeat(auto-fit,minmax(220px,1fr))]"
                                : "grid-cols-1 max-w-xl"
                            }`}
                    >
                        {/* Main date — the largest, gold-framed card */}
                        <HoverLift>
                            <div className="panel relative h-full rounded-3xl p-8 md:p-10 text-center border-2 border-[#C9A24B]/50 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                                <span className="inline-block text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#0D2B26] bg-gradient-to-r from-[#E4C77E] to-[#C9A24B] px-4 py-1.5 rounded-full font-bold font-[family-name:var(--font-display)]">
                                    الحفل الرئيسي
                                </span>
                                <p className="mt-5 font-[family-name:var(--font-serif)] text-2xl md:text-4xl text-gold-gradient font-bold leading-snug capitalize">
                                    {dateLabel}
                                </p>
                                <div className="rule w-24 mx-auto my-4" />
                                <p className="flex items-center justify-center gap-2 text-[#F8F1E1]/90 font-[family-name:var(--font-serif)] text-lg md:text-xl font-medium">
                                    <Calendar size={18} className="flourish" /> {timeLabel}
                                </p>
                                <p className="mt-1 text-[#C9A24B]/85 text-sm md:text-base">{inv.venue}</p>
                            </div>
                        </HoverLift>

                        {/* Additional celebration dates — same visual weight as before, just smaller than the main card */}
                        {inv.additionalDates?.map((item, idx) => {
                            const d = new Date(item.date);
                            const formatted = d.toLocaleDateString("ar-TN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            });
                            const t = item.timeLabel || d.toLocaleTimeString("ar-TN", { hour: "2-digit", minute: "2-digit" });
                            return (
                                <HoverLift key={idx}>
                                    <div className="panel h-full rounded-3xl p-7 md:p-8 text-center border border-[#C9A24B]/30 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
                                        <span className="inline-block text-[10px] tracking-[0.25em] uppercase text-[#C9A24B] border border-[#C9A24B]/50 px-3.5 py-1 rounded-full font-[family-name:var(--font-display)] font-semibold">
                                            {item.label}
                                        </span>
                                        <p className="mt-4 font-[family-name:var(--font-serif)] text-xl md:text-2xl text-[#F8F1E1] font-bold leading-snug capitalize">
                                            {formatted}
                                        </p>
                                        <div className="rule w-16 mx-auto my-3.5" />
                                        <p className="text-[#C9A24B]/85 text-sm md:text-base font-[family-name:var(--font-serif)]">{t}</p>
                                        {item.venue && (
                                            <p className="mt-1 text-[#C9A24B]/85 text-sm md:text-base font-[family-name:var(--font-serif)]">{item.venue}</p>
                                        )}
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
                        <div className="panel rounded-3xl p-10 md:p-16 text-center border border-[#C9A24B]/25 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                            <div className="rule w-16 mx-auto mb-6" />
                            <p className="font-[family-name:var(--font-serif)] text-xl md:text-3xl leading-relaxed text-[#F8F1E1] font-medium">
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
                        <div className="max-w-3xl mx-auto relative rounded-[2.5rem] overflow-hidden border-2 border-[#C9A24B]/40 img-vignette shadow-[0_25px_55px_rgba(0,0,0,0.6)]">
                            <img
                                src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                                alt={`${inv.brideName} & ${inv.groomName}`}
                                className="w-full h-[460px] md:h-[540px] object-cover transition-transform duration-1000 hover:scale-[1.04]"
                                style={{ filter: "saturate(0.95) contrast(1.02)" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040C0A] via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-9 left-0 right-0 text-center z-10">
                                <TitleGlow color="rgba(201,162,75,0.55)">
                                    <p className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl text-gold-gradient font-bold">
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
                        <div className="panel max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center border border-[#C9A24B]/30 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                            <h3 className="font-[family-name:var(--font-serif)] text-3xl md:text-5xl text-gold-gradient font-bold leading-tight">
                                {inv.venue}
                            </h3>
                            <p className="mt-4 text-[#F8F1E1]/80 font-[family-name:var(--font-serif)] text-lg md:text-xl font-medium">
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
                                        className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden border border-[#C9A24B]/40 shadow-[0_25px_55px_rgba(0,0,0,0.55)]"
                                        style={{ filter: "hue-rotate(140deg) saturate(0.5) brightness(0.85)" }}
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
                                    <div className="max-w-3xl mx-auto rounded-3xl border border-[#C9A24B]/35 bg-black/30 px-8 py-16 text-center">
                                        <MapPin className="mx-auto mb-4 text-[#C9A24B]" size={38} />
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
                                        className="inline-flex items-center gap-2.5 text-[#C9A24B] hover:text-[#F8F1E1] font-[family-name:var(--font-display)] tracking-wider text-base font-semibold transition-colors duration-300"
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
                <FloatingHearts count={6} palette="gold" />
                <Title eyebrow="تأكيد الحضور" title="بانتظار تشريفكم لنا" />
                <ScrollReveal delay={0.1}>
                    <p className="max-w-2xl mx-auto text-[#F8F1E1]/80 font-[family-name:var(--font-serif)] text-lg md:text-xl leading-relaxed font-medium">
                        نرجو حضوركم لتشهدوا معنا أجمل فصول العمر، ونرسم معاً ذكرى حب لا تزول.
                    </p>
                </ScrollReveal>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <footer className="relative px-4 py-20 text-center bg-[#040C0A]">
                <ScrollReveal>
                    <TitleGlow color="rgba(201,162,75,0.5)">
                        <p className="font-[family-name:var(--font-script)] text-3xl md:text-4xl text-gold-gradient">
                            تُفتح البوابة، ويبقى الحب خالداً
                        </p>
                    </TitleGlow>
                    <p className="mt-4 text-xs tracking-[0.3em] uppercase text-[#C9A24B]/70 font-[family-name:var(--font-display)] font-semibold">
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
            <p className="text-[11px] md:text-xs tracking-[0.5em] uppercase text-[#C9A24B] font-[family-name:var(--font-display)] font-bold">
                {eyebrow}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl md:text-6xl text-gold-gradient font-bold">
                <TitleGlow color="rgba(201,162,75,0.45)">{title}</TitleGlow>
            </h2>
            <AnimatedDivider color="#C9A24B" width="140px" className="mt-5" />
        </ScrollReveal>
    );
}
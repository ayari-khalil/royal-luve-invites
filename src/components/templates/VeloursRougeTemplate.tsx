import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, Calendar, MessageCircle, Sparkles as SparkleIcon } from "lucide-react";
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
   VELVET CURTAIN PIECES
   ──────────────────────────────────────────────────────────────────────────── */

/** Repeating vertical folds of deep red velvet, with sheen + shadow overlays. */
const VELVET_BG = `
  repeating-linear-gradient(
    90deg,
    #3c0714 0px,
    #6d1128 34px,
    #8a1d38 52px,
    #5a0d20 78px,
    #3c0714 104px
  )
`;

function VelvetPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute inset-y-0 w-full"
      style={{
        background: VELVET_BG,
        boxShadow:
          side === "left"
            ? "inset -40px 0 60px rgba(0,0,0,0.55)"
            : "inset 40px 0 60px rgba(0,0,0,0.55)",
      }}
    >
      {/* soft top-to-bottom sheen so folds catch the light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,220,160,0.10) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      {/* inner edge highlight where the curtain will part */}
      <div
        className="absolute inset-y-0 w-10"
        style={{
          [side === "left" ? "right" : "left"]: 0,
          background:
            side === "left"
              ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.18))"
              : "linear-gradient(270deg, transparent, rgba(212,175,55,0.18))",
        }}
      />
    </div>
  );
}

/** Gold fringe strip (thin repeating strands). */
function GoldFringe({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-6 w-full ${className}`}
      style={{
        background:
          "repeating-linear-gradient(90deg, #d4af37 0px, #f0d78c 2px, #8a6d1f 4px, #d4af37 6px)",
        maskImage:
          "linear-gradient(180deg, black 0%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, black 0%, black 55%, transparent 100%)",
        filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.5))",
      }}
    />
  );
}

/** Scalloped valance (pelmet) that crowns the stage and never moves. */
function Valance() {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <svg
        viewBox="0 0 1200 130"
        preserveAspectRatio="none"
        className="w-full h-24 md:h-32 block"
      >
        <defs>
          <linearGradient id="valanceVelvet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a1830" />
            <stop offset="55%" stopColor="#5a0d20" />
            <stop offset="100%" stopColor="#3c0714" />
          </linearGradient>
        </defs>
        {/* five swags */}
        <path
          d="M0 0 H1200 V50
             Q1140 118 1080 50 Q1020 118 960 50
             Q900 118 840 50 Q780 118 720 50
             Q660 118 600 50 Q540 118 480 50
             Q420 118 360 50 Q300 118 240 50
             Q180 118 120 50 Q60 118 0 50 Z"
          fill="url(#valanceVelvet)"
        />
        {/* gold trim following the swags */}
        <path
          d="M0 50 Q60 118 120 50 Q180 118 240 50
             Q300 118 360 50 Q420 118 480 50
             Q540 118 600 50 Q660 118 720 50
             Q780 118 840 50 Q900 118 960 50
             Q1020 118 1080 50 Q1140 118 1200 50"
          fill="none"
          stroke="#d4af37"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}
        />
      </svg>
    </div>
  );
}

/** Swinging gold tassel hung from the valance. */
function Tassel({ left, delay = 0 }: { left: string; delay?: number }) {
  return (
    <div
      className="absolute top-16 md:top-24 z-30 pointer-events-none tassel-swing"
      style={{ left, animationDelay: `${delay}s`, transformOrigin: "top center" }}
    >
      <svg width="26" height="70" viewBox="0 0 26 70" fill="none">
        <line x1="13" y1="0" x2="13" y2="26" stroke="#d4af37" strokeWidth="2" />
        <circle cx="13" cy="30" r="5" fill="#f0d78c" stroke="#8a6d1f" />
        <path d="M6 34 H20 L18 62 Q13 68 8 62 Z" fill="#d4af37" />
        <path
          d="M8 38 V60 M11 38 V62 M14 38 V62 M17 38 V60"
          stroke="#8a6d1f"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   THE OPENING — curtains part, spotlight fades in
   ──────────────────────────────────────────────────────────────────────────── */

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

function CurtainStage({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Stage content (behind the curtains) */}
      {children}

      {/* Spotlight — warms up once the curtains part */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ delay: reduceMotion ? 0 : 1.2, duration: 1.6 }}
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 38%, rgba(255,228,170,0.14), transparent 70%)",
        }}
      />

      {/* Left curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 z-20 w-[52%] pointer-events-none"
        style={{ transformOrigin: "left center" }}
        initial={{ x: "0%", scaleX: 1 }}
        animate={
          open
            ? { x: "-72%", scaleX: 0.32 }
            : { x: "0%", scaleX: 1 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.6, ease: CURTAIN_EASE }
        }
      >
        <VelvetPanel side="left" />
      </motion.div>

      {/* Right curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 z-20 w-[52%] pointer-events-none"
        style={{ transformOrigin: "right center" }}
        initial={{ x: "0%", scaleX: 1 }}
        animate={
          open
            ? { x: "72%", scaleX: 0.32 }
            : { x: "0%", scaleX: 1 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.6, ease: CURTAIN_EASE }
        }
      >
        <VelvetPanel side="right" />
      </motion.div>

      {/* Valance + tassels stay as a permanent crown */}
      <Valance />
      <Tassel left="12%" delay={0} />
      <Tassel left="87%" delay={0.7} />

      {/* Pre-opening announcement, printed on the closed curtain */}
      <motion.div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.8 }}
      >
        <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#f0d78c] font-[family-name:var(--font-display)] curtain-text-glow">
          بداية المراسم
        </p>
        <SparkleIcon className="mt-4 text-[#d4af37]" size={18} />
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   SHARED HELPERS (same contract as the other templates)
   ──────────────────────────────────────────────────────────────────────────── */

function getGoogleMapsEmbedUrl(inv: {
  googleMapsLink?: string;
  address?: string;
  venue?: string;
}) {
  if (inv.googleMapsLink?.includes("/embed")) return inv.googleMapsLink;
  const query = inv.address || inv.venue;
  if (!query) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function getGoogleMapsOpenUrl(inv: {
  googleMapsLink?: string;
  address?: string;
  venue?: string;
}) {
  if (inv.googleMapsLink) return inv.googleMapsLink.replace("&output=embed", "");
  const query = inv.address || inv.venue;
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
          className="glass-velvet rounded-2xl p-5 md:p-7 text-center transition-all duration-400 cursor-default"
        >
          <div className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-champagne-gradient leading-none tabular-nums">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="mt-2 text-xs md:text-sm tracking-[0.1em] uppercase text-[#f0d78c]/70 font-[family-name:var(--font-serif)]">
            {it.l}
          </div>
        </motion.div>
      ))}
    </StaggerChildren>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   TEMPLATE
   ──────────────────────────────────────────────────────────────────────────── */

export function VeloursRougeTemplate({ inv }: { inv: Invitation }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // The curtain holds for a beat, then draws open.
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), reduceMotion ? 100 : 1600);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  const dateObj = new Date(inv.weddingDate);
  const dateLabel = dateObj.toLocaleDateString("ar-TN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = dateObj.toLocaleTimeString("ar-TN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Hero copy is revealed only once the curtains have started to part.
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { delay: reduceMotion ? 0 : delay, duration: 1 },
  });

  return (
    <div dir="rtl" className="relative min-h-screen bg-velours text-[#f3e6ce] overflow-x-hidden">
      <style>{`
        .bg-velours {
          background:
            radial-gradient(ellipse 90% 60% at 50% 0%, #2a0510 0%, transparent 60%),
            linear-gradient(180deg, #16030a 0%, #0d0206 100%);
        }
        .glass-velvet {
          background: rgba(90, 13, 32, 0.22);
          border: 1px solid rgba(212, 175, 55, 0.28);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.45);
        }
        .glass-velvet:hover {
          box-shadow: 0 10px 50px rgba(212,175,55,0.15), 0 10px 40px rgba(0,0,0,0.45);
        }
        .text-champagne-gradient {
          background: linear-gradient(135deg, #f7e7bf 0%, #d4af37 45%, #f0d78c 70%, #b8860b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .btn-velours {
          background: linear-gradient(135deg, #8a1d38, #5a0d20);
          border: 1px solid rgba(212,175,55,0.6);
          color: #f7e7bf;
          box-shadow: 0 8px 30px rgba(138,29,56,0.5), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .btn-velours:hover {
          box-shadow: 0 8px 40px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .curtain-text-glow {
          text-shadow: 0 0 18px rgba(212,175,55,0.8), 0 0 40px rgba(212,175,55,0.4);
        }
        @keyframes tasselSwing {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .tassel-swing { animation: tasselSwing 3.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tassel-swing { animation: none; }
        }
        .img-vignette-velours::after {
          content: "";
          position: absolute; inset: 0;
          box-shadow: inset 0 0 120px rgba(13,2,6,0.8);
          pointer-events: none;
        }
      `}</style>

      {/* ── HERO / STAGE ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen">
        <CurtainStage open={open}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <GoldenParticles count={30} color="#d4af37" glowColor="#d4af37" className="z-0" />
            <FloatingHearts count={10} palette="gold" className="z-0" />

            <motion.p
              {...reveal(1.3)}
              className="relative z-10 text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#d4af37] font-[family-name:var(--font-display)] mb-6"
            >
              ❖ بداية حياة مشتركة سعيدة ❖
            </motion.p>

            {/* Monogram medallion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
              transition={{ delay: reduceMotion ? 0 : 1.5, duration: 1 }}
              className="relative inline-flex items-center justify-center mb-8 z-10"
            >
              <PulseRing
                size={96}
                color="rgba(212,175,55,0.3)"
                className="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              />
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#d4af37] bg-[#2a0510]/60 flex items-center justify-center font-[family-name:var(--font-display)] text-2xl md:text-3xl text-champagne-gradient relative z-10">
                {inv.brideName[0]}&{inv.groomName[0]}
              </div>
            </motion.div>

            <motion.h1
              {...reveal(1.7)}
              className="relative z-10 font-[family-name:var(--font-script)] text-5xl md:text-8xl text-champagne-gradient leading-[1.05]"
            >
              <TitleGlow color="rgba(212,175,55,0.55)">{inv.brideName}</TitleGlow>
              <span className="block text-2xl md:text-4xl my-3 text-[#8a1d38] font-[family-name:var(--font-display)] tracking-[0.2em]">
                ❖ و ❖
              </span>
              <TitleGlow color="rgba(212,175,55,0.55)">{inv.groomName}</TitleGlow>
            </motion.h1>

            <motion.div {...reveal(2.1)} className="relative z-10">
              <AnimatedDivider color="#d4af37" width="120px" className="my-8" />
              <p className="font-[family-name:var(--font-serif)] text-lg md:text-xl text-[#f3e6ce]/85 capitalize">
                {dateLabel}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] tracking-wider text-sm text-[#d4af37]">
                {timeLabel} — {inv.venue}
              </p>
            </motion.div>
          </div>
        </CurtainStage>
      </section>

      {/* ── MESSAGE ──────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-24">
        <ScrollReveal>
          <HoverLift>
            <div className="glass-velvet max-w-3xl mx-auto rounded-3xl p-10 md:p-16 text-center relative">
              <div className="absolute inset-3 rounded-2xl border border-[#d4af37]/25 pointer-events-none" />
              <SparkleIcon className="mx-auto text-[#d4af37]" size={20} />
              <AnimatedDivider color="#d4af37" width="80px" className="my-4" />
              <p className="mt-4 font-[family-name:var(--font-serif)] italic text-xl md:text-2xl leading-relaxed text-[#f3e6ce]/90">
                « {inv.message} »
              </p>
              <AnimatedDivider color="#d4af37" width="80px" className="mt-6" />
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="العد التنازلي" title="في انتظار دقة البدء" />
        <Countdown date={inv.weddingDate} />
      </section>

      {/* ── PHOTO ────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="حكايتنا" title="قلبان ودرب واحد" />
        <ScrollReveal>
          <HoverLift scale={1.01}>
            <div className="max-w-3xl mx-auto relative">
              <div className="relative rounded-[2rem] overflow-hidden border-2 border-[#d4af37]/40 img-vignette-velours">
                <img
                  src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                  alt={`${inv.brideName} & ${inv.groomName}`}
                  className="w-full h-[520px] object-cover transition-transform duration-700 hover:scale-[1.03]"
                  style={{ filter: "saturate(0.9) contrast(1.05)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0206] via-transparent to-transparent" />
                <div className="absolute inset-4 rounded-[1.5rem] border border-[#d4af37]/30 pointer-events-none" />
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <TitleGlow color="rgba(212,175,55,0.6)">
                    <p className="font-[family-name:var(--font-serif)] text-2xl md:text-4xl text-champagne-gradient">
                      {inv.brideName} و {inv.groomName}
                    </p>
                  </TitleGlow>
                </div>
              </div>
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── VENUE ────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="مكان الاحتفال" title="قاعة زفافنا" />
        <ScrollReveal delay={0.1}>
          <HoverLift>
            <div className="glass-velvet max-w-3xl mx-auto rounded-3xl p-10 text-center">
              <h3 className="font-[family-name:var(--font-serif)] italic text-3xl md:text-4xl text-champagne-gradient">
                {inv.venue}
              </h3>
              <p className="mt-3 text-[#f3e6ce]/70 font-[family-name:var(--font-serif)] italic">
                {inv.address}
              </p>
              <AnimatedDivider color="#d4af37" width="100px" className="my-6" />
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Calendar size={18} />
                  <span className="font-[family-name:var(--font-serif)] capitalize">{dateLabel}</span>
                </div>
                <span className="hidden md:inline text-[#8a1d38]">❖</span>
                <p className="text-2xl text-champagne-gradient font-[family-name:var(--font-serif)] italic">
                  {timeLabel}
                </p>
              </div>
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="خريطة الموقع" title="شاركونا هذه الليلة الاستثنائية" />
        {(() => {
          const embedUrl = getGoogleMapsEmbedUrl(inv);
          const openUrl = getGoogleMapsOpenUrl(inv);
          return (
            <>
              {embedUrl ? (
                <ScrollReveal>
                  <div
                    className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#d4af37]/40"
                    style={{ filter: "hue-rotate(310deg) saturate(0.45) brightness(0.85)" }}
                  >
                    <iframe
                      src={embedUrl}
                      title="Carte"
                      width="100%"
                      height="420"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ border: 0 }}
                    />
                  </div>
                </ScrollReveal>
              ) : (
                <ScrollReveal>
                  <div className="max-w-3xl mx-auto rounded-3xl border border-[#d4af37]/40 bg-black/30 px-6 py-12 text-center">
                    <MapPin className="mx-auto mb-4 text-[#d4af37]" size={34} />
                    <p className="text-[#f0d78c] font-[family-name:var(--font-display)] tracking-widest uppercase text-sm">
                      Lieu de réception
                    </p>
                    {inv.venue && (
                      <p className="mt-4 text-2xl text-white font-[family-name:var(--font-script)]">{inv.venue}</p>
                    )}
                    {inv.address && (
                      <p className="mt-2 text-white/70">{inv.address}</p>
                    )}
                  </div>
                </ScrollReveal>
              )}
              {openUrl && (
                <div className="text-center mt-6">
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#f0d78c] font-[family-name:var(--font-display)] tracking-wider text-sm transition-colors duration-300 cursor-pointer"
                  >
                    <MapPin size={16} /> الموقع على الخريطة
                  </a>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* ── RSVP ─────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-24 text-center">
        <FloatingHearts count={8} palette="gold" />
        <Title eyebrow="تأكيد الحضور" title="بانتظار تشريفكم لنا" />
        <ScrollReveal delay={0.2}>
          <p className="max-w-xl mx-auto text-[#f3e6ce]/70 font-[family-name:var(--font-serif)] mb-8">
            سترفع الستار قريباً. نرجو تأكيد حضوركم لتشهدوا معنا أجمل فصول العمر.
          </p>
          <motion.a
            href={`https://wa.me/${inv.whatsappNumber}?text=${encodeURIComponent(`السلام عليكم، أؤكد حضوري لحفل زفاف ${inv.brideName} و ${inv.groomName}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-velours inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm md:text-base transition-shadow duration-300 cursor-pointer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <MessageCircle size={18} /> تأكيد الحضور عبر واتساب
          </motion.a>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative px-4 py-16 text-center">
        <GoldFringe className="max-w-xs mx-auto rounded-full opacity-60" />
        <ScrollReveal delay={0.1}>
          <TitleGlow color="rgba(212,175,55,0.5)">
            <p className="mt-6 font-[family-name:var(--font-script)] text-3xl text-champagne-gradient">
              يسدل الستار، ويبقى الحب خالداً
            </p>
          </TitleGlow>
          <p className="mt-3 text-xs tracking-[0.2em] uppercase text-[#d4af37]/60 font-[family-name:var(--font-display)]">
            ❖ {inv.brideName} و {inv.groomName} ❖
          </p>
        </ScrollReveal>
      </footer>
    </div>
  );
}

function Title({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <ScrollReveal className="text-center mb-12">
      <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#d4af37] font-[family-name:var(--font-display)]">
        ❖ {eyebrow} ❖
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl text-champagne-gradient">
        <TitleGlow color="rgba(212,175,55,0.45)">{title}</TitleGlow>
      </h2>
      <AnimatedDivider color="#d4af37" width="140px" className="mt-4" />
    </ScrollReveal>
  );
}

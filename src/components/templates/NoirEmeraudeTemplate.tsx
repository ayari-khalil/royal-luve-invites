import { motion } from "framer-motion";
import { useMemo } from "react";
import { MapPin, MessageCircle, Sparkles as SparkleIcon } from "lucide-react";
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

function ArtDecoFrame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 80" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 40 H120" />
      <path d="M280 40 H400" />
      <path d="M200 20 L210 40 L200 60 L190 40 Z" fill="currentColor" />
      <circle cx="160" cy="40" r="3" fill="currentColor" />
      <circle cx="240" cy="40" r="3" fill="currentColor" />
      <path d="M120 40 L140 30 L160 40 L140 50 Z" />
      <path d="M280 40 L260 30 L240 40 L260 50 Z" />
    </svg>
  );
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function GoldStars({ count = 60 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    left: seededRandom(i + 1) * 100,
    top: seededRandom(i + 100) * 100,
    size: 1 + seededRandom(i + 200) * 2.5,
    duration: 3 + seededRandom(i + 300) * 4,
    delay: seededRandom(i + 400) * 4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "#f0d78c",
            boxShadow: "0 0 6px #d4af37, 0 0 12px #d4af37",
            animation: `sparkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Countdown({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  const items = [
    { l: "Jours", v: days },
    { l: "Heures", v: hours },
    { l: "Minutes", v: minutes },
    { l: "Secondes", v: seconds },
  ];
  return (
    <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
      {items.map((it) => (
        <motion.div
          key={it.l}
          variants={staggerItem}
          className="glass-emerald rounded-2xl p-5 md:p-7 text-center hover-glow transition-all duration-400 cursor-default"
        >
          <div className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-emerald-gradient leading-none tabular-nums">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="mt-2 text-xs md:text-sm tracking-[0.3em] uppercase text-[#c8a24a]/70 font-[family-name:var(--font-serif)]">
            {it.l}
          </div>
        </motion.div>
      ))}
    </StaggerChildren>
  );
}

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

export function NoirEmeraudeTemplate({ inv }: { inv: Invitation }) {
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

  return (
    <div dir="rtl" className="relative min-h-screen bg-emerald-noir text-[#e8dcc0] overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Layered atmospheric effects */}
        <GoldStars count={60} />
        <GoldenParticles count={35} color="#d4af37" glowColor="#d4af37" className="z-0" />
        {/* Hearts rise slowly from the bottom of the hero */}
        <FloatingHearts count={14} palette="gold" className="z-0" />

        {/* Rotating gold rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] max-w-[90vw] max-h-[90vw] pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-[#d4af37]/20 ring-spin-slow" />
          <div className="absolute inset-12 rounded-full border border-dashed border-[#1f8a66]/40 ring-spin-rev" />
          <div className="absolute inset-24 rounded-full border border-[#d4af37]/15" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#d4af37] font-[family-name:var(--font-display)] mb-6 z-10"
        >
          ⊹ حفل زفاف استثنائي ⊹
        </motion.p>

        {/* Monogram with pulse ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative inline-flex items-center justify-center mb-8 z-10"
        >
          <PulseRing
            size={96}
            color="rgba(212,175,55,0.3)"
            className="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#d4af37] flex items-center justify-center font-[family-name:var(--font-display)] text-2xl md:text-3xl text-emerald-gradient relative z-10">
            {inv.brideName[0]}&{inv.groomName[0]}
          </div>
        </motion.div>

        {/* Title with glow */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="relative font-[family-name:var(--font-serif)] text-5xl md:text-8xl text-emerald-gradient leading-[1.05] z-10"
        >
          <TitleGlow color="rgba(31,138,102,0.5)">{inv.brideName}</TitleGlow>
          <span className="block text-2xl md:text-4xl my-3 text-[#d4af37] not-italic font-[family-name:var(--font-display)] tracking-[0.2em]">
            ◆ و ◆
          </span>
          <TitleGlow color="rgba(31,138,102,0.5)">{inv.groomName}</TitleGlow>
        </motion.h1>

        <ArtDecoFrame className="w-72 md:w-96 h-12 text-[#d4af37] mt-10 relative z-10" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative mt-6 font-[family-name:var(--font-serif)] italic text-lg md:text-xl text-[#e8dcc0]/80 capitalize z-10"
        >
          {dateLabel}
        </motion.p>
        <p className="relative mt-1 font-[family-name:var(--font-display)] tracking-[0.4em] text-sm text-[#d4af37] z-10">
          {timeLabel} — {inv.venue}
        </p>
      </section>

      {/* ── MESSAGE ──────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-24">
        <ScrollReveal>
          <HoverLift>
            <div className="glass-emerald max-w-3xl mx-auto rounded-3xl p-10 md:p-16 text-center relative">
              <div className="absolute inset-3 rounded-2xl border border-[#d4af37]/25 pointer-events-none" />
              <SparkleIcon className="mx-auto text-[#d4af37]" size={20} />
              <AnimatedDivider color="#d4af37" width="80px" className="my-4" />
              <p className="mt-4 font-[family-name:var(--font-serif)] italic text-xl md:text-2xl leading-relaxed text-[#e8dcc0]/90">
                « {inv.message} »
              </p>
              <AnimatedDivider color="#d4af37" width="80px" className="mt-6" />
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="العد التنازلي" title="في انتظار الليلة الكبرى" />
        <Countdown date={inv.weddingDate} />
      </section>

      {/* ── PHOTO ────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="حبنا الموعود" title="مكتوب بين النجوم" />
        <ScrollReveal>
          <HoverLift scale={1.01}>
            <div className="max-w-3xl mx-auto relative">
              <div className="relative rounded-[2rem] overflow-hidden border-2 border-[#d4af37]/40 img-vignette">
                <img
                  src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                  alt={`${inv.brideName} و ${inv.groomName}`}
                  className="w-full h-[520px] object-cover transition-transform duration-700 hover:scale-[1.03]"
                  style={{ filter: "saturate(0.85) contrast(1.05)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F0C] via-transparent to-transparent" />
                <div className="absolute inset-4 rounded-[1.5rem] border border-[#d4af37]/30 pointer-events-none" />
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <TitleGlow color="rgba(212,175,55,0.6)">
                    <p className="font-[family-name:var(--font-serif)] text-2xl md:text-4xl text-emerald-gradient">
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
        <Title eyebrow="مكان الحفل" title="حيث يجتمع الأحباب" />
        <ScrollReveal delay={0.1}>
          <HoverLift>
            <div className="glass-emerald max-w-3xl mx-auto rounded-3xl p-10 text-center hover-glow">
              <h3 className="font-[family-name:var(--font-serif)] italic text-3xl md:text-4xl text-emerald-gradient">
                {inv.venue}
              </h3>
              <p className="mt-3 text-[#e8dcc0]/70 font-[family-name:var(--font-serif)] italic">
                {inv.address}
              </p>
              <ArtDecoFrame className="w-60 h-10 mx-auto text-[#d4af37] my-6" />
              <p className="font-[family-name:var(--font-display)] tracking-[0.3em] text-[#d4af37] capitalize text-sm">
                {dateLabel}
              </p>
              <p className="mt-1 text-2xl text-emerald-gradient font-[family-name:var(--font-serif)] italic">
                {timeLabel}
              </p>
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <Title eyebrow="خريطة الموقع" title="تفضلوا بمشاركتنا فرحتنا" />
        {(() => {
          const embedUrl = getGoogleMapsEmbedUrl(inv);
          const openUrl = getGoogleMapsOpenUrl(inv);
          return (
            <>
              {embedUrl ? (
                <ScrollReveal>
                  <div
                    className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#d4af37]/40"
                    style={{ filter: "hue-rotate(120deg) saturate(0.5) brightness(0.85)" }}
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
        {/* Extra hearts around RSVP for a romantic finish */}
        <FloatingHearts count={8} palette="gold" />
        <Title eyebrow="تأكيد الحضور" title="حضوركم يشرفنا ويسعدنا" />
        <ScrollReveal delay={0.2}>
          <p className="max-w-xl mx-auto text-[#e8dcc0]/70 font-[family-name:var(--font-serif)] mb-8">
            يرجى تأكيد حضوركم قبل موعد الحفل لمشاركتنا فرحة العمر وتأكيد مكانكم.
          </p>
          <motion.a
            href={`https://wa.me/${inv.whatsappNumber}?text=${encodeURIComponent(`السلام عليكم، أؤكد حضوري لحفل زفاف ${inv.brideName} و ${inv.groomName}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-emerald inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm md:text-base cursor-pointer"
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
        <ArtDecoFrame className="w-72 h-10 mx-auto text-[#d4af37]" />
        <ScrollReveal delay={0.1}>
          <TitleGlow color="rgba(212,175,55,0.5)">
            <p className="mt-6 font-[family-name:var(--font-serif)] text-3xl text-emerald-gradient">
              بكل محبة وامتنان
            </p>
          </TitleGlow>
          <p className="mt-3 text-xs tracking-[0.2em] uppercase text-[#d4af37]/60 font-[family-name:var(--font-display)]">
            ⊹ {inv.brideName} و {inv.groomName} ⊹
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
        ⊹ {eyebrow} ⊹
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl text-emerald-gradient">
        <TitleGlow color="rgba(31,138,102,0.45)">{title}</TitleGlow>
      </h2>
      <ArtDecoFrame className="w-48 h-8 mx-auto text-[#d4af37] mt-4" />
    </ScrollReveal>
  );
}

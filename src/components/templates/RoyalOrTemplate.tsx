import { motion } from "framer-motion";
import { MapPin, Calendar, MessageCircle, Heart } from "lucide-react";
import type { Invitation } from "@/data/invitations";
import { FloatingPetals } from "@/components/FloatingPetals";
import { Sparkles } from "@/components/Sparkles";
import { Ornament } from "@/components/Ornament";
import { CountdownSection } from "@/components/CountdownSection";
import {
  FloatingHearts,
  GoldenParticles,
  FloatingPetalsEnhanced,
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

export function RoyalOrTemplate({ inv }: { inv: Invitation }) {
  const dateObj = new Date(inv.weddingDate);
  const dateLabel = dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = dateObj.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative min-h-screen bg-royal text-foreground overflow-x-hidden">
      {/* Original petal layer kept — enhanced petals added below */}
      <FloatingPetals />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Layered atmosphere: rose petals + soft gold particles */}
        <FloatingPetalsEnhanced count={16} palette="rose" className="z-0" />
        <GoldenParticles
          count={30}
          color="rgba(212,175,55,0.8)"
          glowColor="rgba(212,175,55,0.6)"
          className="z-0"
        />
        <FloatingHearts count={10} palette="rose" className="z-0" />

        <Sparkles count={20} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card relative max-w-2xl w-full rounded-3xl px-8 py-14 md:px-16 md:py-20 text-center z-10"
        >
          <div className="absolute inset-3 rounded-2xl border border-[color:var(--gold)]/30 pointer-events-none" />

          {/* Pulse rings behind ornament */}
          <div className="relative flex justify-center mb-6">
            <PulseRing size={80} color="rgba(212,175,55,0.25)" className="-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 absolute" />
            <Ornament className="w-40 h-7 text-[color:var(--gold)] relative z-10" />
          </div>

          <p className="tracking-[0.4em] uppercase text-xs text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
            Mariage
          </p>

          <h1 className="mt-6 font-[family-name:var(--font-script)] text-5xl md:text-7xl text-gold-gradient leading-tight">
            <TitleGlow color="rgba(212,175,55,0.5)">{inv.brideName}</TitleGlow>
          </h1>
          <p className="my-2 text-2xl text-[color:var(--gold)] font-[family-name:var(--font-serif)] italic">&</p>
          <h1 className="font-[family-name:var(--font-script)] text-5xl md:text-7xl text-gold-gradient leading-tight">
            <TitleGlow color="rgba(212,175,55,0.5)">{inv.groomName}</TitleGlow>
          </h1>

          <Ornament className="w-40 h-7 mx-auto text-[color:var(--gold)] my-8" />

          <p className="font-[family-name:var(--font-serif)] italic text-lg md:text-xl text-muted-foreground leading-relaxed">
            {inv.message}
          </p>

          <AnimatedDivider color="var(--gold)" width="100px" className="my-6" />

          <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2 text-[color:var(--gold-deep)]">
              <Calendar size={18} />
              <span className="font-[family-name:var(--font-serif)] capitalize">{dateLabel}</span>
            </div>
            <span className="hidden md:inline text-[color:var(--gold)]">•</span>
            <div className="font-[family-name:var(--font-display)] tracking-widest text-[color:var(--gold-deep)]">
              {timeLabel}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <SectionTitle eyebrow="Compte à rebours" title="Avant le grand jour" />
        <CountdownSection date={inv.weddingDate} />
      </section>

      {/* ── PHOTO ────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <SectionTitle eyebrow="Notre histoire" title="Deux âmes, une promesse" />
        <ScrollReveal>
          <HoverLift scale={1.01}>
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-[color:var(--gold)]/40 img-vignette">
                <img
                  src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                  alt={`${inv.brideName} & ${inv.groomName}`}
                  className="w-full h-[480px] object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                  <TitleGlow color="rgba(212,175,55,0.5)">
                    <span className="font-[family-name:var(--font-script)] text-3xl md:text-5xl">
                      {inv.brideName} & {inv.groomName}
                    </span>
                  </TitleGlow>
                </div>
              </div>
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── VENUE ────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <SectionTitle eyebrow="Détails" title="Cérémonie & Réception" />
        <ScrollReveal delay={0.1}>
          <HoverLift>
            <div className="max-w-3xl mx-auto glass-card rounded-3xl p-10 text-center hover-glow">
              <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-gold-gradient">
                {inv.venue}
              </h3>
              <p className="mt-3 text-muted-foreground font-[family-name:var(--font-serif)] italic">
                {inv.address}
              </p>
              <div className="ornament-divider my-6"><Heart size={14} /></div>
              <p className="font-[family-name:var(--font-serif)] capitalize">
                {dateLabel} — <span className="text-[color:var(--gold-deep)]">{timeLabel}</span>
              </p>
            </div>
          </HoverLift>
        </ScrollReveal>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <SectionTitle eyebrow="Itinéraire" title="Rejoignez-nous" />
        {(() => {
          const embedUrl = getGoogleMapsEmbedUrl(inv);
          const openUrl = getGoogleMapsOpenUrl(inv);
          return (
            <>
              {embedUrl ? (
                <ScrollReveal>
                  <div
                    className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[color:var(--gold)]/40"
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
                  <div className="max-w-3xl mx-auto rounded-3xl border border-[color:var(--gold)]/40 bg-black/30 px-6 py-12 text-center">
                    <MapPin className="mx-auto mb-4 text-[color:var(--gold)]" size={34} />
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
                    className="inline-flex items-center gap-2 text-[color:var(--gold)] hover:text-[#f0d78c] font-[family-name:var(--font-display)] tracking-widest text-sm transition-colors duration-300"
                  >
                    <MapPin size={16} /> Ouvrir dans Maps
                  </a>
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* ── RSVP ─────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 text-center relative">
        <FloatingHearts count={8} palette="rose" />
        <SectionTitle eyebrow="RSVP" title="Confirmez votre présence" />
        <ScrollReveal delay={0.2}>
          <p className="max-w-xl mx-auto text-muted-foreground font-[family-name:var(--font-serif)] italic mb-8">
            Votre présence comptera énormément pour nous. Merci de confirmer votre venue avant le grand jour.
          </p>
          <motion.a
            href={`https://wa.me/${inv.whatsappNumber}?text=${encodeURIComponent(`Bonjour, je confirme ma présence au mariage de ${inv.brideName} & ${inv.groomName}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-royal inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm md:text-base"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <MessageCircle size={18} /> Confirmer sur WhatsApp
          </motion.a>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-4 py-16 text-center">
        <Ornament className="w-48 h-8 mx-auto text-[color:var(--gold)]" />
        <ScrollReveal delay={0.1}>
          <TitleGlow color="rgba(212,175,55,0.5)">
            <p className="mt-6 font-[family-name:var(--font-script)] text-3xl text-gold-gradient">
              Merci infiniment
            </p>
          </TitleGlow>
          <p className="mt-3 text-xs tracking-[0.4em] uppercase text-muted-foreground font-[family-name:var(--font-display)]">
            Fait avec amour
          </p>
        </ScrollReveal>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <ScrollReveal className="text-center mb-12">
      <p className="text-xs tracking-[0.5em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl text-foreground">
        <TitleGlow color="rgba(212,175,55,0.4)">{title}</TitleGlow>
      </h2>
      <Ornament className="w-32 h-6 mx-auto text-[color:var(--gold)] mt-4" />
    </ScrollReveal>
  );
}

import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, Sparkles as SparkleIcon } from "lucide-react";
import { invitations, type Invitation } from "@/data/invitations";
import { FloatingPetals } from "@/components/FloatingPetals";
import { Sparkles } from "@/components/Sparkles";
import { Ornament } from "@/components/Ornament";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



export const Route = createFileRoute("/marriage/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`${API_URL}/api/invitations/${params.slug}`);
      if (res.ok) {
        return (await res.json()) as Invitation;
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to static data:", e);
    }

    const localInv = invitations.find((i) => i.slug === params.slug);
    if (localInv) {
      return localInv;
    }

    throw notFound();
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
        { title: `${loaderData.brideName} & ${loaderData.groomName} — Faire-part` },
        {
          name: "description",
          content: `Vous êtes cordialement invités au mariage de ${loaderData.brideName} & ${loaderData.groomName}.`,
        },
        { property: "og:title", content: `${loaderData.brideName} & ${loaderData.groomName}` },
        { property: "og:image", content: loaderData.photoUrl },
      ]
      : [{ title: "Faire-part" }],
  }),
  component: EnvelopePage,
});

function EnvelopePage() {
  const inv = Route.useLoaderData();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [exiting, setExiting] = useState(false);
  const initials = `${inv.brideName[0]}${inv.groomName[0]}`;

  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(() => setExiting(true), 1400);
    const n = setTimeout(() => {
      navigate({ to: "/invitation/$slug", params: { slug: inv.slug } });
    }, 2200);
    return () => {
      clearTimeout(t);
      clearTimeout(n);
    };
  }, [opened, navigate, inv.slug]);

  return (
    <div className="relative min-h-screen bg-royal overflow-hidden flex flex-col items-center justify-center px-6">
      <FloatingPetals count={14} />
      <Sparkles count={50} />

      <AnimatePresence>
        {!exiting && (
          <motion.div
            key="envelope-stage"
            exit={{ opacity: 0, scale: 1.4, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-xs md:text-sm tracking-[0.6em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)] mb-3"
            >
              ⊹ Vous êtes invités ⊹
            </motion.p>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-[family-name:var(--font-script)] text-5xl md:text-7xl shimmer-text mb-2"
            >
              {inv.brideName} &amp; {inv.groomName}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Ornament className="w-52 h-9 mx-auto text-[color:var(--gold)] my-4" />
            </motion.div>

            {/* Envelope with halo & rotating rings */}
            <div className="relative mt-8 flex items-center justify-center">
              {/* halo */}
              <div className="absolute w-[520px] h-[520px] max-w-[90vw] max-h-[90vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.35),transparent_60%)] glow-pulse" />
              {/* rings */}
              <div className="absolute w-[440px] h-[440px] max-w-[85vw] max-h-[85vw] rounded-full border border-[color:var(--gold)]/25 ring-spin-slow" />
              <div className="absolute w-[360px] h-[360px] max-w-[75vw] max-h-[75vw] rounded-full border border-dashed border-[color:var(--gold)]/40 ring-spin-rev" />

              <BigEnvelope initials={initials} opened={opened} onOpen={() => setOpened(true)} />
            </div>

            {/* CTA */}
            <AnimatePresence>
              {!opened && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="mt-14 flex flex-col items-center gap-3"
                >
                  <motion.button
                    onClick={() => setOpened(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-royal inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm"
                  >
                    <SparkleIcon size={16} /> Toucher pour ouvrir
                  </motion.button>
                  <ChevronDown className="text-[color:var(--gold-deep)] bounce-arrow" size={22} />
                  <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground font-[family-name:var(--font-display)]">
                    Une surprise vous attend
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal overlay */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-royal"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Ornament className="w-56 h-10 mx-auto text-[color:var(--gold)]" />
              <p className="mt-4 font-[family-name:var(--font-script)] text-5xl text-gold-gradient">
                Bienvenue
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BigEnvelope({
  initials,
  opened,
  onOpen,
}: {
  initials: string;
  opened: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={opened ? undefined : { scale: 1.025, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-[350px] h-[235px] md:w-[540px] md:h-[350px] cursor-pointer focus:outline-none ${opened ? "" : "envelope-breathe"
        }`}
      aria-label="Ouvrir l'invitation"
      style={{ perspective: 1400 }}
    >
      {/* premium glow */}
      <div
        className="absolute -inset-16 -z-10 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.42), rgba(255,248,238,0.28) 42%, transparent 72%)",
        }}
      />

      {/* card peeking from envelope */}
      <motion.div
        className="absolute left-8 right-8 top-8 bottom-8 rounded-2xl border flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{
          zIndex: opened ? 8 : 1,
          background:
            "linear-gradient(180deg, #fffdf8 0%, #fff7ed 55%, #f7e6cf 100%)",
          borderColor: "rgba(190,145,76,0.38)",
          boxShadow:
            "0 28px 60px rgba(92,62,25,0.16), inset 0 0 0 1px rgba(255,255,255,0.88)",
        }}
        animate={
          opened
            ? { y: -125, opacity: 1, rotate: -1.2 }
            : { y: 10, opacity: 0.001, rotate: 0 }
        }
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-5 rounded-xl border"
          style={{ borderColor: "rgba(190,145,76,0.32)" }}
        />

        <div
          className="absolute top-7 left-1/2 h-px w-40 -translate-x-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(190,145,76,.7), transparent)",
          }}
        />

        <p className="text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
          Invitation Privée
        </p>

        <span className="font-[family-name:var(--font-script)] text-5xl md:text-7xl text-gold-gradient mt-3">
          {initials[0]} &amp; {initials[1]}
        </span>

        <Ornament className="w-32 h-6 text-[color:var(--gold)] mt-3" />
      </motion.div>

      {/* envelope body */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, #fffaf3 0%, #f8ead5 44%, #e8c98f 100%)",
          boxShadow:
            "0 42px 110px -28px rgba(114,78,30,0.68), 0 18px 40px rgba(114,78,30,0.18), inset 0 0 0 1px rgba(190,145,76,0.35)",
        }}
      />

      {/* soft paper texture */}
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 25%, rgba(255,255,255,.95) 0 1px, transparent 1px), radial-gradient(circle at 78% 65%, rgba(150,105,50,.35) 0 1px, transparent 1px)",
          backgroundSize: "18px 18px, 26px 26px",
        }}
      />

      {/* luxury borders */}
      <div className="absolute inset-2 rounded-xl border border-[color:var(--gold)]/45" />
      <div className="absolute inset-5 rounded-lg border border-[color:var(--gold)]/20" />

      {/* left fold */}
      <div
        className="absolute left-0 bottom-0 h-full w-full rounded-2xl"
        style={{
          clipPath: "polygon(0 18%, 50% 58%, 0 100%)",
          background:
            "linear-gradient(145deg, rgba(255,249,240,0.96), rgba(237,211,171,0.95))",
          zIndex: 3,
        }}
      />

      {/* right fold */}
      <div
        className="absolute right-0 bottom-0 h-full w-full rounded-2xl"
        style={{
          clipPath: "polygon(100% 18%, 50% 58%, 100% 100%)",
          background:
            "linear-gradient(215deg, rgba(255,249,240,0.95), rgba(224,194,145,0.95))",
          zIndex: 3,
        }}
      />

      {/* bottom fold */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[66%] rounded-b-2xl"
        style={{
          clipPath: "polygon(0 100%, 50% 18%, 100% 100%)",
          background:
            "linear-gradient(180deg, rgba(252,237,214,0.98), rgba(226,194,143,0.98))",
          boxShadow: "0 -14px 32px rgba(104,73,35,0.09)",
          zIndex: 4,
        }}
      />

      {/* top flap */}
      <motion.div
        className="absolute left-0 right-0 top-0 origin-top rounded-t-2xl"
        style={{
          height: "64%",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background:
            "linear-gradient(180deg, #fff8ee 0%, #efd7ae 52%, #d4a85d 100%)",
          boxShadow: "0 16px 34px rgba(87,61,31,0.18)",
          zIndex: 5,
          transformStyle: "preserve-3d",
        }}
        animate={opened ? { rotateX: 180, zIndex: 1 } : { rotateX: 0 }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }}
      />

      {/* premium gold monogram seal - red removed */}
      <motion.div
        className="absolute left-1/2 top-[48%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          width: "92px",
          height: "92px",
          background:
            "linear-gradient(145deg, #fff8df 0%, #e8c777 36%, #b88624 72%, #8a641b 100%)",
          boxShadow:
            "0 16px 38px rgba(82,54,18,0.36), inset 0 1px 0 rgba(255,255,255,.88), inset 0 0 0 1px rgba(255,255,255,.45)",
        }}
        animate={
          opened
            ? { scale: 0.55, opacity: 0, rotate: 25, y: -10 }
            : { scale: 1, opacity: 1, rotate: 0, y: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-[7px] rounded-full border"
          style={{ borderColor: "rgba(255,255,255,.65)" }}
        />

        <div
          className="absolute inset-[15px] rounded-full border"
          style={{ borderColor: "rgba(255,248,220,.35)" }}
        />

        <span
          className="relative font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-widest"
          style={{
            color: "#fffaf0",
            textShadow: "0 2px 9px rgba(70,46,12,0.45)",
          }}
        >
          {initials}
        </span>
      </motion.div>

      {/* corner ornaments */}
      {[
        "top-3 left-3",
        "top-3 right-3 rotate-90",
        "bottom-3 left-3 -rotate-90",
        "bottom-3 right-3 rotate-180",
      ].map((pos, i) => (
        <svg
          key={i}
          className={`absolute w-8 h-8 text-[color:var(--gold-deep)] ${pos}`}
          style={{ zIndex: 7, opacity: 0.75 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M2 2 L10 2 M2 2 L2 10" />
          <circle cx="5" cy="5" r="1.5" fill="currentColor" />
          <path d="M5 8 Q 8 5 8 8" />
        </svg>
      ))}

      {/* shine line */}
      <div
        className="absolute left-10 right-10 top-8 h-px opacity-80"
        style={{
          zIndex: 8,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.95), rgba(190,145,76,.5), transparent)",
        }}
      />

      {/* burst on open */}
      <AnimatePresence>
        {opened && (
          <>
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.45],
                  x: Math.cos((i / 22) * Math.PI * 2) * 190,
                  y: Math.sin((i / 22) * Math.PI * 2) * 190,
                }}
                transition={{ duration: 1.25, delay: 0.2 }}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                style={{
                  zIndex: 20,
                  background: "radial-gradient(circle, #fff4bd, #d4af37)",
                  boxShadow: "0 0 14px #d4af37",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function LuxuryEnvelope({
  initials,
  onOpen,
}: {
  initials: string;
  onOpen?: () => void;
}) {
  const [opened, setOpened] = useState(false);

  const handle = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => onOpen?.(), 1200);
  };

  return (
    <div className="relative flex items-center justify-center w-full py-10">
      <motion.button
        onClick={handle}
        whileHover={opened ? undefined : { scale: 1.025, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-[330px] h-[220px] md:w-[510px] md:h-[330px] cursor-pointer focus:outline-none"
        aria-label="Ouvrir l'invitation"
      >
        {/* soft luxury glow */}
        <div
          className="absolute -inset-12 -z-10 rounded-full opacity-80 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232, 196, 139, 0.42), rgba(255, 245, 238, 0.18) 45%, transparent 72%)",
          }}
        />

        {/* card inside envelope */}
        <motion.div
          className="absolute left-8 right-8 top-8 bottom-8 rounded-2xl overflow-hidden border flex items-center justify-center"
          style={{
            zIndex: opened ? 6 : 1,
            background:
              "linear-gradient(180deg, #fffdf9 0%, #fff7ef 55%, #f8ead8 100%)",
            borderColor: "rgba(190, 145, 76, 0.38)",
            boxShadow:
              "0 24px 50px rgba(91, 62, 28, 0.16), inset 0 0 0 1px rgba(255,255,255,0.85)",
          }}
          animate={
            opened
              ? { y: -120, opacity: 1, rotate: -1.5 }
              : { y: 12, opacity: 0.001, rotate: 0 }
          }
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* card decoration */}
          <div
            className="absolute inset-4 rounded-xl border"
            style={{ borderColor: "rgba(190, 145, 76, 0.3)" }}
          />

          <div
            className="absolute top-5 left-1/2 h-px w-32 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(190,145,76,.65), transparent)",
            }}
          />

          <div className="relative text-center">
            <p
              className="text-[10px] md:text-xs uppercase tracking-[0.45em] mb-3"
              style={{ color: "rgba(122, 86, 45, 0.72)" }}
            >
              Wedding Invitation
            </p>

            <span
              className="font-[family-name:var(--font-script)] text-5xl md:text-7xl"
              style={{
                color: "#9f7838",
                textShadow: "0 8px 28px rgba(190,145,76,.28)",
              }}
            >
              {initials}
            </span>
          </div>
        </motion.div>

        {/* envelope base */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, #fffaf4 0%, #f8ead9 42%, #ead0a6 100%)",
            boxShadow:
              "0 38px 90px -34px rgba(95, 66, 31, 0.65), 0 14px 35px rgba(95, 66, 31, 0.18), inset 0 0 0 1px rgba(190,145,76,0.32)",
          }}
        />

        {/* subtle paper texture */}
        <div
          className="absolute inset-0 rounded-2xl opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.9) 0 1px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(160,120,70,.35) 0 1px, transparent 1px)",
            backgroundSize: "18px 18px, 24px 24px",
          }}
        />

        {/* elegant border */}
        <div
          className="absolute inset-3 rounded-xl border"
          style={{
            borderColor: "rgba(190,145,76,0.34)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)",
          }}
        />

        {/* left fold */}
        <div
          className="absolute left-0 bottom-0 h-full w-full rounded-2xl"
          style={{
            clipPath: "polygon(0 22%, 50% 58%, 0 100%)",
            background:
              "linear-gradient(145deg, rgba(255,249,242,0.92), rgba(237,211,171,0.92))",
            zIndex: 3,
          }}
        />

        {/* right fold */}
        <div
          className="absolute right-0 bottom-0 h-full w-full rounded-2xl"
          style={{
            clipPath: "polygon(100% 22%, 50% 58%, 100% 100%)",
            background:
              "linear-gradient(215deg, rgba(255,249,242,0.9), rgba(224,194,145,0.9))",
            zIndex: 3,
          }}
        />

        {/* bottom fold */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[64%] rounded-b-2xl"
          style={{
            clipPath: "polygon(0 100%, 50% 20%, 100% 100%)",
            background:
              "linear-gradient(180deg, rgba(250,235,214,0.96), rgba(226,194,143,0.96))",
            boxShadow: "0 -12px 28px rgba(104, 73, 35, 0.08)",
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
              "linear-gradient(180deg, #fff8ef 0%, #efd7b2 55%, #d7ad69 100%)",
            boxShadow: "0 14px 32px rgba(87, 61, 31, 0.16)",
            zIndex: 5,
            transformStyle: "preserve-3d",
          }}
          animate={opened ? { rotateX: 180, zIndex: 1 } : { rotateX: 0 }}
          transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
        />

        {/* premium monogram seal - no red circle */}
        <motion.div
          className="absolute left-1/2 top-[49%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            width: "82px",
            height: "82px",
            background:
              "linear-gradient(145deg, #fff8e8 0%, #d8b46b 45%, #9f7838 100%)",
            boxShadow:
              "0 14px 34px rgba(92, 62, 25, 0.32), inset 0 1px 0 rgba(255,255,255,.9), inset 0 0 0 1px rgba(255,255,255,.45)",
          }}
          animate={
            opened
              ? { scale: 0.75, opacity: 0, y: -8 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={{ duration: 0.45 }}
        >
          <div
            className="absolute inset-[7px] rounded-full border"
            style={{ borderColor: "rgba(255,255,255,.62)" }}
          />

          <div
            className="absolute inset-[14px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,255,255,.75), rgba(255,255,255,0) 42%)",
            }}
          />

          <span
            className="relative font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-widest"
            style={{
              color: "#fffaf0",
              textShadow: "0 2px 8px rgba(72, 49, 20, 0.35)",
            }}
          >
            {initials}
          </span>
        </motion.div>

        {/* delicate floral corner accents */}
        <div
          className="absolute left-6 top-6 h-12 w-12 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), transparent 35%), radial-gradient(circle at 70% 70%, rgba(214,174,103,.45), transparent 38%)",
            zIndex: 6,
          }}
        />

        <div
          className="absolute right-6 bottom-6 h-12 w-12 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(255,255,255,.85), transparent 35%), radial-gradient(circle at 30% 70%, rgba(214,174,103,.42), transparent 38%)",
            zIndex: 6,
          }}
        />

        {/* shine line */}
        <div
          className="absolute left-8 right-8 top-7 h-px opacity-70"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.9), rgba(190,145,76,.45), transparent)",
            zIndex: 7,
          }}
        />
      </motion.button>

      <AnimatePresence>
        {!opened && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.25 }}
            className="absolute -bottom-4 text-xs md:text-sm tracking-[0.42em] uppercase font-[family-name:var(--font-display)]"
            style={{ color: "rgba(122, 86, 45, 0.68)" }}
          >
            Cliquez pour ouvrir
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
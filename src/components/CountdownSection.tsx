import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";

export function CountdownSection({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  const items = [
    { label: "Jours", value: days },
    { label: "Heures", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Secondes", value: seconds },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.7 }}
          className="glass-card rounded-2xl p-5 md:p-7 text-center"
        >
          <div className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-gold-gradient leading-none tabular-nums">
            {String(it.value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground font-[family-name:var(--font-serif)]">
            {it.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
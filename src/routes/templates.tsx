import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Eye } from "lucide-react";
import { TEMPLATES, invitations } from "@/data/invitations";
import { Ornament } from "@/components/Ornament";
import { Sparkles } from "@/components/Sparkles";

export const Route = createFileRoute("/templates")({
  component: TemplatesPage,
  head: () => ({
    meta: [
      { title: "Templates — Royal Wedding VIP" },
      {
        name: "description",
        content:
          "Choisissez parmi nos modèles de faire-part de luxe : Royal Or, Noir & Émeraude, Jardin Rose.",
      },
      { property: "og:title", content: "Templates de faire-part de luxe" },
    ],
  }),
});

function TemplatesPage() {
  return (
    <div className="relative min-h-screen bg-royal overflow-x-hidden">
      <Sparkles count={25} />

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center gap-2 text-[color:var(--gold-deep)]">
          <Crown size={20} />
          <span className="font-[family-name:var(--font-display)] tracking-[0.3em] text-sm">
            ROYAL VIP
          </span>
        </Link>
        <Link
          to="/admin"
          className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]"
        >
          Admin
        </Link>
      </nav>

      <section className="px-6 pt-10 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs md:text-sm tracking-[0.5em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]"
        >
          Notre collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mt-4 font-[family-name:var(--font-script)] text-5xl md:text-7xl shimmer-text"
        >
          Choisissez votre style
        </motion.h1>
        <Ornament className="w-48 h-8 mx-auto text-[color:var(--gold)] mt-4" />
        <p className="mt-5 max-w-2xl mx-auto text-muted-foreground font-[family-name:var(--font-serif)] italic">
          Trois univers, une même promesse de luxe. Explorez chaque modèle en
          version réelle, puis choisissez celui qui vous ressemble.
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TEMPLATES.map((t, i) => {
            const demo = invitations.find((inv) => inv.template === t.id) ?? invitations[0];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="glass-card rounded-3xl overflow-hidden flex flex-col"
              >
                {/* palette preview */}
                <div
                  className="h-44 relative flex items-end p-5"
                  style={{
                    background: `linear-gradient(135deg, ${t.palette[0]} 0%, ${t.palette[1]} 40%, ${t.palette[2]} 80%, ${t.palette[3]} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.6),transparent_50%)]" />
                  <div className="relative flex gap-2">
                    {t.palette.map((c) => (
                      <span
                        key={c}
                        className="w-6 h-6 rounded-full border border-white/40 shadow"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
                    Modèle
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-serif)] italic text-3xl text-gold-gradient">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--gold-deep)] font-[family-name:var(--font-serif)] italic">
                    {t.tagline}
                  </p>
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                    {t.description}
                  </p>

                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      to="/marriage/$slug"
                      params={{ slug: demo.slug }}
                      className="btn-royal inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs"
                    >
                      <Eye size={14} /> Voir l'enveloppe
                    </Link>
                    <Link
                      to="/invitation/$slug"
                      params={{ slug: demo.slug }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[color:var(--gold)]/50 text-[color:var(--gold-deep)] hover:bg-[color:var(--gold)]/10 font-[family-name:var(--font-display)] tracking-widest text-xs"
                    >
                      Aperçu direct <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="px-6 py-12 text-center border-t border-[color:var(--gold)]/20">
        <Ornament className="w-40 h-7 mx-auto text-[color:var(--gold)]" />
        <p className="mt-5 text-xs tracking-[0.4em] uppercase text-muted-foreground font-[family-name:var(--font-display)]">
          © Royal Wedding VIP — Tunisie
        </p>
      </footer>
    </div>
  );
}
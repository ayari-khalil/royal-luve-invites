import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, Sparkles as SparkleIcon, Mail, ArrowRight, Palette, Eye } from "lucide-react";
import { invitations, TEMPLATES } from "@/data/invitations";
import { Sparkles } from "@/components/Sparkles";
import { FloatingPetals } from "@/components/FloatingPetals";
import { Ornament } from "@/components/Ornament";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Royal Wedding Invitation VIP — Faire-part de luxe" },
      {
        name: "description",
        content:
          "Plateforme premium de faire-part de mariage numériques. Élégance, raffinement et expérience cinématographique pour vos invités.",
      },
      { property: "og:title", content: "Royal Wedding Invitation VIP" },
      {
        property: "og:description",
        content: "Faire-part de mariage numériques de luxe.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen bg-royal overflow-x-hidden">
      <FloatingPetals count={12} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2 text-[color:var(--gold-deep)]">
          <Crown size={20} />
          <span className="font-[family-name:var(--font-display)] tracking-[0.3em] text-sm">
            ROYAL VIP
          </span>
        </div>
        <Link
          to="/admin"
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground hover:text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]"
        >
          Admin
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-12 pb-24 md:pt-24 md:pb-32 text-center">
        <Sparkles count={35} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xs md:text-sm tracking-[0.5em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]"
        >
          Faire-part numérique d'exception
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2 }}
          className="mt-6 font-[family-name:var(--font-script)] text-6xl md:text-[9rem] leading-[0.95] shimmer-text"
        >
          Royal Wedding
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-2 font-[family-name:var(--font-serif)] italic text-2xl md:text-4xl text-foreground"
        >
          Invitation VIP
        </motion.h2>

        <Ornament className="w-56 h-9 mx-auto text-[color:var(--gold)] mt-8" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-[family-name:var(--font-serif)] italic"
        >
          Offrez à vos invités une expérience cinématographique. Faire-part
          personnalisés, animations royales, élégance intemporelle — pensés
          pour les mariages les plus prestigieux de Tunisie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/templates"
            className="btn-royal inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm"
          >
            <Palette size={16} /> Découvrir les modèles
          </Link>
          <Link
            to="/marriage/$slug"
            params={{ slug: "khalil-sarah" }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[color:var(--gold)]/50 text-[color:var(--gold-deep)] hover:bg-[color:var(--gold)]/10 font-[family-name:var(--font-display)] tracking-widest text-sm"
          >
            <Mail size={16} /> Voir un faire-part <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Templates teaser */}
      <section className="relative px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.5em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
            Templates
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl">
            Quatre univers d'exception
          </h2>
          <Ornament className="w-40 h-7 mx-auto text-[color:var(--gold)] mt-4" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TEMPLATES.map((t, i) => {
            const demo = invitations.find((inv) => inv.template === t.id) ?? invitations[0];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="glass-card rounded-3xl overflow-hidden flex flex-col h-full"
              >
                <div
                  className="h-32"
                  style={{
                    background: `linear-gradient(135deg, ${t.palette[0]}, ${t.palette[1]} 40%, ${t.palette[2]} 80%, ${t.palette[3]})`,
                  }}
                />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] italic text-2xl text-gold-gradient">
                      {t.name}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--gold-deep)] italic">{t.tagline}</p>
                  </div>
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
        <div className="text-center mt-10">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-[color:var(--gold-deep)] hover:text-[color:var(--gold)] font-[family-name:var(--font-display)] tracking-widest text-sm"
          >
            Voir tous les modèles <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.5em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
            L'expérience
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl">
            Un faire-part comme un palais
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Mail />,
              title: "Enveloppe scellée",
              text: "Une enveloppe ivoire et or à ouvrir au clic, avec sceau de cire personnalisé.",
            },
            {
              icon: <SparkleIcon />,
              title: "Pétales & paillettes",
              text: "Particules dorées, pétales de roses et animations cinématographiques.",
            },
            {
              icon: <Crown />,
              title: "URL personnalisée",
              text: "Une adresse unique par couple : /marriage/votre-slug.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="glass-card rounded-3xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--gold)]/15 text-[color:var(--gold-deep)] mb-5">
                {f.icon}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg tracking-widest text-foreground">
                {f.title}
              </h3>
              <p className="mt-3 text-muted-foreground font-[family-name:var(--font-serif)] italic">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="relative px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.5em] uppercase text-[color:var(--gold-deep)] font-[family-name:var(--font-display)]">
            Galerie
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl">
            Invitations en vedette
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {invitations.map((inv) => (
            <Link
              key={inv.id}
              to="/marriage/$slug"
              params={{ slug: inv.slug }}
              className="group glass-card rounded-3xl overflow-hidden block"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={inv.photoUrl}
                  alt={`${inv.brideName} & ${inv.groomName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="font-[family-name:var(--font-script)] text-3xl text-white">
                    {inv.brideName} & {inv.groomName}
                  </p>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-[family-name:var(--font-serif)] italic">
                  /marriage/{inv.slug}
                </span>
                <ArrowRight className="text-[color:var(--gold-deep)] group-hover:translate-x-1 transition" size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="px-6 py-12 text-center border-t border-[color:var(--gold)]/20 mt-12">
        <Ornament className="w-40 h-7 mx-auto text-[color:var(--gold)]" />
        <p className="mt-5 text-xs tracking-[0.4em] uppercase text-muted-foreground font-[family-name:var(--font-display)]">
          © Royal Wedding VIP — Tunisie
        </p>
      </footer>
    </div>
  );
}

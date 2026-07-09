import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState , useRef } from "react";
import { TEMPLATES, type Invitation } from "@/data/invitations";
import { motion } from "framer-motion";
import {
  Crown,
  Plus,
  Copy,
  Eye,
  Pencil,
  Trash2,
  Search,
  Check,
  Lock,
} from "lucide-react";
export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Admin — Royal Wedding VIP" }],
  }),
});
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DEFAULT_WEDDING_PHOTO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";

function AdminDashboard() {
const [auth, setAuth] = useState(false);
const [err, setErr] = useState("");

const userRef = useRef<HTMLInputElement>(null);
const pwdRef = useRef<HTMLInputElement>(null);

const [list, setList] = useState<Invitation[]>([]);
const [loading, setLoading] = useState(false);
const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [editing, setEditing] = useState<Invitation | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
  if (!auth) return;

  async function loadInvitations() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/invitations`);

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des invitations");
      }

      const data = await res.json();
      setList(data);
    } catch (error) {
      console.error("Erreur chargement invitations:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  loadInvitations();
}, [auth]);

  if (!auth) {
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const username = String(formData.get("username") || "").trim();
          const password = String(formData.get("password") || "");

          if (username === "admin" && password === "royal2026") {
            setAuth(true);
            setErr("");
          } else {
            setErr("Identifiants incorrects");
          }
        }}
        className="glass-noir rounded-3xl p-10 w-full max-w-md text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] mb-4">
          <Lock size={20} />
        </div>

        <h1 className="font-[family-name:var(--font-display)] tracking-widest text-gold-gradient text-xl">
          ACCÈS ADMIN
        </h1>

        <p className="mt-2 text-sm text-white/60 font-[family-name:var(--font-serif)] italic">
          Démo : admin / royal2026
        </p>

        <input
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Identifiant"
          className="mt-6 w-full px-4 py-3 rounded-xl bg-white/5 border border-[color:var(--gold)]/30 text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--gold)]"
        />

        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Mot de passe"
          className="mt-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-[color:var(--gold)]/30 text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--gold)]"
        />

        {err && <p className="text-red-400 text-sm mt-3">{err}</p>}

        <button type="submit" className="btn-royal w-full mt-6 py-3 rounded-xl">
          Entrer
        </button>

        <Link to="/" className="block mt-4 text-xs text-white/50 tracking-widest uppercase">
          ← Retour au site
        </Link>
      </form>
    </div>
  );
}

  const filtered = list.filter(
    (i) =>
      i.brideName.toLowerCase().includes(query.toLowerCase()) ||
      i.groomName.toLowerCase().includes(query.toLowerCase()) ||
      i.slug.includes(query.toLowerCase())
  );

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const copy = (slug: string) => {
    navigator.clipboard.writeText(`${baseUrl}/marriage/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 1500);
  };

  const remove = async (id: string) => {
  if (!confirm("Supprimer cette invitation ?")) return;

  try {
    const res = await fetch(`${API_URL}/api/invitations/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erreur suppression");
    }

    setList((l) => l.filter((i) => i.id !== id));
  } catch (error) {
    console.error(error);
    alert("Impossible de supprimer cette invitation.");
  }
};
  const save = async (inv: Invitation) => {
  try {
    const exists = list.find((i) => i.id === inv.id);

    const res = await fetch(
      exists
        ? `${API_URL}/api/invitations/${inv.id}`
        : `${API_URL}/api/invitations`,
      {
        method: exists ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inv),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur sauvegarde");
    }

    const savedInvitation = data.invitation;

    setList((l) => {
      return exists
        ? l.map((i) => (i.id === savedInvitation.id ? savedInvitation : i))
        : [savedInvitation, ...l];
    });

    setEditing(null);
    setCreating(false);
  } catch (error) {
    console.error(error);
    alert(
      error instanceof Error
        ? error.message
        : "Impossible d'enregistrer cette invitation."
    );
  }
};

  return (
    <div className="min-h-screen bg-noir text-white">
      {/* Header */}
      <header className="border-b border-[color:var(--gold)]/20 px-6 md:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[color:var(--gold)]">
          <Crown size={20} />
          <span className="font-[family-name:var(--font-display)] tracking-[0.3em] text-sm">
            ROYAL VIP — ADMIN
          </span>
        </Link>
        <button
          onClick={() => setAuth(false)}
          className="text-xs tracking-[0.3em] uppercase text-white/60 hover:text-[color:var(--gold)]"
        >
          Déconnexion
        </button>
      </header>

      <main className="px-6 md:px-10 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[color:var(--gold)]/80 font-[family-name:var(--font-display)]">
              Tableau de bord
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-serif)] italic text-3xl md:text-5xl text-gold-gradient">
              Vos faire-part
            </h1>
          </div>
          <button
            onClick={() => {
              setCreating(true);
              setEditing(emptyInvitation());
            }}
            className="btn-royal inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm self-start md:self-auto"
          >
            <Plus size={16} /> Nouvelle invitation
          </button>
        </div>

        <div className="glass-noir rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-[color:var(--gold)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par prénom ou slug…"
            className="flex-1 bg-transparent focus:outline-none placeholder:text-white/40"
          />
          <span className="text-xs text-white/50">{filtered.length} résultat(s)</span>
        </div>


        <div className="grid gap-4">
  {loading && (
    <p className="text-center text-white/50 py-8 italic">
      Chargement des invitations...
    </p>
  )}

  {!loading &&
    filtered.map((inv) => (
            <div
              key={inv.id}
              className="glass-noir rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
            >
              <img
                src={inv.photoUrl || DEFAULT_WEDDING_PHOTO}
                alt=""
                className="w-full md:w-28 h-28 rounded-xl object-cover border border-[color:var(--gold)]/30"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-script)] text-3xl text-gold-gradient">
                  {inv.brideName} & {inv.groomName}
                </h3>
                <p className="text-sm text-white/60 truncate">
                  {inv.venue} — {new Date(inv.weddingDate).toLocaleDateString("fr-FR")}
                </p>
                <code className="text-xs text-[color:var(--gold)]/80 truncate block mt-1">
                  {baseUrl}/marriage/{inv.slug}
                </code>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <IconBtn onClick={() => copy(inv.slug)} title="Copier l'URL">
                  {copied === inv.slug ? <Check size={16} /> : <Copy size={16} />}
                </IconBtn>
                <Link
                  to="/marriage/$slug"
                  params={{ slug: inv.slug }}
                  target="_blank"
                  className="px-3 py-2 rounded-lg border border-[color:var(--gold)]/30 hover:bg-[color:var(--gold)]/10 text-[color:var(--gold)]"
                  title="Prévisualiser"
                >
                  <Eye size={16} />
                </Link>
                <IconBtn onClick={() => setEditing(inv)} title="Modifier">
                  <Pencil size={16} />
                </IconBtn>
                <IconBtn
                  onClick={() => remove(inv.id)}
                  title="Supprimer"
                  danger
                >
                  <Trash2 size={16} />
                </IconBtn>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-white/50 py-12 italic">
              Aucune invitation pour le moment.
            </p>
          )}
        </div>
      </main>

      {editing && (
        <InvitationForm
          invitation={editing}
          isNew={creating}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-3 py-2 rounded-lg border transition ${
        danger
          ? "border-red-500/30 hover:bg-red-500/10 text-red-400"
          : "border-[color:var(--gold)]/30 hover:bg-[color:var(--gold)]/10 text-[color:var(--gold)]"
      }`}
    >
      {children}
    </button>
  );
}

function emptyInvitation(): Invitation {
  return {
    id: String(Date.now()),
    slug: "",
    groomName: "",
    brideName: "",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    venue: "",
    address: "",
    googleMapsLink: "",
    message: "",
    photoUrl: "",
    whatsappNumber: "",
    theme: "or",
    template: "royal-or",
    createdAt: new Date().toISOString(),
  };
}

function InvitationForm({
  invitation,
  isNew,
  onClose,
  onSave,
}: {
  invitation: Invitation;
  isNew: boolean;
  onClose: () => void;
  onSave: (i: Invitation) => void;
}) {
  const [form, setForm] = useState<Invitation>(invitation);
  const set = <K extends keyof Invitation>(k: K, v: Invitation[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const [dateInputValue, setDateInputValue] = useState(() => {
    if (!invitation.weddingDate) return "";
    try {
      const d = new Date(invitation.weddingDate);
      if (!isNaN(d.getTime())) {
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      }
    } catch (e) {}
    return invitation.weddingDate.slice(0, 16) || "";
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-noir rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8"
      >
        <h2 className="font-[family-name:var(--font-serif)] italic text-2xl text-gold-gradient mb-6">
          {isNew ? "Nouvelle invitation" : "Modifier l'invitation"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Mariée">
            <input
              value={form.brideName}
              onChange={(e) => set("brideName", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Marié">
            <input
              value={form.groomName}
              onChange={(e) => set("groomName", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Date & heure">
            <input
              type="datetime-local"
              value={dateInputValue}
              onChange={(e) => {
                const val = e.target.value;
                setDateInputValue(val);
                if (val) {
                  const d = new Date(val);
                  if (!isNaN(d.getTime())) {
                    set("weddingDate", d.toISOString());
                  }
                }
              }}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker?.();
                } catch (err) {}
              }}
              className={inputCls}
            />
          </Field>
          <Field label="Slug URL">
            <input
              value={form.slug}
              onChange={(e) =>
                set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              placeholder="khalil-sarah"
              className={inputCls}
            />
          </Field>
          <Field label="Lieu">
            <input
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="WhatsApp (+216…)">
            <input
              value={form.whatsappNumber}
              onChange={(e) => set("whatsappNumber", e.target.value)}
              placeholder="21612345678"
              className={inputCls}
            />
          </Field>
          <Field label="Adresse" full>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Lien Google Maps (embed)" full>
            <input
              value={form.googleMapsLink}
              onChange={(e) => set("googleMapsLink", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="URL photo du couple" full>
            <input
              value={form.photoUrl}
              onChange={(e) => set("photoUrl", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Message" full>
            <div className="flex flex-col gap-2">
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={3.5}
                placeholder="أدخل نص الدعوة هنا..."
                className={inputCls}
              />
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[10px] text-white/50 self-center">اقتراحات نصوص:</span>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "message",
                      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً». بقلوب ملؤها المحبة والسرور، يشرفنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحة العمر. حضوركم يكتمل به بهاؤنا."
                    )
                  }
                  className="px-2.5 py-1 text-xs rounded-full bg-[color:var(--gold)]/10 hover:bg-[color:var(--gold)]/25 text-[color:var(--gold)] border border-[color:var(--gold)]/20 transition-colors cursor-pointer"
                >
                  🕌 دعاء إسلامي
                </button>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "message",
                      "في ليلة من ليالي العمر، نسجنا فيها الحب خيوطاً من ذهب، يسعدنا أن تشاركونا فرحتنا الكبرى وتكونوا شهوداً على بداية رباطنا المقدس وحياتنا المشتركة. ننتظركم بكل حب وشوق."
                    )
                  }
                  className="px-2.5 py-1 text-xs rounded-full bg-[color:var(--gold)]/10 hover:bg-[color:var(--gold)]/25 text-[color:var(--gold)] border border-[color:var(--gold)]/20 transition-colors cursor-pointer"
                >
                  💖 رومانسية
                </button>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "message",
                      "على أنغام المألوف التونسي الفواح وبأريج الياسمين والورد، نتشرف بدعوتكم لمشاركتنا ليلة العمر والاحتفال بقراننا المبارك في أجواء من البهجة والسرور. حضوركم يبهجنا ويسعدنا."
                    )
                  }
                  className="px-2.5 py-1 text-xs rounded-full bg-[color:var(--gold)]/10 hover:bg-[color:var(--gold)]/25 text-[color:var(--gold)] border border-[color:var(--gold)]/20 transition-colors cursor-pointer"
                >
                  🌹 تونسي تقليدي
                </button>
              </div>
            </div>
          </Field>
          <Field label="Template" full>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TEMPLATES.map((t) => {
                const active = form.template === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => set("template", t.id)}
                    className={`rounded-xl overflow-hidden border text-left transition ${
                      active
                        ? "border-[color:var(--gold)] ring-2 ring-[color:var(--gold)]/40"
                        : "border-white/15 hover:border-[color:var(--gold)]/50"
                    }`}
                  >
                    <div
                      className="h-16"
                      style={{
                        background: `linear-gradient(135deg, ${t.palette[0]}, ${t.palette[1]} 40%, ${t.palette[2]} 80%, ${t.palette[3]})`,
                      }}
                    />
                    <div className="px-3 py-2">
                      <p className="text-sm text-[color:var(--gold)] font-[family-name:var(--font-display)] tracking-widest">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-white/50">{t.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:bg-white/5"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="btn-royal px-6 py-2.5 rounded-full"
            disabled={!form.slug || !form.brideName || !form.groomName}
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-lg bg-white/5 border border-[color:var(--gold)]/30 text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--gold)]";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="text-xs tracking-[0.2em] uppercase text-[color:var(--gold)]/80 font-[family-name:var(--font-display)] mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
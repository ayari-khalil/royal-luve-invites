export type Invitation = {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string; // ISO
  venue: string;
  address: string;
  googleMapsLink: string;
  message: string;
  photoUrl: string;
  musicUrl?: string;
  whatsappNumber: string;
  theme: "or" | "rose" | "noir";
  template: TemplateId;
  createdAt: string;
};

export type TemplateId = "royal-or" | "noir-emeraude" | "jardin-rose" | "velours-rouge";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  palette: string[];
}[] = [
  {
    id: "royal-or",
    name: "Royal Or",
    tagline: "Ivoire & Or — l'élégance d'un palais",
    description:
      "Faire-part lumineux, pétales dorés, typographie cursive prestigieuse. L'esprit d'un mariage royal méditerranéen.",
    palette: ["#FFF8F0", "#F7E7CE", "#D4AF37", "#6B4F1D"],
  },
  {
    id: "noir-emeraude",
    name: "Noir & Émeraude",
    tagline: "Sombre, mystérieux, somptueux",
    description:
      "Esthétique nocturne, accents émeraude et or, ornements art-déco. Pour un mariage d'exception au cœur de la nuit.",
    palette: ["#0A0F0C", "#0D2A22", "#1E7A5A", "#D4AF37"],
  },
  {
    id: "jardin-rose",
    name: "Jardin Rose",
    tagline: "Romantique, floral, poudré",
    description:
      "Inspiration jardin botanique, tons poudrés, feuillages aquarelle. Un faire-part doux comme une promesse.",
    palette: ["#FBF4F1", "#F5D6D0", "#C97A7E", "#5C4033"],
  },
  {
    id: "velours-rouge",
    name: "Velours Rouge",
    tagline: "Théâtral, passionné, impérial",
    description:
      "Fils d'or sur drapé de velours rouge profond, lever de rideau théâtral. L'expression d'un amour passionné et prestigieux.",
    palette: ["#16030a", "#5a0d20", "#8a1d38", "#d4af37"],
  },
];

export const invitations: Invitation[] = [
  {
    id: "1",
    slug: "khalil-sarah",
    groomName: "Khalil",
    brideName: "Sarah",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    venue: "Palais Bayram",
    address: "Avenue Habib Bourguiba, Tunis, Tunisie",
    googleMapsLink: "https://www.google.com/maps?q=Palais+Bayram+Tunis&output=embed",
    message:
      "C'est avec une joie immense que nous vous invitons à partager les instants précieux de notre union. Votre présence sera le plus beau des cadeaux.",
    photoUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    whatsappNumber: "21612345678",
    theme: "or",
    template: "royal-or",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "amine-yasmine",
    groomName: "Amine",
    brideName: "Yasmine",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    venue: "Dar El Jeld",
    address: "Medina de Tunis, Tunisie",
    googleMapsLink: "https://www.google.com/maps?q=Dar+El+Jeld+Tunis&output=embed",
    message:
      "L'amour est la poésie des sens. Honorez-nous de votre présence en ce jour béni.",
    photoUrl:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80",
    whatsappNumber: "21698765432",
    theme: "rose",
    template: "noir-emeraude",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    slug: "anis-rim",
    groomName: "Anis",
    brideName: "Rim",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    venue: "Palais Ennejma Ezzahra",
    address: "Sidi Bou Said, Tunisie",
    googleMapsLink: "https://www.google.com/maps?q=Ennejma+Ezzahra+Sidi+Bou+Said&output=embed",
    message:
      "Une soirée suspendue dans le temps, sous le signe de la passion et de l'élégance. Rejoignez-nous pour notre premier lever de rideau.",
    photoUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    whatsappNumber: "21612345678",
    theme: "or",
    template: "velours-rouge",
    createdAt: new Date().toISOString(),
  },
];

export function getInvitationBySlug(slug: string) {
  return invitations.find((i) => i.slug === slug);
}
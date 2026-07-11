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
      name: "الملكي الذهبي",
      tagline: "العاج والذهب — أناقة القصور الفاخرة",
      description:
        "دعوة مضيئة، بتلات ذهبية متحركة، خط عربي أصيل ورائع. تجسيد لجمال حفل زفاف ملكي متوسطي.",
      palette: ["#FFF8F0", "#F7E7CE", "#D4AF37", "#6B4F1D"],
    },
    {
      id: "noir-emeraude",
      name: "الأسود والزمردي",
      tagline: "غموض الليل الساحر ورقي الزمرد والذهب",
      description:
        "جمالية ليلية استثنائية، تفاصيل باللونين الزمردي والذهبي، زخارف آرت ديكو فاخرة. لحفل زفاف لا يُنسى في قلب الليل.",
      palette: ["#0A0F0C", "#0D2A22", "#1E7A5A", "#D4AF37"],
    },
    {
      id: "jardin-rose",
      name: "حديقة الورد",
      tagline: "لمسة رومانسية ناعمة بنغمات وردية بودرة",
      description:
        "مستوحى من الحدائق الخلابة، نغمات وردية بودرة، وأوراق مائية رقيقة. دعوة زفاف ناعمة كالوعد.",
      palette: ["#FBF4F1", "#F5D6D0", "#C97A7E", "#5C4033"],
    },
    {
      id: "velours-rouge",
      name: "المخمل الأحمر",
      tagline: "افتتاح مسرحي ملكي على ستائر المخمل الأحمر",
      description:
        "خيوط ذهبية على مخمل أحمر ملكي، مع افتتاح مسرحي مذهل للستار. تعبير فريد عن الحب والشغف والرفاهية.",
      palette: ["#16030a", "#5a0d20", "#8a1d38", "#d4af37"],
    },
  ];

export const invitations: Invitation[] = [
  {
    id: "1",
    slug: "khalil-sarah",
    groomName: "خليل",
    brideName: "سارة",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    venue: "قصر بايرام الأثري",
    address: "نهج أندلسية، المدينة العتيقة، تونس",
    googleMapsLink: "https://www.google.com/maps?q=Palais+Bayram+Tunis&output=embed",
    message:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً». بقلوب ملؤها المحبة والسرور، يشرفنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحة العمر. حضوركم يكتمل به بهاؤنا.",
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
    groomName: "أمين",
    brideName: "ياسمين",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    venue: "فندق دار الجلد الفخم",
    address: "نهج دار الجلد، المدينة العتيقة، تونس",
    googleMapsLink: "https://www.google.com/maps?q=Dar+El+Jeld+Tunis&output=embed",
    message:
      "في ليلة من ليالي العمر، نسجنا فيها الحب خيوطاً من ذهب، يسعدنا أن تشاركونا فرحتنا الكبرى وتكونوا شهوداً على بداية رباطنا المقدس وحياتنا المشتركة. ننتظركم بكل حب وشوق.",
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
    groomName: " أنيس السعيدي",
    brideName: "ريم الطرابلسي",
    weddingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    venue: "قصر النجمة الزهراء الموسيقي",
    address: "سيدي بوسعيد، تونس",
    googleMapsLink: "https://www.google.com/maps?q=Ennejma+Ezzahra+Sidi+Bou+Said&output=embed",
    message:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً». بقلوب ملؤها المحبة والسرور، يشرفنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحة العمر. حضوركم يكتمل به بهاؤنا.",
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
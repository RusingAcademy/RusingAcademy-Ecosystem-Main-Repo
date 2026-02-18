/**
 * Library Items — Seed Data & Type Definitions
 * RusingÂcademy Product Library
 * 
 * This file contains the complete product catalog for the /library page.
 * Each item includes bilingual metadata, pricing, cover images, and marketing copy.
 * 
 * To add a new product:
 * 1. Add a new LibraryItem object to the LIBRARY_ITEMS array
 * 2. Place the cover image in /public/images/library/
 * 3. The item will automatically appear on the /library page
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ProductType = "book" | "course" | "download" | "video";
export type PriceType = "free" | "paid";
export type ProductLanguage = "FR" | "EN" | "BILINGUAL";
export type ProductFormat = "PDF" | "EPUB" | "PDF/EPUB" | "VIDEO" | "ONLINE";
export type ProductStatus = "published" | "draft" | "coming_soon";
export type ProductLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "A1-A2" | "A1-C1" | "B1-B2" | "C1-C2" | "ALL";
export type ProductAudience = "learner" | "coach" | "both";
export type ProductCollection = 
  | "sle-exam-prep"
  | "coach-professional-development"
  | "vocabulaire-professionnel"
  | "grammar"
  | "oral-exam"
  | "written-exam"
  | "reading-comprehension";

export interface LibraryItem {
  id: string;
  slug: string;
  type: ProductType;
  title_fr: string;
  title_en: string;
  short_desc_fr: string;
  short_desc_en: string;
  long_desc_fr: string;
  long_desc_en: string;
  why_it_exists_fr: string;
  why_it_exists_en: string;
  price_type: PriceType;
  price_amount?: number;
  cta_label_fr: string;
  cta_label_en: string;
  cta_url: string;
  cover_image_url: string;
  cover_image_en_url?: string;
  tags: string[];
  level: ProductLevel[];
  language: ProductLanguage;
  format: ProductFormat;
  status: ProductStatus;
  audience: ProductAudience;
  collection: ProductCollection;
  page_count?: number;
  author: string;
  isbn?: string;
  benefits_fr: string[];
  benefits_en: string[];
  target_audience_fr: string;
  target_audience_en: string;
  faq?: { question_fr: string; question_en: string; answer_fr: string; answer_en: string }[];
  related_items?: string[]; // slugs of related items
  sort_order: number;
  is_featured: boolean;
  is_new: boolean;
  published_date: string;
}

// ============================================================================
// HELPER: Category definitions for filtering
// ============================================================================

export interface LibraryCategory {
  id: string;
  label_fr: string;
  label_en: string;
  icon: string;
  description_fr: string;
  description_en: string;
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  {
    id: "all",
    label_fr: "Tous les produits",
    label_en: "All Products",
    icon: "Grid3X3",
    description_fr: "Parcourez l'ensemble de notre catalogue",
    description_en: "Browse our complete catalog",
  },
  {
    id: "sle-exam-prep",
    label_fr: "Préparation aux examens SLE",
    label_en: "SLE Exam Preparation",
    icon: "GraduationCap",
    description_fr: "Guides stratégiques pour réussir les examens de langue seconde",
    description_en: "Strategic guides to pass Second Language Evaluation exams",
  },
  {
    id: "coach-professional-development",
    label_fr: "Développement professionnel du coach",
    label_en: "Coach Professional Development",
    icon: "UserCheck",
    description_fr: "Ressources pour les coachs et formateurs en langues",
    description_en: "Resources for language coaches and trainers",
  },
  {
    id: "vocabulaire-professionnel",
    label_fr: "Vocabulaire professionnel",
    label_en: "Professional Vocabulary",
    icon: "BookText",
    description_fr: "Maîtrisez le vocabulaire de la fonction publique canadienne",
    description_en: "Master Canadian public service vocabulary",
  },
  {
    id: "grammar",
    label_fr: "Grammaire",
    label_en: "Grammar",
    icon: "PenTool",
    description_fr: "Ressources grammaticales pour tous les niveaux",
    description_en: "Grammar resources for all levels",
  },
  {
    id: "oral-exam",
    label_fr: "Examen oral",
    label_en: "Oral Exam",
    icon: "Mic",
    description_fr: "Préparation spécifique à l'examen oral SLE",
    description_en: "Specific preparation for the SLE oral exam",
  },
  {
    id: "written-exam",
    label_fr: "Examen écrit",
    label_en: "Written Exam",
    icon: "FileEdit",
    description_fr: "Préparation à l'examen écrit SLE",
    description_en: "Preparation for the SLE written exam",
  },
  {
    id: "reading-comprehension",
    label_fr: "Compréhension en lecture",
    label_en: "Reading Comprehension",
    icon: "BookOpen",
    description_fr: "Préparation à la compréhension en lecture SLE",
    description_en: "Preparation for SLE reading comprehension",
  },
];

// ============================================================================
// SEED DATA — 29 Books (Complete RusingÂcademy Collection)
// ============================================================================

export const LIBRARY_ITEMS: LibraryItem[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Décoder le Niveau C (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-001-fr",
    slug: "decoder-le-niveau-c",
    type: "book",
    title_fr: "Décoder le Niveau C",
    title_en: "Decoding Level C (French Edition)",
    short_desc_fr: "Temps verbaux, lexique professionnel et questions stratégiques pour maîtriser le niveau C à l'examen SLE.",
    short_desc_en: "Verb tenses, professional vocabulary, and strategic questions to master Level C on the SLE exam.",
    long_desc_fr: "Le guide définitif pour maîtriser les compétences linguistiques de niveau C à l'examen SLE. Ce livre couvre en profondeur les temps verbaux avancés, le lexique professionnel de la fonction publique canadienne, et les questions stratégiques qui distinguent les candidats de niveau C. Chaque chapitre est conçu pour transformer vos faiblesses en forces, avec des exercices pratiques et des stratégies éprouvées.",
    long_desc_en: "The definitive guide to mastering Level C linguistic competencies on the SLE exam. This book covers advanced verb tenses, professional vocabulary used in the Canadian public service, and strategic questions that distinguish Level C candidates. Each chapter is designed to transform your weaknesses into strengths, with practical exercises and proven strategies.",
    why_it_exists_fr: "Trop de fonctionnaires échouent au niveau C par manque de préparation ciblée. Ce guide comble cette lacune avec une approche stratégique et structurée.",
    why_it_exists_en: "Too many public servants fail Level C due to lack of targeted preparation. This guide fills that gap with a strategic, structured approach.",
    price_type: "paid",
    price_amount: 29.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/decoder-le-niveau-c",
    cover_image_url: "/images/library/Decoder_Niveau_C_FR.webp",
    cover_image_en_url: "/images/library/Decoding_Level_C_EN.webp",
    tags: ["SLE", "Niveau C", "Level C", "Examen", "Stratégie"],
    level: ["C1", "C2"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "sle-exam-prep",
    author: "Steven Barholere",
    benefits_fr: [
      "Maîtrisez les temps verbaux avancés exigés au niveau C",
      "Développez un lexique professionnel de haut niveau",
      "Apprenez les stratégies pour répondre aux questions complexes",
      "Exercices pratiques avec corrigés détaillés",
      "Approche progressive du niveau B2 au C2",
    ],
    benefits_en: [
      "Master the advanced verb tenses required at Level C",
      "Develop high-level professional vocabulary",
      "Learn strategies for answering complex questions",
      "Practical exercises with detailed answer keys",
      "Progressive approach from B2 to C2 level",
    ],
    target_audience_fr: "Fonctionnaires fédéraux visant le niveau C à l'examen SLE, candidats B2+ souhaitant franchir le cap vers C.",
    target_audience_en: "Federal public servants aiming for Level C on the SLE exam, B2+ candidates looking to reach the C threshold.",
    related_items: ["decoding-level-c-en", "100-pieges-examen-oral-sle", "reussir-examen-oral-sle-guide-definitif"],
    sort_order: 1,
    is_featured: true,
    is_new: false,
    published_date: "2025-01-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Decoding Level C (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-001-en",
    slug: "decoding-level-c-en",
    type: "book",
    title_fr: "Décoder le Niveau C (Édition anglaise)",
    title_en: "Decoding Level C",
    short_desc_fr: "Temps verbaux, lexique professionnel et questions stratégiques — édition anglaise.",
    short_desc_en: "Verb tenses, professional lexicon, and strategic questions to master Level C on the SLE exam.",
    long_desc_fr: "L'édition anglaise du guide définitif pour maîtriser les compétences linguistiques de niveau C à l'examen SLE.",
    long_desc_en: "The definitive guide to mastering Level C linguistic competencies on the SLE exam. Covers advanced verb tenses, professional vocabulary, and strategic questions that distinguish Level C candidates, with practical exercises and proven strategies.",
    why_it_exists_fr: "Pour les anglophones préparant l'examen SLE en français au niveau C.",
    why_it_exists_en: "For English speakers preparing for the SLE exam at Level C.",
    price_type: "paid",
    price_amount: 29.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/decoding-level-c-en",
    cover_image_url: "/images/library/Decoding_Level_C_EN.webp",
    tags: ["SLE", "Level C", "Exam", "Strategy"],
    level: ["C1", "C2"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "sle-exam-prep",
    author: "Steven Barholere",
    benefits_fr: [
      "Maîtrisez les temps verbaux avancés",
      "Développez un lexique professionnel",
      "Stratégies pour les questions complexes",
      "Exercices pratiques avec corrigés",
    ],
    benefits_en: [
      "Master advanced verb tenses required at Level C",
      "Develop high-level professional vocabulary",
      "Learn strategies for complex questions",
      "Practical exercises with detailed answer keys",
    ],
    target_audience_fr: "Fonctionnaires anglophones visant le niveau C.",
    target_audience_en: "English-speaking public servants aiming for Level C on the SLE.",
    related_items: ["decoder-le-niveau-c", "100-pitfalls-sle-oral-exam-en"],
    sort_order: 2,
    is_featured: false,
    is_new: false,
    published_date: "2025-01-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Concevoir l'Évaluation Formative (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-002-fr",
    slug: "concevoir-evaluation-formative",
    type: "book",
    title_fr: "Concevoir l'Évaluation Formative",
    title_en: "Designing Formative Assessment (French Edition)",
    short_desc_fr: "Guide pratique pour concevoir des évaluations formatives efficaces dans le contexte de la formation linguistique SLE.",
    short_desc_en: "Practical guide for designing effective formative assessments in the SLE language training context.",
    long_desc_fr: "Ce guide offre aux coachs et formateurs une méthodologie complète pour concevoir des évaluations formatives qui mesurent réellement les progrès des apprenants. De la conception des critères d'évaluation à l'interprétation des résultats, chaque étape est détaillée avec des exemples concrets tirés du contexte SLE.",
    long_desc_en: "This guide provides coaches and trainers with a complete methodology for designing formative assessments that truly measure learner progress. From designing evaluation criteria to interpreting results, every step is detailed with concrete examples from the SLE context.",
    why_it_exists_fr: "Les coachs ont besoin d'outils d'évaluation fiables pour mesurer les progrès réels de leurs apprenants, au-delà des impressions subjectives.",
    why_it_exists_en: "Coaches need reliable assessment tools to measure real learner progress, beyond subjective impressions.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/concevoir-evaluation-formative",
    cover_image_url: "/images/library/Concevoir_Evaluation_Formative_FR.webp",
    cover_image_en_url: "/images/library/Designing_Formative_Assessment_EN.webp",
    tags: ["Évaluation", "Formative", "Coach", "Pédagogie"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: [
      "Concevez des évaluations alignées sur les niveaux CECR",
      "Mesurez les progrès réels de vos apprenants",
      "Créez des grilles d'évaluation professionnelles",
      "Adaptez vos évaluations aux besoins individuels",
    ],
    benefits_en: [
      "Design assessments aligned with CEFR levels",
      "Measure real learner progress",
      "Create professional evaluation grids",
      "Adapt assessments to individual needs",
    ],
    target_audience_fr: "Coachs linguistiques, formateurs SLE, responsables de programmes de formation.",
    target_audience_en: "Language coaches, SLE trainers, training program managers.",
    related_items: ["designing-formative-assessment-en", "andragogie-appliquee-guide-coach-sle", "classe-heterogene-differencier-enseignement-sle"],
    sort_order: 3,
    is_featured: false,
    is_new: false,
    published_date: "2025-02-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Designing Formative Assessment (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-002-en",
    slug: "designing-formative-assessment-en",
    type: "book",
    title_fr: "Concevoir l'Évaluation Formative (Édition anglaise)",
    title_en: "Designing Formative Assessment",
    short_desc_fr: "Guide pratique pour concevoir des évaluations formatives — édition anglaise.",
    short_desc_en: "Practical guide for designing effective formative assessments in the SLE language training context.",
    long_desc_fr: "L'édition anglaise du guide pour concevoir des évaluations formatives efficaces.",
    long_desc_en: "This guide provides coaches and trainers with a complete methodology for designing formative assessments that truly measure learner progress, with concrete examples from the SLE context.",
    why_it_exists_fr: "Pour les coachs anglophones qui ont besoin d'outils d'évaluation fiables.",
    why_it_exists_en: "For English-speaking coaches who need reliable assessment tools to measure real learner progress.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/designing-formative-assessment-en",
    cover_image_url: "/images/library/Designing_Formative_Assessment_EN.webp",
    tags: ["Assessment", "Formative", "Coach", "Pedagogy"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: ["Concevez des évaluations CECR", "Mesurez les progrès réels", "Grilles d'évaluation professionnelles"],
    benefits_en: ["Design CEFR-aligned assessments", "Measure real progress", "Professional evaluation grids", "Adapt to individual needs"],
    target_audience_fr: "Coachs anglophones et formateurs SLE.",
    target_audience_en: "English-speaking language coaches and SLE trainers.",
    related_items: ["concevoir-evaluation-formative", "applied-andragogy-sle-coachs-guide-en"],
    sort_order: 4,
    is_featured: false,
    is_new: false,
    published_date: "2025-02-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. La Classe Hétérogène (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-003-fr",
    slug: "classe-heterogene-differencier-enseignement-sle",
    type: "book",
    title_fr: "La Classe Hétérogène : Différencier l'Enseignement SLE",
    title_en: "The Heterogeneous Classroom: Differentiating SLE Teaching (French Edition)",
    short_desc_fr: "Stratégies pour gérer et enseigner efficacement dans des classes à niveaux multiples en contexte SLE.",
    short_desc_en: "Strategies for effectively managing and teaching multi-level SLE classes.",
    long_desc_fr: "Comment enseigner efficacement quand vos apprenants ont des niveaux A1 à C1 dans la même classe ? Ce guide offre des stratégies concrètes de différenciation pédagogique adaptées au contexte de la formation linguistique dans la fonction publique canadienne. Apprenez à créer des activités multi-niveaux, à gérer le rythme d'apprentissage, et à maintenir l'engagement de tous.",
    long_desc_en: "How to teach effectively when your learners range from A1 to C1 in the same class? This guide offers concrete differentiation strategies adapted to language training in the Canadian public service. Learn to create multi-level activities, manage learning pace, and maintain everyone's engagement.",
    why_it_exists_fr: "La réalité des classes SLE est l'hétérogénéité. Ce guide donne aux coachs les outils pour transformer ce défi en opportunité.",
    why_it_exists_en: "The reality of SLE classes is heterogeneity. This guide gives coaches the tools to turn this challenge into an opportunity.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/classe-heterogene-differencier-enseignement-sle",
    cover_image_url: "/images/library/Classe_Heterogene_Differencier_Enseignement_SLE_FR.webp",
    cover_image_en_url: "/images/library/Heterogeneous_Classroom_Differentiating_SLE_EN.webp",
    tags: ["Différenciation", "Classe hétérogène", "Coach", "Pédagogie"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: [
      "Stratégies de différenciation pédagogique éprouvées",
      "Activités multi-niveaux prêtes à l'emploi",
      "Gestion du rythme d'apprentissage",
      "Techniques d'engagement pour tous les niveaux",
    ],
    benefits_en: [
      "Proven differentiation strategies",
      "Ready-to-use multi-level activities",
      "Learning pace management",
      "Engagement techniques for all levels",
    ],
    target_audience_fr: "Coachs SLE, formateurs en langues, responsables de formation.",
    target_audience_en: "SLE coaches, language trainers, training managers.",
    related_items: ["heterogeneous-classroom-differentiating-sle-en", "concevoir-evaluation-formative", "andragogie-appliquee-guide-coach-sle"],
    sort_order: 5,
    is_featured: false,
    is_new: false,
    published_date: "2025-02-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Heterogeneous Classroom (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-003-en",
    slug: "heterogeneous-classroom-differentiating-sle-en",
    type: "book",
    title_fr: "La Classe Hétérogène (Édition anglaise)",
    title_en: "The Heterogeneous Classroom: Differentiating SLE Teaching",
    short_desc_fr: "Stratégies de différenciation pédagogique — édition anglaise.",
    short_desc_en: "Strategies for effectively managing and teaching multi-level SLE classes.",
    long_desc_fr: "L'édition anglaise du guide de différenciation pédagogique pour les classes SLE hétérogènes.",
    long_desc_en: "How to teach effectively when your learners range from A1 to C1 in the same class? Concrete differentiation strategies adapted to language training in the Canadian public service.",
    why_it_exists_fr: "Pour les coachs anglophones confrontés à des classes multi-niveaux.",
    why_it_exists_en: "For English-speaking coaches facing multi-level classes in SLE training.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/heterogeneous-classroom-differentiating-sle-en",
    cover_image_url: "/images/library/Heterogeneous_Classroom_Differentiating_SLE_EN.webp",
    tags: ["Differentiation", "Heterogeneous", "Coach", "Pedagogy"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: ["Stratégies de différenciation", "Activités multi-niveaux", "Gestion du rythme"],
    benefits_en: ["Proven differentiation strategies", "Ready-to-use multi-level activities", "Learning pace management"],
    target_audience_fr: "Coachs anglophones et formateurs SLE.",
    target_audience_en: "English-speaking SLE coaches and language trainers.",
    related_items: ["classe-heterogene-differencier-enseignement-sle", "designing-formative-assessment-en"],
    sort_order: 6,
    is_featured: false,
    is_new: false,
    published_date: "2025-02-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Andragogie Appliquée (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-004-fr",
    slug: "andragogie-appliquee-guide-coach-sle",
    type: "book",
    title_fr: "Andragogie Appliquée : Guide du Coach SLE",
    title_en: "Applied Andragogy: SLE Coach's Guide (French Edition)",
    short_desc_fr: "Principes andragogiques appliqués au coaching linguistique pour adultes dans le contexte de la fonction publique.",
    short_desc_en: "Andragogical principles applied to adult language coaching in the public service context.",
    long_desc_fr: "L'andragogie — la science de l'enseignement aux adultes — est la clé d'un coaching linguistique efficace. Ce guide traduit les principes théoriques en pratiques concrètes pour le coach SLE : comment motiver des adultes professionnels, adapter le contenu à leur réalité, et créer des expériences d'apprentissage qui respectent leur autonomie et leur expérience.",
    long_desc_en: "Andragogy — the science of teaching adults — is the key to effective language coaching. This guide translates theoretical principles into concrete practices for the SLE coach: how to motivate professional adults, adapt content to their reality, and create learning experiences that respect their autonomy and experience.",
    why_it_exists_fr: "Les adultes n'apprennent pas comme les enfants. Ce guide donne aux coachs les outils spécifiques pour l'enseignement aux adultes professionnels.",
    why_it_exists_en: "Adults don't learn like children. This guide gives coaches the specific tools for teaching professional adults.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/andragogie-appliquee-guide-coach-sle",
    cover_image_url: "/images/library/Andragogie_Appliquee_Guide_Coach_SLE_FR.webp",
    cover_image_en_url: "/images/library/Applied_Andragogy_SLE_Coachs_Guide_EN.webp",
    tags: ["Andragogie", "Coach", "Adultes", "Pédagogie"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: [
      "Comprenez les principes fondamentaux de l'andragogie",
      "Adaptez votre coaching aux besoins des adultes",
      "Créez des expériences d'apprentissage motivantes",
      "Techniques de facilitation pour professionnels",
    ],
    benefits_en: [
      "Understand fundamental andragogical principles",
      "Adapt your coaching to adult needs",
      "Create motivating learning experiences",
      "Facilitation techniques for professionals",
    ],
    target_audience_fr: "Coachs SLE, formateurs en langues, nouveaux coachs.",
    target_audience_en: "SLE coaches, language trainers, new coaches.",
    related_items: ["applied-andragogy-sle-coachs-guide-en", "concevoir-evaluation-formative", "art-de-la-correction-strategies-erreurs"],
    sort_order: 7,
    is_featured: false,
    is_new: false,
    published_date: "2025-03-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Applied Andragogy (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-004-en",
    slug: "applied-andragogy-sle-coachs-guide-en",
    type: "book",
    title_fr: "Andragogie Appliquée (Édition anglaise)",
    title_en: "Applied Andragogy: SLE Coach's Guide",
    short_desc_fr: "Principes andragogiques pour le coaching SLE — édition anglaise.",
    short_desc_en: "Andragogical principles applied to adult language coaching in the public service context.",
    long_desc_fr: "L'édition anglaise du guide d'andragogie appliquée au coaching SLE.",
    long_desc_en: "Andragogy — the science of teaching adults — is the key to effective language coaching. This guide translates theoretical principles into concrete practices for the SLE coach.",
    why_it_exists_fr: "Pour les coachs anglophones souhaitant maîtriser l'andragogie.",
    why_it_exists_en: "For English-speaking coaches wanting to master andragogy in SLE coaching.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/applied-andragogy-sle-coachs-guide-en",
    cover_image_url: "/images/library/Applied_Andragogy_SLE_Coachs_Guide_EN.webp",
    tags: ["Andragogy", "Coach", "Adults", "Pedagogy"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: ["Principes andragogiques", "Coaching adapté aux adultes", "Techniques de facilitation"],
    benefits_en: ["Fundamental andragogical principles", "Adult-adapted coaching", "Facilitation techniques for professionals"],
    target_audience_fr: "Coachs anglophones et formateurs SLE.",
    target_audience_en: "English-speaking SLE coaches and language trainers.",
    related_items: ["andragogie-appliquee-guide-coach-sle", "designing-formative-assessment-en"],
    sort_order: 8,
    is_featured: false,
    is_new: false,
    published_date: "2025-03-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 9. L'Art de la Correction (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-005-fr",
    slug: "art-de-la-correction-strategies-erreurs",
    type: "book",
    title_fr: "L'Art de la Correction : Stratégies face aux Erreurs",
    title_en: "The Art of Correction: Error Strategies (French Edition)",
    short_desc_fr: "Techniques de correction efficaces et bienveillantes pour les coachs linguistiques SLE.",
    short_desc_en: "Effective and supportive correction techniques for SLE language coaches.",
    long_desc_fr: "Comment corriger sans décourager ? Ce guide explore les stratégies de correction les plus efficaces pour le coaching linguistique : correction immédiate vs différée, techniques de reformulation, feedback constructif, et gestion de l'erreur comme outil d'apprentissage. Un indispensable pour tout coach qui veut maximiser les progrès de ses apprenants.",
    long_desc_en: "How to correct without discouraging? This guide explores the most effective correction strategies for language coaching: immediate vs. deferred correction, reformulation techniques, constructive feedback, and error management as a learning tool.",
    why_it_exists_fr: "La correction est l'un des actes pédagogiques les plus délicats. Ce guide transforme cet art en science accessible.",
    why_it_exists_en: "Correction is one of the most delicate pedagogical acts. This guide turns this art into accessible science.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/art-de-la-correction-strategies-erreurs",
    cover_image_url: "/images/library/Art_de_la_Correction_Strategies_Erreurs_FR.webp",
    cover_image_en_url: "/images/library/Art_of_Correction_Error_Strategies_EN.webp",
    tags: ["Correction", "Erreurs", "Coach", "Feedback"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: [
      "Maîtrisez les techniques de correction bienveillante",
      "Transformez les erreurs en opportunités d'apprentissage",
      "Feedback constructif et motivant",
      "Stratégies adaptées à chaque niveau",
    ],
    benefits_en: [
      "Master supportive correction techniques",
      "Turn errors into learning opportunities",
      "Constructive and motivating feedback",
      "Strategies adapted to each level",
    ],
    target_audience_fr: "Coachs SLE, formateurs, tuteurs en langues.",
    target_audience_en: "SLE coaches, trainers, language tutors.",
    related_items: ["art-of-correction-error-strategies-en", "andragogie-appliquee-guide-coach-sle"],
    sort_order: 9,
    is_featured: false,
    is_new: false,
    published_date: "2025-03-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10. Art of Correction (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-005-en",
    slug: "art-of-correction-error-strategies-en",
    type: "book",
    title_fr: "L'Art de la Correction (Édition anglaise)",
    title_en: "The Art of Correction: Error Strategies",
    short_desc_fr: "Techniques de correction pour coachs — édition anglaise.",
    short_desc_en: "Effective and supportive correction techniques for SLE language coaches.",
    long_desc_fr: "L'édition anglaise du guide sur les stratégies de correction pour coachs linguistiques.",
    long_desc_en: "How to correct without discouraging? This guide explores the most effective correction strategies for language coaching: immediate vs. deferred correction, reformulation techniques, constructive feedback, and error management as a learning tool.",
    why_it_exists_fr: "Pour les coachs anglophones cherchant à perfectionner leurs techniques de correction.",
    why_it_exists_en: "For English-speaking coaches looking to perfect their correction techniques.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/art-of-correction-error-strategies-en",
    cover_image_url: "/images/library/Art_of_Correction_Error_Strategies_EN.webp",
    tags: ["Correction", "Errors", "Coach", "Feedback"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: ["Techniques de correction", "Feedback constructif", "Gestion des erreurs"],
    benefits_en: ["Supportive correction techniques", "Constructive feedback", "Error management as learning tool"],
    target_audience_fr: "Coachs anglophones et formateurs.",
    target_audience_en: "English-speaking SLE coaches and trainers.",
    related_items: ["art-de-la-correction-strategies-erreurs", "applied-andragogy-sle-coachs-guide-en"],
    sort_order: 10,
    is_featured: false,
    is_new: false,
    published_date: "2025-03-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 11. Le Coach Augmenté (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-006-fr",
    slug: "coach-augmente-ia-technologie-sle",
    type: "book",
    title_fr: "Le Coach Augmenté : IA & Technologie pour le SLE",
    title_en: "The Augmented Coach: AI & Technology for SLE (French Edition)",
    short_desc_fr: "Comment intégrer l'intelligence artificielle et les technologies dans votre pratique de coaching SLE.",
    short_desc_en: "How to integrate AI and technology into your SLE coaching practice.",
    long_desc_fr: "L'IA transforme le coaching linguistique. Ce guide montre comment utiliser les outils technologiques — de l'IA générative aux plateformes d'apprentissage — pour augmenter votre efficacité comme coach SLE. Découvrez comment créer du contenu personnalisé, automatiser les tâches répétitives, et offrir une expérience d'apprentissage enrichie à vos apprenants.",
    long_desc_en: "AI is transforming language coaching. This guide shows how to use technological tools — from generative AI to learning platforms — to enhance your effectiveness as an SLE coach.",
    why_it_exists_fr: "La technologie évolue rapidement. Ce guide aide les coachs à rester à la pointe sans perdre l'humain.",
    why_it_exists_en: "Technology evolves rapidly. This guide helps coaches stay cutting-edge without losing the human touch.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/coach-augmente-ia-technologie-sle",
    cover_image_url: "/images/library/Coach_Augmente_IA_Technologie_SLE_FR.webp",
    cover_image_en_url: "/images/library/Augmented_Coach_AI_Technology_SLE_EN.webp",
    tags: ["IA", "Technologie", "Coach", "Innovation"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: [
      "Intégrez l'IA dans votre pratique de coaching",
      "Créez du contenu personnalisé avec l'IA",
      "Automatisez les tâches répétitives",
      "Restez à la pointe de l'innovation pédagogique",
    ],
    benefits_en: [
      "Integrate AI into your coaching practice",
      "Create personalized content with AI",
      "Automate repetitive tasks",
      "Stay at the forefront of pedagogical innovation",
    ],
    target_audience_fr: "Coachs SLE, formateurs, responsables de formation cherchant à moderniser leur pratique.",
    target_audience_en: "SLE coaches, trainers, training managers looking to modernize their practice.",
    related_items: ["augmented-coach-ai-technology-sle-en", "guide-affaires-coach-sle-independant"],
    sort_order: 11,
    is_featured: true,
    is_new: true,
    published_date: "2025-04-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 12. Augmented Coach (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-006-en",
    slug: "augmented-coach-ai-technology-sle-en",
    type: "book",
    title_fr: "Le Coach Augmenté (Édition anglaise)",
    title_en: "The Augmented Coach: AI & Technology for SLE",
    short_desc_fr: "IA et technologie pour le coaching SLE — édition anglaise.",
    short_desc_en: "How to integrate AI and technology into your SLE coaching practice.",
    long_desc_fr: "L'édition anglaise du guide sur l'IA et la technologie pour le coaching SLE.",
    long_desc_en: "AI is transforming language coaching. This guide shows how to use technological tools — from generative AI to learning platforms — to enhance your effectiveness as an SLE coach.",
    why_it_exists_fr: "Pour les coachs anglophones souhaitant intégrer l'IA dans leur pratique.",
    why_it_exists_en: "For English-speaking coaches wanting to integrate AI into their coaching practice.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/augmented-coach-ai-technology-sle-en",
    cover_image_url: "/images/library/Augmented_Coach_AI_Technology_SLE_EN.webp",
    tags: ["AI", "Technology", "Coach", "Innovation"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: ["Intégration IA", "Contenu personnalisé", "Innovation pédagogique"],
    benefits_en: ["AI integration in coaching", "Personalized content creation", "Pedagogical innovation"],
    target_audience_fr: "Coachs anglophones et formateurs.",
    target_audience_en: "English-speaking SLE coaches and trainers.",
    related_items: ["coach-augmente-ia-technologie-sle", "business-guide-independent-sle-coach-en"],
    sort_order: 12,
    is_featured: false,
    is_new: true,
    published_date: "2025-04-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 13. Guide d'Affaires Coach SLE (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-007-fr",
    slug: "guide-affaires-coach-sle-independant",
    type: "book",
    title_fr: "Guide d'Affaires du Coach SLE Indépendant",
    title_en: "Business Guide for the Independent SLE Coach (French Edition)",
    short_desc_fr: "Tout ce qu'il faut savoir pour lancer et développer votre activité de coaching SLE indépendant.",
    short_desc_en: "Everything you need to know to launch and grow your independent SLE coaching business.",
    long_desc_fr: "Vous êtes coach linguistique et vous rêvez d'indépendance ? Ce guide couvre tous les aspects business du coaching SLE : structuration juridique, tarification, marketing, acquisition de clients, gestion administrative, et développement de votre marque personnelle. Un plan d'affaires complet pour transformer votre expertise en entreprise rentable.",
    long_desc_en: "Are you a language coach dreaming of independence? This guide covers all business aspects of SLE coaching: legal structure, pricing, marketing, client acquisition, administrative management, and personal brand development.",
    why_it_exists_fr: "Être un excellent coach ne suffit pas — il faut aussi savoir gérer une entreprise. Ce guide comble le fossé entre expertise pédagogique et réussite entrepreneuriale.",
    why_it_exists_en: "Being an excellent coach isn't enough — you also need to know how to run a business. This guide bridges the gap between pedagogical expertise and entrepreneurial success.",
    price_type: "paid",
    price_amount: 29.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/guide-affaires-coach-sle-independant",
    cover_image_url: "/images/library/Guide_Affaires_Coach_SLE_Independant_FR.webp",
    cover_image_en_url: "/images/library/Business_Guide_Independent_SLE_Coach_EN.webp",
    tags: ["Business", "Entrepreneuriat", "Coach", "Indépendant"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: [
      "Plan d'affaires complet pour coach SLE",
      "Stratégies de tarification et marketing",
      "Acquisition et fidélisation de clients",
      "Développement de marque personnelle",
    ],
    benefits_en: [
      "Complete business plan for SLE coach",
      "Pricing and marketing strategies",
      "Client acquisition and retention",
      "Personal brand development",
    ],
    target_audience_fr: "Coachs SLE souhaitant se lancer en indépendant, formateurs en transition.",
    target_audience_en: "SLE coaches wanting to go independent, trainers in transition.",
    related_items: ["business-guide-independent-sle-coach-en", "coach-augmente-ia-technologie-sle"],
    sort_order: 13,
    is_featured: false,
    is_new: false,
    published_date: "2025-04-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 14. Business Guide Independent SLE Coach (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-007-en",
    slug: "business-guide-independent-sle-coach-en",
    type: "book",
    title_fr: "Guide d'Affaires du Coach SLE (Édition anglaise)",
    title_en: "Business Guide for the Independent SLE Coach",
    short_desc_fr: "Guide d'affaires pour coach SLE indépendant — édition anglaise.",
    short_desc_en: "Everything you need to know to launch and grow your independent SLE coaching business.",
    long_desc_fr: "L'édition anglaise du guide d'affaires pour le coach SLE indépendant.",
    long_desc_en: "Are you a language coach dreaming of independence? This guide covers all business aspects of SLE coaching: legal structure, pricing, marketing, client acquisition, and personal brand development.",
    why_it_exists_fr: "Pour les coachs anglophones souhaitant lancer leur entreprise de coaching.",
    why_it_exists_en: "For English-speaking coaches wanting to launch their coaching business.",
    price_type: "paid",
    price_amount: 29.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/business-guide-independent-sle-coach-en",
    cover_image_url: "/images/library/Business_Guide_Independent_SLE_Coach_EN.webp",
    tags: ["Business", "Entrepreneurship", "Coach", "Independent"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "coach",
    collection: "coach-professional-development",
    author: "Steven Barholere",
    benefits_fr: ["Plan d'affaires", "Marketing", "Acquisition clients"],
    benefits_en: ["Complete business plan", "Marketing strategies", "Client acquisition and retention"],
    target_audience_fr: "Coachs anglophones souhaitant se lancer en indépendant.",
    target_audience_en: "English-speaking SLE coaches wanting to go independent.",
    related_items: ["guide-affaires-coach-sle-independant", "augmented-coach-ai-technology-sle-en"],
    sort_order: 14,
    is_featured: false,
    is_new: false,
    published_date: "2025-04-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 15. Vaincre l'Anxiété Linguistique (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-008-fr",
    slug: "vaincre-anxiete-linguistique",
    type: "book",
    title_fr: "Vaincre l'Anxiété Linguistique",
    title_en: "Overcoming Language Anxiety (French Edition)",
    short_desc_fr: "Stratégies pour surmonter l'anxiété linguistique et gagner en confiance dans votre langue seconde.",
    short_desc_en: "Strategies to overcome language anxiety and gain confidence in your second language.",
    long_desc_fr: "L'anxiété linguistique est le plus grand obstacle invisible à la réussite aux examens SLE. Ce guide offre des stratégies concrètes, basées sur la recherche, pour identifier, comprendre et surmonter cette anxiété. Des techniques de gestion du stress aux exercices de confiance, en passant par la préparation mentale, ce livre transforme votre relation avec votre langue seconde.",
    long_desc_en: "Language anxiety is the biggest invisible obstacle to SLE exam success. This guide offers concrete, research-based strategies to identify, understand, and overcome this anxiety.",
    why_it_exists_fr: "L'anxiété linguistique bloque des milliers de fonctionnaires talentueux. Ce guide leur donne les outils pour la surmonter.",
    why_it_exists_en: "Language anxiety blocks thousands of talented public servants. This guide gives them the tools to overcome it.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/vaincre-anxiete-linguistique",
    cover_image_url: "/images/library/Vaincre_Anxiete_Linguistique_FR.webp",
    cover_image_en_url: "/images/library/Overcoming_Language_Anxiety_EN.webp",
    tags: ["Anxiété", "Confiance", "Bien-être", "SLE"],
    level: ["ALL"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "both",
    collection: "sle-exam-prep",
    author: "Steven Barholere",
    benefits_fr: [
      "Identifiez les sources de votre anxiété linguistique",
      "Techniques de gestion du stress éprouvées",
      "Exercices de confiance progressifs",
      "Préparation mentale pour les examens",
    ],
    benefits_en: [
      "Identify the sources of your language anxiety",
      "Proven stress management techniques",
      "Progressive confidence-building exercises",
      "Mental preparation for exams",
    ],
    target_audience_fr: "Fonctionnaires anxieux face aux examens SLE, apprenants manquant de confiance.",
    target_audience_en: "Public servants anxious about SLE exams, learners lacking confidence.",
    related_items: ["overcoming-language-anxiety-en", "decoder-le-niveau-c"],
    sort_order: 15,
    is_featured: true,
    is_new: false,
    published_date: "2025-05-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 16. Overcoming Language Anxiety (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-008-en",
    slug: "overcoming-language-anxiety-en",
    type: "book",
    title_fr: "Vaincre l'Anxiété Linguistique (Édition anglaise)",
    title_en: "Overcoming Language Anxiety",
    short_desc_fr: "Surmonter l'anxiété linguistique — édition anglaise.",
    short_desc_en: "Strategies to overcome language anxiety and gain confidence in your second language.",
    long_desc_fr: "L'édition anglaise du guide pour surmonter l'anxiété linguistique.",
    long_desc_en: "Language anxiety is the biggest invisible obstacle to SLE exam success. This guide offers concrete, research-based strategies to identify, understand, and overcome this anxiety.",
    why_it_exists_fr: "Pour les anglophones confrontés à l'anxiété linguistique.",
    why_it_exists_en: "For English speakers facing language anxiety in their SLE preparation.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/overcoming-language-anxiety-en",
    cover_image_url: "/images/library/Overcoming_Language_Anxiety_EN.webp",
    tags: ["Anxiety", "Confidence", "Wellbeing", "SLE"],
    level: ["ALL"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "both",
    collection: "sle-exam-prep",
    author: "Steven Barholere",
    benefits_fr: ["Gestion du stress", "Exercices de confiance", "Préparation mentale"],
    benefits_en: ["Stress management techniques", "Confidence-building exercises", "Mental preparation for exams"],
    target_audience_fr: "Fonctionnaires anglophones anxieux face aux examens SLE.",
    target_audience_en: "English-speaking public servants anxious about SLE exams.",
    related_items: ["vaincre-anxiete-linguistique", "decoding-level-c-en"],
    sort_order: 16,
    is_featured: false,
    is_new: false,
    published_date: "2025-05-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 17. Les 100 Pièges de l'Examen Oral SLE (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-009-fr",
    slug: "100-pieges-examen-oral-sle",
    type: "book",
    title_fr: "Les 100 Pièges de l'Examen Oral SLE",
    title_en: "The 100 Pitfalls of the SLE Oral Exam (French Edition)",
    short_desc_fr: "Le guide pratique indispensable : identifiez et évitez les 100 pièges les plus courants de l'examen oral SLE.",
    short_desc_en: "The essential practical guide: identify and avoid the 100 most common pitfalls of the SLE oral exam.",
    long_desc_fr: "Quels sont les pièges qui font échouer les candidats à l'examen oral SLE ? Ce guide identifie les 100 erreurs les plus fréquentes — des faux amis aux structures grammaticales trompeuses, en passant par les pièges de prononciation et les erreurs de registre — et vous donne les stratégies pour les éviter. Un outil indispensable pour votre préparation.",
    long_desc_en: "What are the pitfalls that cause candidates to fail the SLE oral exam? This guide identifies the 100 most common errors and gives you strategies to avoid them.",
    why_it_exists_fr: "Les mêmes erreurs font échouer des candidats année après année. Ce guide les identifie toutes pour que vous ne tombiez pas dans ces pièges.",
    why_it_exists_en: "The same mistakes cause candidates to fail year after year. This guide identifies them all so you don't fall into these traps.",
    price_type: "paid",
    price_amount: 19.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/100-pieges-examen-oral-sle",
    cover_image_url: "/images/library/100_Pieges_Examen_Oral_SLE_FR.webp",
    cover_image_en_url: "/images/library/100_Pitfalls_SLE_Oral_Exam_EN.webp",
    tags: ["Pièges", "Examen oral", "SLE", "Erreurs courantes"],
    level: ["B1", "B2", "C1"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "oral-exam",
    author: "Steven Barholere",
    benefits_fr: [
      "Identifiez les 100 pièges les plus courants",
      "Stratégies d'évitement pour chaque piège",
      "Exemples concrets tirés d'examens réels",
      "Classement par catégorie et niveau de difficulté",
    ],
    benefits_en: [
      "Identify the 100 most common pitfalls",
      "Avoidance strategies for each pitfall",
      "Concrete examples from real exams",
      "Categorized by type and difficulty level",
    ],
    target_audience_fr: "Candidats préparant l'examen oral SLE, niveaux B et C.",
    target_audience_en: "Candidates preparing for the SLE oral exam, levels B and C.",
    related_items: ["100-pitfalls-sle-oral-exam-en", "reussir-examen-oral-sle-guide-definitif", "banque-1000-questions-sle-oral"],
    sort_order: 17,
    is_featured: true,
    is_new: false,
    published_date: "2025-06-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 18. 100 Pitfalls SLE Oral Exam (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-009-en",
    slug: "100-pitfalls-sle-oral-exam-en",
    type: "book",
    title_fr: "Les 100 Pièges de l'Examen Oral SLE (Édition anglaise)",
    title_en: "The 100 Pitfalls of the SLE Oral Exam",
    short_desc_fr: "Les 100 pièges de l'examen oral SLE — édition anglaise.",
    short_desc_en: "The essential practical guide: identify and avoid the 100 most common pitfalls of the SLE oral exam.",
    long_desc_fr: "L'édition anglaise du guide des 100 pièges de l'examen oral SLE.",
    long_desc_en: "What are the pitfalls that cause candidates to fail the SLE oral exam? This guide identifies the 100 most common errors and gives you strategies to avoid them.",
    why_it_exists_fr: "Pour les anglophones préparant l'examen oral SLE.",
    why_it_exists_en: "For English speakers preparing for the SLE oral exam.",
    price_type: "paid",
    price_amount: 19.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/100-pitfalls-sle-oral-exam-en",
    cover_image_url: "/images/library/100_Pitfalls_SLE_Oral_Exam_EN.webp",
    tags: ["Pitfalls", "Oral Exam", "SLE", "Common Errors"],
    level: ["B1", "B2", "C1"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "oral-exam",
    author: "Steven Barholere",
    benefits_fr: ["100 pièges identifiés", "Stratégies d'évitement", "Exemples concrets"],
    benefits_en: ["100 pitfalls identified", "Avoidance strategies", "Concrete examples from real exams"],
    target_audience_fr: "Candidats anglophones préparant l'examen oral SLE.",
    target_audience_en: "English-speaking candidates preparing for the SLE oral exam.",
    related_items: ["100-pieges-examen-oral-sle", "passing-sle-oral-exam-definitive-guide-bilingual"],
    sort_order: 18,
    is_featured: false,
    is_new: false,
    published_date: "2025-06-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 19. Banque de 1000 Questions SLE Oral
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-010",
    slug: "banque-1000-questions-sle-oral",
    type: "book",
    title_fr: "Banque de 1000 Questions SLE Oral",
    title_en: "1000 SLE Oral Questions Bank",
    short_desc_fr: "La banque la plus complète de questions pour préparer l'examen oral SLE — 1000 questions organisées par thème et niveau.",
    short_desc_en: "The most comprehensive question bank for SLE oral exam preparation — 1,000 questions organized by theme and level.",
    long_desc_fr: "Préparez-vous avec la banque de questions la plus exhaustive jamais créée pour l'examen oral SLE. 1000 questions organisées par thème (travail, politique, société, culture) et par niveau (B, C), avec des pistes de réponse et des conseils stratégiques. L'outil ultime pour ne jamais être pris au dépourvu le jour de l'examen.",
    long_desc_en: "Prepare with the most exhaustive question bank ever created for the SLE oral exam. 1,000 questions organized by theme and level, with answer guidelines and strategic tips.",
    why_it_exists_fr: "La meilleure préparation est la pratique. Cette banque de 1000 questions vous assure de couvrir tous les sujets possibles.",
    why_it_exists_en: "The best preparation is practice. This 1,000-question bank ensures you cover every possible topic.",
    price_type: "paid",
    price_amount: 34.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/banque-1000-questions-sle-oral",
    cover_image_url: "/images/library/Banque_1000_Questions_SLE_Oral_RusingAcademy.webp",
    tags: ["Questions", "Examen oral", "SLE", "Pratique", "1000"],
    level: ["B1", "B2", "C1", "C2"],
    language: "BILINGUAL",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "oral-exam",
    author: "Steven Barholere",
    benefits_fr: [
      "1000 questions couvrant tous les thèmes de l'examen",
      "Organisées par niveau (B et C) et par thème",
      "Pistes de réponse et conseils stratégiques",
      "Outil de pratique quotidienne",
    ],
    benefits_en: [
      "1,000 questions covering all exam themes",
      "Organized by level (B and C) and theme",
      "Answer guidelines and strategic tips",
      "Daily practice tool",
    ],
    target_audience_fr: "Tous les candidats préparant l'examen oral SLE.",
    target_audience_en: "All candidates preparing for the SLE oral exam.",
    related_items: ["100-pieges-examen-oral-sle", "reussir-examen-oral-sle-guide-definitif", "passing-sle-oral-exam-definitive-guide-bilingual"],
    sort_order: 19,
    is_featured: true,
    is_new: true,
    published_date: "2025-07-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 20. Réussir l'Examen Oral SLE Guide Définitif (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-011-fr",
    slug: "reussir-examen-oral-sle-guide-definitif",
    type: "book",
    title_fr: "Réussir l'Examen Oral SLE : Le Guide Définitif",
    title_en: "Passing the SLE Oral Exam: The Definitive Guide (French Edition)",
    short_desc_fr: "Le guide complet et définitif pour réussir l'examen oral SLE — stratégies, techniques et préparation.",
    short_desc_en: "The complete and definitive guide to passing the SLE oral exam — strategies, techniques, and preparation.",
    long_desc_fr: "Ce guide définitif couvre chaque aspect de l'examen oral SLE : format de l'examen, critères d'évaluation, stratégies de réponse, gestion du temps, techniques de communication orale, et préparation mentale. Avec des exemples concrets, des simulations d'examen, et des conseils d'experts, c'est votre compagnon ultime pour réussir.",
    long_desc_en: "This definitive guide covers every aspect of the SLE oral exam: exam format, evaluation criteria, response strategies, time management, oral communication techniques, and mental preparation.",
    why_it_exists_fr: "L'examen oral SLE est le plus redouté. Ce guide définitif élimine l'incertitude et vous prépare à chaque scénario possible.",
    why_it_exists_en: "The SLE oral exam is the most feared. This definitive guide eliminates uncertainty and prepares you for every possible scenario.",
    price_type: "paid",
    price_amount: 29.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/reussir-examen-oral-sle-guide-definitif",
    cover_image_url: "/images/library/Reussir_Examen_Oral_SLE_Guide_Definitif_RusingAcademy_FR.webp",
    cover_image_en_url: "/images/library/Passing_SLE_Oral_Exam_Definitive_Guide_RusingAcademy_BILINGUAL.webp",
    tags: ["Examen oral", "SLE", "Guide définitif", "Stratégie"],
    level: ["B1", "B2", "C1", "C2"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "oral-exam",
    author: "Steven Barholere",
    benefits_fr: [
      "Comprenez le format et les critères de l'examen",
      "Stratégies de réponse éprouvées",
      "Simulations d'examen avec corrigés",
      "Préparation mentale et gestion du stress",
    ],
    benefits_en: [
      "Understand the exam format and criteria",
      "Proven response strategies",
      "Exam simulations with answer keys",
      "Mental preparation and stress management",
    ],
    target_audience_fr: "Tous les candidats préparant l'examen oral SLE.",
    target_audience_en: "All candidates preparing for the SLE oral exam.",
    related_items: ["passing-sle-oral-exam-definitive-guide-bilingual", "100-pieges-examen-oral-sle", "banque-1000-questions-sle-oral"],
    sort_order: 20,
    is_featured: true,
    is_new: false,
    published_date: "2025-07-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 21. Passing SLE Oral Exam Definitive Guide (BILINGUAL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-011-bi",
    slug: "passing-sle-oral-exam-definitive-guide-bilingual",
    type: "book",
    title_fr: "Réussir l'Examen Oral SLE (Édition bilingue)",
    title_en: "Passing the SLE Oral Exam: The Definitive Guide",
    short_desc_fr: "Le guide définitif pour l'examen oral SLE — édition bilingue.",
    short_desc_en: "The complete and definitive guide to passing the SLE oral exam — bilingual edition.",
    long_desc_fr: "L'édition bilingue du guide définitif pour réussir l'examen oral SLE.",
    long_desc_en: "This bilingual definitive guide covers every aspect of the SLE oral exam: exam format, evaluation criteria, response strategies, time management, and mental preparation.",
    why_it_exists_fr: "Pour les candidats qui préfèrent une édition bilingue complète.",
    why_it_exists_en: "For candidates who prefer a complete bilingual edition.",
    price_type: "paid",
    price_amount: 29.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/passing-sle-oral-exam-definitive-guide-bilingual",
    cover_image_url: "/images/library/Passing_SLE_Oral_Exam_Definitive_Guide_RusingAcademy_BILINGUAL.webp",
    tags: ["Oral Exam", "SLE", "Definitive Guide", "Bilingual"],
    level: ["B1", "B2", "C1", "C2"],
    language: "BILINGUAL",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "oral-exam",
    author: "Steven Barholere",
    benefits_fr: ["Guide complet bilingue", "Stratégies de réponse", "Simulations d'examen"],
    benefits_en: ["Complete bilingual guide", "Response strategies", "Exam simulations with answer keys"],
    target_audience_fr: "Candidats bilingues préparant l'examen oral SLE.",
    target_audience_en: "Bilingual candidates preparing for the SLE oral exam.",
    related_items: ["reussir-examen-oral-sle-guide-definitif", "100-pitfalls-sle-oral-exam-en", "banque-1000-questions-sle-oral"],
    sort_order: 21,
    is_featured: false,
    is_new: false,
    published_date: "2025-07-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 22. Réussir la Compréhension en Lecture SLE (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-012-fr",
    slug: "reussir-comprehension-lecture-sle",
    type: "book",
    title_fr: "Réussir la Compréhension en Lecture SLE",
    title_en: "Pass the SLE Reading Comprehension (French Edition)",
    short_desc_fr: "Stratégies et techniques pour réussir l'épreuve de compréhension en lecture de l'examen SLE.",
    short_desc_en: "Strategies and techniques to pass the SLE reading comprehension test.",
    long_desc_fr: "L'épreuve de compréhension en lecture SLE exige des compétences spécifiques. Ce guide vous enseigne les techniques de lecture rapide, l'identification des idées principales, la compréhension des nuances, et les stratégies pour répondre efficacement aux questions à choix multiples. Avec des exercices pratiques et des textes d'entraînement.",
    long_desc_en: "The SLE reading comprehension test requires specific skills. This guide teaches speed reading techniques, main idea identification, nuance comprehension, and strategies for effectively answering multiple-choice questions.",
    why_it_exists_fr: "La compréhension en lecture est souvent sous-estimée. Ce guide donne les stratégies spécifiques pour cette épreuve.",
    why_it_exists_en: "Reading comprehension is often underestimated. This guide provides specific strategies for this test.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/reussir-comprehension-lecture-sle",
    cover_image_url: "/images/library/Reussir_Comprehension_Lecture_SLE_FR.webp",
    cover_image_en_url: "/images/library/Pass_SLE_Reading_Comprehension_EN.webp",
    tags: ["Compréhension", "Lecture", "SLE", "Examen"],
    level: ["B1", "B2", "C1"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "reading-comprehension",
    author: "Steven Barholere",
    benefits_fr: [
      "Techniques de lecture rapide et efficace",
      "Stratégies pour les questions à choix multiples",
      "Exercices pratiques avec corrigés",
      "Textes d'entraînement de niveau examen",
    ],
    benefits_en: [
      "Speed reading techniques",
      "Multiple-choice question strategies",
      "Practical exercises with answer keys",
      "Exam-level practice texts",
    ],
    target_audience_fr: "Candidats préparant l'épreuve de compréhension en lecture SLE.",
    target_audience_en: "Candidates preparing for the SLE reading comprehension test.",
    related_items: ["pass-sle-reading-comprehension-en", "reussir-examen-ecrit-sle"],
    sort_order: 22,
    is_featured: false,
    is_new: false,
    published_date: "2025-08-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 23. Pass SLE Reading Comprehension (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-012-en",
    slug: "pass-sle-reading-comprehension-en",
    type: "book",
    title_fr: "Réussir la Compréhension en Lecture SLE (Édition anglaise)",
    title_en: "Pass the SLE Reading Comprehension",
    short_desc_fr: "Compréhension en lecture SLE — édition anglaise.",
    short_desc_en: "Strategies and techniques to pass the SLE reading comprehension test.",
    long_desc_fr: "L'édition anglaise du guide de compréhension en lecture SLE.",
    long_desc_en: "The SLE reading comprehension test requires specific skills. This guide teaches speed reading techniques, main idea identification, and strategies for effectively answering multiple-choice questions.",
    why_it_exists_fr: "Pour les anglophones préparant l'épreuve de compréhension en lecture.",
    why_it_exists_en: "For English speakers preparing for the SLE reading comprehension test.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/pass-sle-reading-comprehension-en",
    cover_image_url: "/images/library/Pass_SLE_Reading_Comprehension_EN.webp",
    tags: ["Reading", "Comprehension", "SLE", "Exam"],
    level: ["B1", "B2", "C1"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "reading-comprehension",
    author: "Steven Barholere",
    benefits_fr: ["Techniques de lecture", "Stratégies QCM", "Exercices pratiques"],
    benefits_en: ["Speed reading techniques", "Multiple-choice strategies", "Practical exercises with answer keys"],
    target_audience_fr: "Candidats anglophones préparant la compréhension en lecture SLE.",
    target_audience_en: "English-speaking candidates preparing for SLE reading comprehension.",
    related_items: ["reussir-comprehension-lecture-sle", "pass-sle-written-exam-en"],
    sort_order: 23,
    is_featured: false,
    is_new: false,
    published_date: "2025-08-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 24. Réussir l'Examen Écrit SLE (FR)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-013-fr",
    slug: "reussir-examen-ecrit-sle",
    type: "book",
    title_fr: "Réussir l'Examen Écrit SLE",
    title_en: "Pass the SLE Written Exam (French Edition)",
    short_desc_fr: "Guide complet pour réussir l'épreuve d'expression écrite de l'examen SLE.",
    short_desc_en: "Complete guide to passing the SLE written expression test.",
    long_desc_fr: "L'épreuve d'expression écrite SLE évalue votre capacité à rédiger dans un contexte professionnel. Ce guide couvre la structure des textes administratifs, les conventions de rédaction, la grammaire essentielle, et les stratégies pour maximiser votre score. Avec des modèles de textes et des exercices d'entraînement.",
    long_desc_en: "The SLE written expression test evaluates your ability to write in a professional context. This guide covers administrative text structure, writing conventions, essential grammar, and strategies to maximize your score.",
    why_it_exists_fr: "L'examen écrit SLE a ses propres exigences. Ce guide vous prépare spécifiquement à cette épreuve.",
    why_it_exists_en: "The SLE written exam has its own requirements. This guide prepares you specifically for this test.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/reussir-examen-ecrit-sle",
    cover_image_url: "/images/library/Reussir_Examen_Ecrit_SLE_FR.webp",
    cover_image_en_url: "/images/library/Pass_SLE_Written_Exam_EN.webp",
    tags: ["Examen écrit", "SLE", "Rédaction", "Expression écrite"],
    level: ["B1", "B2", "C1"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "written-exam",
    author: "Steven Barholere",
    benefits_fr: [
      "Structure des textes administratifs",
      "Conventions de rédaction professionnelle",
      "Grammaire essentielle pour l'examen",
      "Modèles de textes et exercices",
    ],
    benefits_en: [
      "Administrative text structure",
      "Professional writing conventions",
      "Essential grammar for the exam",
      "Text models and exercises",
    ],
    target_audience_fr: "Candidats préparant l'épreuve d'expression écrite SLE.",
    target_audience_en: "Candidates preparing for the SLE written expression test.",
    related_items: ["pass-sle-written-exam-en", "reussir-comprehension-lecture-sle", "grammaire-professionnelle-fonctionnaire-canadien"],
    sort_order: 24,
    is_featured: false,
    is_new: false,
    published_date: "2025-08-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 25. Pass SLE Written Exam (EN)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-013-en",
    slug: "pass-sle-written-exam-en",
    type: "book",
    title_fr: "Réussir l'Examen Écrit SLE (Édition anglaise)",
    title_en: "Pass the SLE Written Exam",
    short_desc_fr: "Examen écrit SLE — édition anglaise.",
    short_desc_en: "Complete guide to passing the SLE written expression test.",
    long_desc_fr: "L'édition anglaise du guide pour réussir l'examen écrit SLE.",
    long_desc_en: "The SLE written expression test evaluates your ability to write in a professional context. This guide covers administrative text structure, writing conventions, essential grammar, and strategies to maximize your score.",
    why_it_exists_fr: "Pour les anglophones préparant l'examen écrit SLE.",
    why_it_exists_en: "For English speakers preparing for the SLE written exam.",
    price_type: "paid",
    price_amount: 24.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/pass-sle-written-exam-en",
    cover_image_url: "/images/library/Pass_SLE_Written_Exam_EN.webp",
    tags: ["Written Exam", "SLE", "Writing", "Expression"],
    level: ["B1", "B2", "C1"],
    language: "EN",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "written-exam",
    author: "Steven Barholere",
    benefits_fr: ["Structure des textes", "Rédaction professionnelle", "Exercices pratiques"],
    benefits_en: ["Administrative text structure", "Professional writing conventions", "Practical exercises"],
    target_audience_fr: "Candidats anglophones préparant l'examen écrit SLE.",
    target_audience_en: "English-speaking candidates preparing for the SLE written exam.",
    related_items: ["reussir-examen-ecrit-sle", "pass-sle-reading-comprehension-en"],
    sort_order: 25,
    is_featured: false,
    is_new: false,
    published_date: "2025-08-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 26. Vocabulaire - Débutant (A1-A2)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-014",
    slug: "vocabulaire-contexte-fonction-publique-debutant",
    type: "book",
    title_fr: "Vocabulaire en Contexte de la Fonction Publique — Débutant (A1–A2)",
    title_en: "Public Service Vocabulary in Context — Beginner (A1–A2)",
    short_desc_fr: "Maîtrisez le vocabulaire essentiel pour exceller dans la fonction publique canadienne bilingue — niveau débutant.",
    short_desc_en: "Master the essential vocabulary to excel in Canada's bilingual public service — beginner level.",
    long_desc_fr: "Ce premier volume de la collection Vocabulaire Professionnel vous initie au vocabulaire fondamental de la fonction publique canadienne. Organisé par contextes professionnels réels (réunions, courriels, rapports), chaque chapitre présente le vocabulaire en situation, avec des exercices de mise en pratique et des notes culturelles.",
    long_desc_en: "This first volume of the Professional Vocabulary collection introduces you to the fundamental vocabulary of the Canadian public service. Organized by real professional contexts (meetings, emails, reports), each chapter presents vocabulary in context with practice exercises.",
    why_it_exists_fr: "Le vocabulaire de la fonction publique est spécifique et souvent déroutant pour les débutants. Ce guide rend l'apprentissage accessible et contextualisé.",
    why_it_exists_en: "Public service vocabulary is specific and often confusing for beginners. This guide makes learning accessible and contextualized.",
    price_type: "paid",
    price_amount: 19.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/vocabulaire-contexte-fonction-publique-debutant",
    cover_image_url: "/images/library/Vocabulaire_Contexte_Fonction_Publique_Debutant.webp",
    tags: ["Vocabulaire", "Fonction publique", "Débutant", "A1", "A2"],
    level: ["A1-A2"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "vocabulaire-professionnel",
    author: "Steven Barholere",
    benefits_fr: [
      "Vocabulaire fondamental de la fonction publique",
      "Organisé par contextes professionnels réels",
      "Exercices de mise en pratique",
      "Notes culturelles et conseils d'usage",
    ],
    benefits_en: [
      "Fundamental public service vocabulary",
      "Organized by real professional contexts",
      "Practice exercises",
      "Cultural notes and usage tips",
    ],
    target_audience_fr: "Nouveaux fonctionnaires, débutants en français, niveaux A1-A2.",
    target_audience_en: "New public servants, French beginners, levels A1-A2.",
    related_items: ["vocabulaire-contexte-fonction-publique-intermediaire", "vocabulaire-contexte-fonction-publique-avance"],
    sort_order: 26,
    is_featured: false,
    is_new: true,
    published_date: "2025-09-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 27. Vocabulaire - Intermédiaire (B1-B2)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-015",
    slug: "vocabulaire-contexte-fonction-publique-intermediaire",
    type: "book",
    title_fr: "Vocabulaire en Contexte de la Fonction Publique — Intermédiaire (B1–B2)",
    title_en: "Public Service Vocabulary in Context — Intermediate (B1–B2)",
    short_desc_fr: "Enrichissez votre vocabulaire professionnel pour la fonction publique canadienne — niveau intermédiaire.",
    short_desc_en: "Enrich your professional vocabulary for the Canadian public service — intermediate level.",
    long_desc_fr: "Le deuxième volume de la collection approfondit le vocabulaire professionnel avec des contextes plus complexes : négociations, présentations, rédaction de politiques, et communication interministérielle. Idéal pour les fonctionnaires visant le niveau B à l'examen SLE.",
    long_desc_en: "The second volume deepens professional vocabulary with more complex contexts: negotiations, presentations, policy writing, and inter-departmental communication. Ideal for public servants aiming for Level B on the SLE exam.",
    why_it_exists_fr: "Le niveau intermédiaire est le palier critique où le vocabulaire professionnel fait la différence entre B et C.",
    why_it_exists_en: "The intermediate level is the critical threshold where professional vocabulary makes the difference between B and C.",
    price_type: "paid",
    price_amount: 19.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/vocabulaire-contexte-fonction-publique-intermediaire",
    cover_image_url: "/images/library/Vocabulaire_Contexte_Fonction_Publique_Intermediaire.webp",
    tags: ["Vocabulaire", "Fonction publique", "Intermédiaire", "B1", "B2"],
    level: ["B1-B2"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "vocabulaire-professionnel",
    author: "Steven Barholere",
    benefits_fr: [
      "Vocabulaire professionnel approfondi",
      "Contextes complexes : négociations, présentations",
      "Préparation spécifique au niveau B SLE",
      "Exercices de mise en situation",
    ],
    benefits_en: [
      "In-depth professional vocabulary",
      "Complex contexts: negotiations, presentations",
      "Specific preparation for SLE Level B",
      "Situational exercises",
    ],
    target_audience_fr: "Fonctionnaires de niveau intermédiaire, candidats visant le B à l'examen SLE.",
    target_audience_en: "Intermediate-level public servants, candidates aiming for Level B on the SLE.",
    related_items: ["vocabulaire-contexte-fonction-publique-debutant", "vocabulaire-contexte-fonction-publique-avance"],
    sort_order: 27,
    is_featured: false,
    is_new: true,
    published_date: "2025-09-15",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 28. Vocabulaire - Avancé (C1-C2)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-016",
    slug: "vocabulaire-contexte-fonction-publique-avance",
    type: "book",
    title_fr: "Vocabulaire en Contexte de la Fonction Publique — Avancé (C1–C2)",
    title_en: "Public Service Vocabulary in Context — Advanced (C1–C2)",
    short_desc_fr: "Le vocabulaire de haut niveau pour exceller dans la fonction publique canadienne — niveau avancé.",
    short_desc_en: "High-level vocabulary to excel in the Canadian public service — advanced level.",
    long_desc_fr: "Le troisième volume de la collection cible le vocabulaire de haut niveau : nuances diplomatiques, rédaction stratégique, terminologie juridique et politique, et expressions idiomatiques professionnelles. Indispensable pour les candidats visant le niveau C à l'examen SLE.",
    long_desc_en: "The third volume targets high-level vocabulary: diplomatic nuances, strategic writing, legal and political terminology, and professional idiomatic expressions. Essential for candidates aiming for Level C on the SLE exam.",
    why_it_exists_fr: "Le niveau C exige un vocabulaire précis et nuancé. Ce guide cible exactement ce qui fait la différence.",
    why_it_exists_en: "Level C demands precise and nuanced vocabulary. This guide targets exactly what makes the difference.",
    price_type: "paid",
    price_amount: 19.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/vocabulaire-contexte-fonction-publique-avance",
    cover_image_url: "/images/library/Vocabulaire_Contexte_Fonction_Publique_Avance.webp",
    tags: ["Vocabulaire", "Fonction publique", "Avancé", "C1", "C2"],
    level: ["C1-C2"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "vocabulaire-professionnel",
    author: "Steven Barholere",
    benefits_fr: [
      "Vocabulaire de haut niveau C1-C2",
      "Nuances diplomatiques et stratégiques",
      "Terminologie juridique et politique",
      "Expressions idiomatiques professionnelles",
    ],
    benefits_en: [
      "High-level C1-C2 vocabulary",
      "Diplomatic and strategic nuances",
      "Legal and political terminology",
      "Professional idiomatic expressions",
    ],
    target_audience_fr: "Fonctionnaires avancés, candidats visant le C à l'examen SLE.",
    target_audience_en: "Advanced public servants, candidates aiming for Level C on the SLE.",
    related_items: ["vocabulaire-contexte-fonction-publique-intermediaire", "decoder-le-niveau-c"],
    sort_order: 28,
    is_featured: false,
    is_new: true,
    published_date: "2025-10-01",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 29. La Grammaire Professionnelle du Fonctionnaire Canadien
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "book-017",
    slug: "grammaire-professionnelle-fonctionnaire-canadien",
    type: "book",
    title_fr: "La Grammaire Professionnelle du Fonctionnaire Canadien (A1–C1)",
    title_en: "Professional Grammar for the Canadian Public Servant (A1–C1)",
    short_desc_fr: "La référence grammaticale complète pour les fonctionnaires canadiens, du niveau A1 au C1.",
    short_desc_en: "The complete grammar reference for Canadian public servants, from level A1 to C1.",
    long_desc_fr: "Cette grammaire de référence couvre l'ensemble des règles grammaticales nécessaires pour la communication professionnelle dans la fonction publique canadienne. Du niveau A1 au C1, chaque règle est expliquée avec des exemples tirés du contexte professionnel : courriels, rapports, notes de service, présentations. Un outil indispensable sur votre bureau.",
    long_desc_en: "This reference grammar covers all grammatical rules needed for professional communication in the Canadian public service. From A1 to C1, each rule is explained with examples from the professional context.",
    why_it_exists_fr: "La grammaire est le fondement de toute communication professionnelle. Ce guide est la référence adaptée au contexte de la fonction publique.",
    why_it_exists_en: "Grammar is the foundation of all professional communication. This guide is the reference adapted to the public service context.",
    price_type: "paid",
    price_amount: 34.99,
    cta_label_fr: "Acheter maintenant",
    cta_label_en: "Buy Now",
    cta_url: "/library/books/grammaire-professionnelle-fonctionnaire-canadien",
    cover_image_url: "/images/library/La_Grammaire_Professionnelle_du_Fonctionnaire_Canadien_A1_C1.webp",
    tags: ["Grammaire", "Fonction publique", "Référence", "A1-C1"],
    level: ["A1-C1"],
    language: "FR",
    format: "PDF/EPUB",
    status: "published",
    audience: "learner",
    collection: "grammar",
    author: "Steven Barholere",
    benefits_fr: [
      "Couverture complète A1 à C1",
      "Exemples tirés du contexte professionnel",
      "Règles expliquées clairement",
      "Outil de référence quotidien",
    ],
    benefits_en: [
      "Complete A1 to C1 coverage",
      "Examples from professional context",
      "Clearly explained rules",
      "Daily reference tool",
    ],
    target_audience_fr: "Tous les fonctionnaires canadiens, du débutant à l'avancé.",
    target_audience_en: "All Canadian public servants, from beginner to advanced.",
    related_items: ["vocabulaire-contexte-fonction-publique-debutant", "decoder-le-niveau-c", "reussir-examen-ecrit-sle"],
    sort_order: 29,
    is_featured: true,
    is_new: true,
    published_date: "2025-10-15",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getLibraryItemBySlug(slug: string): LibraryItem | undefined {
  return LIBRARY_ITEMS.find((item) => item.slug === slug);
}

export function getLibraryItemsByCollection(collection: ProductCollection): LibraryItem[] {
  return LIBRARY_ITEMS.filter((item) => item.collection === collection && item.status === "published");
}

export function getLibraryItemsByType(type: ProductType): LibraryItem[] {
  return LIBRARY_ITEMS.filter((item) => item.type === type && item.status === "published");
}

export function getFeaturedItems(): LibraryItem[] {
  return LIBRARY_ITEMS.filter((item) => item.is_featured && item.status === "published");
}

export function getNewItems(): LibraryItem[] {
  return LIBRARY_ITEMS.filter((item) => item.is_new && item.status === "published");
}

export function getRelatedItems(slug: string): LibraryItem[] {
  const item = getLibraryItemBySlug(slug);
  if (!item || !item.related_items) return [];
  return item.related_items
    .map((relSlug) => getLibraryItemBySlug(relSlug))
    .filter((i): i is LibraryItem => i !== undefined);
}

export function searchLibraryItems(query: string, language: "en" | "fr"): LibraryItem[] {
  const q = query.toLowerCase();
  return LIBRARY_ITEMS.filter((item) => {
    if (item.status !== "published") return false;
    const title = language === "fr" ? item.title_fr : item.title_en;
    const desc = language === "fr" ? item.short_desc_fr : item.short_desc_en;
    return (
      title.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      item.author.toLowerCase().includes(q)
    );
  });
}

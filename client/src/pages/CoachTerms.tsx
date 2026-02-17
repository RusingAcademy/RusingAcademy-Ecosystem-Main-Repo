import { Link } from "wouter";
import { ArrowLeft, FileText, DollarSign, Shield, Clock, AlertTriangle, CheckCircle, Building2, Users, Megaphone, Wrench, GraduationCap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Bilingual content object ──────────────────────────────────────────────
const t = {
  header: {
    back: { en: "Back to Dashboard", fr: "Retour au tableau de bord" },
    title: { en: "Terms & Conditions", fr: "Termes et Conditions" },
  },
  hero: {
    title: { en: "Coach Terms & Conditions", fr: "Termes et Conditions pour les Coachs" },
    subtitle: { en: "Coach Partnership Agreement", fr: "Contrat de Partenariat Coach" },
    company: "Rusinga International Consulting Ltd.",
    brand: { en: 'Commercially known as "RusingAcademy"', fr: 'Commercialement connue sous le nom de « RusingAcademy »' },
    platform: { en: "Language Coaching Platform for Canadian Public Servants", fr: "Plateforme de Coaching Linguistique pour Fonctionnaires Canadiens" },
    updated: { en: "Last updated", fr: "Dernière mise à jour" },
    version: { en: "Version", fr: "Version" },
  },
  s1: {
    title: { en: "1. Introduction and Definitions", fr: "1. Introduction et Définitions" },
    intro: {
      en: 'These general terms and conditions ("Terms") govern your use of the language coaching platform as a certified coach. By accepting these terms, you acknowledge that you have read, understood, and accepted all the terms below.',
      fr: 'Les présentes conditions générales (« Conditions ») régissent votre utilisation de la plateforme de coaching linguistique en tant que coach certifié. En acceptant ces conditions, vous reconnaissez avoir lu, compris et accepté l\'ensemble des termes ci-dessous.',
    },
    defs: {
      en: [
        { term: '"The Company"', def: 'means Rusinga International Consulting Ltd., a Canadian corporation, commercially known as "RusingAcademy".' },
        { term: '"The Platform"', def: 'means all technological services and web applications operated by the Company for connecting coaches and learners.' },
        { term: '"The Coach"', def: 'means any certified professional who has accepted these Terms to offer coaching services through the Platform.' },
      ],
      fr: [
        { term: '« La Société »', def: 'désigne Rusinga International Consulting Ltd., société canadienne, commercialement connue sous le nom de « RusingAcademy ».' },
        { term: '« La Plateforme »', def: 'désigne l\'ensemble des services technologiques et applications web opérés par la Société pour la mise en relation de coachs et d\'apprenants.' },
        { term: '« Le Coach »', def: 'désigne tout professionnel certifié ayant accepté les présentes conditions pour offrir des services de coaching via la Plateforme.' },
      ],
    },
  },
  s2: {
    title: { en: "2. Commission Structure and Administrative Fees", fr: "2. Structure de Commission et Frais Administratifs" },
    rate: { en: "Administrative Commission:", fr: "Commission Administrative :" },
    rateValue: "30%",
    desc: {
      en: 'For each payment received through the Platform, administrative fees of <strong>thirty percent (30%)</strong> will be automatically deducted. The Coach will receive the remaining <strong>seventy percent (70%)</strong> directly to their Stripe Connect account.',
      fr: 'Pour chaque paiement reçu via la Plateforme, des frais administratifs de <strong>trente pour cent (30%)</strong> seront automatiquement prélevés. Le Coach recevra les <strong>soixante-dix pour cent (70%)</strong> restants directement sur son compte Stripe Connect.',
    },
    breakdownTitle: { en: "Allocation of Administrative Fees (30%)", fr: "Affectation des Frais Administratifs (30%)" },
    breakdownDesc: {
      en: "The 30% commission is allocated to the general administration of your coach account, including:",
      fr: "La commission de 30% est affectée à l'administration générale de votre compte coach, incluant :",
    },
    items: {
      en: [
        { icon: "building", title: "Logistics & Infrastructure", desc: "Secure hosting, servers, databases, video conferencing system, booking calendar" },
        { icon: "wrench", title: "Maintenance & Upkeep", desc: "Security updates, bug fixes, continuous improvements, 24/7 technical support" },
        { icon: "grad", title: "Training & Development", desc: "Coach webinars, pedagogical resources, certifications, access to AI coaching tools" },
        { icon: "megaphone", title: "Marketing & Visibility", desc: "Advertising, SEO, social media, government partnerships, new learner acquisition" },
        { icon: "users", title: "Client Support", desc: "Customer service, dispute management, mediation, learner and coach assistance" },
        { icon: "shield", title: "Compliance & Security", desc: "Data protection, PIPEDA compliance, insurance, background checks" },
      ],
      fr: [
        { icon: "building", title: "Logistique & Infrastructure", desc: "Hébergement sécurisé, serveurs, bases de données, système de vidéoconférence, calendrier de réservation" },
        { icon: "wrench", title: "Entretien & Maintenance", desc: "Mises à jour de sécurité, corrections de bugs, améliorations continues, support technique 24/7" },
        { icon: "grad", title: "Formations & Développement", desc: "Webinaires pour coachs, ressources pédagogiques, certifications, accès aux outils IA d'accompagnement" },
        { icon: "megaphone", title: "Marketing & Visibilité", desc: "Publicité, SEO, réseaux sociaux, partenariats gouvernementaux, acquisition de nouveaux apprenants" },
        { icon: "users", title: "Support Client", desc: "Service à la clientèle, gestion des litiges, médiation, assistance aux apprenants et coachs" },
        { icon: "shield", title: "Conformité & Sécurité", desc: "Protection des données, conformité LPRPDE, assurances, vérifications des antécédents" },
      ],
    },
    example: {
      title: { en: "Calculation Example", fr: "Exemple de calcul" },
      lines: {
        en: ["Session at $100 CAD", "Administrative fees: $30 (30%)", "Coach revenue: $70 (70%)"],
        fr: ["Session à 100$ CAD", "Frais administratifs : 30$ (30%)", "Revenu coach : 70$ (70%)"],
      },
    },
    benefits: {
      title: { en: "Benefits Included", fr: "Avantages inclus" },
      lines: {
        en: ["No registration fees", "No fixed monthly fees", "Pay only on revenue generated", "Full access to all tools"],
        fr: ["Aucun frais d'inscription", "Aucun frais mensuel fixe", "Paiement uniquement sur revenus générés", "Accès complet à tous les outils"],
      },
    },
  },
  s3: {
    title: { en: "3. Payment Terms", fr: "3. Modalités de Paiement" },
    clauses: {
      en: [
        { id: "3.1", title: "Stripe Connect Account:", body: "Each Coach must create and maintain a valid Stripe Connect account to receive payments. The Company is not responsible for delays caused by incorrect or incomplete banking information." },
        { id: "3.2", title: "Payment Timeline:", body: "Payments are automatically deposited to your bank account according to Stripe's schedule (typically 2-7 business days after the transaction)." },
        { id: "3.3", title: "Currency:", body: "All payments are made in Canadian dollars (CAD), unless otherwise agreed in writing." },
        { id: "3.4", title: "Taxes:", body: "The Coach is solely responsible for reporting and paying all applicable taxes on coaching income, including GST/HST and income taxes." },
        { id: "3.5", title: "Independent Contractor Status:", body: "The Coach operates as an independent contractor and not as an employee of the Company. No employment relationship is created by these Terms." },
      ],
      fr: [
        { id: "3.1", title: "Compte Stripe Connect :", body: "Chaque Coach doit créer et maintenir un compte Stripe Connect valide pour recevoir ses paiements. La Société n'est pas responsable des retards causés par des informations bancaires incorrectes ou incomplètes." },
        { id: "3.2", title: "Délai de versement :", body: "Les paiements sont versés automatiquement sur votre compte bancaire selon le calendrier de Stripe (généralement 2-7 jours ouvrables après la transaction)." },
        { id: "3.3", title: "Devise :", body: "Tous les paiements sont effectués en dollars canadiens (CAD), sauf indication contraire convenue par écrit." },
        { id: "3.4", title: "Taxes :", body: "Le Coach est seul responsable de la déclaration et du paiement de toutes les taxes applicables sur ses revenus de coaching, incluant la TPS/TVH et les impôts sur le revenu." },
        { id: "3.5", title: "Statut d'entrepreneur indépendant :", body: "Le Coach exerce ses activités en tant qu'entrepreneur indépendant et non en tant qu'employé de la Société. Aucune relation d'emploi n'est créée par les présentes Conditions." },
      ],
    },
  },
  s4: {
    title: { en: "4. Coach Obligations", fr: "4. Obligations du Coach" },
    clauses: {
      en: [
        { id: "4.1", title: "Quality of Service:", body: "The Coach commits to providing high-quality coaching services, in accordance with the professional standards of the language coaching industry." },
        { id: "4.2", title: "Availability:", body: "The Coach must keep their availability calendar up to date and honor all booked sessions, except in cases of force majeure duly justified." },
        { id: "4.3", title: "Confidentiality:", body: "The Coach commits to maintaining the confidentiality of learners' personal information and not using it for unauthorized purposes." },
        { id: "4.4", title: "Professionalism:", body: "The Coach must maintain professional conduct at all times and positively represent the Platform and the Company." },
        { id: "4.5", title: "Payment Exclusivity:", body: "All payments for sessions organized through the Platform must go through the integrated payment system. It is strictly prohibited to solicit direct payments from learners met through the Platform." },
        { id: "4.6", title: "Identity Verification:", body: "The Coach consents to providing required identification documents and submitting to necessary background checks." },
      ],
      fr: [
        { id: "4.1", title: "Qualité de service :", body: "Le Coach s'engage à fournir des services de coaching de haute qualité, conformes aux standards professionnels de l'industrie du coaching linguistique." },
        { id: "4.2", title: "Disponibilité :", body: "Le Coach doit maintenir son calendrier de disponibilité à jour et honorer toutes les sessions réservées, sauf cas de force majeure dûment justifié." },
        { id: "4.3", title: "Confidentialité :", body: "Le Coach s'engage à maintenir la confidentialité des informations personnelles des apprenants et à ne pas les utiliser à des fins non autorisées." },
        { id: "4.4", title: "Professionnalisme :", body: "Le Coach doit maintenir une conduite professionnelle en tout temps et représenter positivement la Plateforme et la Société." },
        { id: "4.5", title: "Exclusivité des paiements :", body: "Tous les paiements pour les sessions organisées via la Plateforme doivent transiter par le système de paiement intégré. Il est strictement interdit de solliciter des paiements directs des apprenants rencontrés via la Plateforme." },
        { id: "4.6", title: "Vérification d'identité :", body: "Le Coach consent à fournir les documents d'identification requis et à se soumettre aux vérifications d'antécédents nécessaires." },
      ],
    },
  },
  s5: {
    title: { en: "5. Cancellation Policy", fr: "5. Politique d'Annulation" },
    clauses: {
      en: [
        { id: "5.1", title: "Cancellation by Coach:", body: "If the Coach cancels less than 24 hours before the session, the learner will be fully refunded and the Coach may be subject to penalties up to temporary account suspension." },
        { id: "5.2", title: "Cancellation by Learner:", body: "Learner cancellations are subject to the Platform's cancellation policy. The Coach will receive their share (70%) if the cancellation occurs less than 24 hours before the session." },
        { id: "5.3", title: "No-show:", body: "In case of an unjustified absence by the learner, the Coach will receive the full share (70%) of the session." },
        { id: "5.4", title: "Force Majeure:", body: "Cancellations due to exceptional circumstances (medical emergency, natural disaster, etc.) will be handled on a case-by-case basis." },
      ],
      fr: [
        { id: "5.1", title: "Annulation par le Coach :", body: "En cas d'annulation par le Coach moins de 24 heures avant la session, l'apprenant sera intégralement remboursé et le Coach pourra faire l'objet de pénalités pouvant aller jusqu'à la suspension temporaire du compte." },
        { id: "5.2", title: "Annulation par l'apprenant :", body: "Les annulations par l'apprenant sont soumises à la politique d'annulation de la Plateforme. Le Coach recevra sa part (70%) si l'annulation intervient moins de 24 heures avant la session." },
        { id: "5.3", title: "No-show :", body: "En cas d'absence non justifiée de l'apprenant, le Coach recevra l'intégralité de sa part (70%) de la session." },
        { id: "5.4", title: "Force majeure :", body: "Les annulations dues à des circonstances exceptionnelles (urgence médicale, catastrophe naturelle, etc.) seront traitées au cas par cas." },
      ],
    },
  },
  s6: {
    title: { en: "6. Termination", fr: "6. Résiliation" },
    clauses: {
      en: [
        { id: "6.1", title: "Voluntary Termination:", body: "The Coach may terminate their partnership with the Company at any time with 30 days' written notice. All sessions booked during this period must be honored." },
        { id: "6.2", title: "Termination for Cause:", body: "The Company reserves the right to immediately terminate the partnership in case of violation of these Terms, inappropriate behavior, fraud, or repeated learner complaints." },
        { id: "6.3", title: "Effects of Termination:", body: "Upon termination, the Coach will receive all payments due for completed sessions. Platform access will be revoked within 48 hours of the effective termination date." },
      ],
      fr: [
        { id: "6.1", title: "Résiliation volontaire :", body: "Le Coach peut mettre fin à son partenariat avec la Société à tout moment avec un préavis écrit de 30 jours. Toutes les sessions réservées pendant cette période doivent être honorées." },
        { id: "6.2", title: "Résiliation pour cause :", body: "La Société se réserve le droit de résilier immédiatement le partenariat en cas de violation des présentes Conditions, de comportement inapproprié, de fraude, ou de plaintes répétées des apprenants." },
        { id: "6.3", title: "Effets de la résiliation :", body: "À la résiliation, le Coach recevra tous les paiements dus pour les sessions complétées. L'accès à la Plateforme sera révoqué dans les 48 heures suivant la date effective de résiliation." },
      ],
    },
  },
  s7: {
    title: { en: "7. Intellectual Property", fr: "7. Propriété Intellectuelle" },
    body: {
      en: "The Coach retains all rights to their original content. However, by using the Platform, the Coach grants Rusinga International Consulting Ltd. a non-exclusive, worldwide, royalty-free license to use their name, photo, and biography for marketing and promotional purposes of the Platform.",
      fr: "Le Coach conserve tous les droits sur son contenu original. Cependant, en utilisant la Plateforme, le Coach accorde à Rusinga International Consulting Ltd. une licence non exclusive, mondiale et libre de redevances pour utiliser son nom, sa photo et sa biographie à des fins de marketing et de promotion de la Plateforme.",
    },
  },
  s8: {
    title: { en: "8. Modifications to Terms", fr: "8. Modifications des Conditions" },
    body: {
      en: "The Company reserves the right to modify these Terms at any time. Coaches will be notified of any significant changes by email at least 30 days before the new terms take effect. Continued use of the Platform after this period constitutes acceptance of the new terms.",
      fr: "La Société se réserve le droit de modifier ces Conditions à tout moment. Les Coachs seront notifiés de tout changement significatif par courriel au moins 30 jours avant l'entrée en vigueur des nouvelles conditions. L'utilisation continue de la Plateforme après cette période constitue une acceptation des nouvelles conditions.",
    },
  },
  s9: {
    title: { en: "9. Governing Law and Jurisdiction", fr: "9. Droit Applicable et Juridiction" },
    body: {
      en: "These Terms are governed by the laws of the Province of Ontario and the applicable federal laws of Canada. Any dispute arising from these Terms shall be submitted to the exclusive jurisdiction of the courts of the Province of Ontario, Canada.",
      fr: "Les présentes Conditions sont régies par les lois de la province de l'Ontario et les lois fédérales du Canada applicables. Tout litige découlant des présentes Conditions sera soumis à la compétence exclusive des tribunaux de la province de l'Ontario, Canada.",
    },
  },
  s10: {
    title: { en: "10. Contact", fr: "10. Contact" },
    intro: {
      en: "For any questions regarding these Terms, please contact:",
      fr: "Pour toute question concernant ces Conditions, veuillez contacter :",
    },
  },
  summary: {
    title: { en: "Key Points Summary", fr: "Résumé des Points Clés" },
    items: {
      en: [
        "Administrative fees of <strong>30%</strong> deducted from each payment",
        "The 30% covers: logistics, maintenance, training, marketing, and support",
        "You receive <strong>70%</strong> of each session directly to your Stripe account",
        "Automatic payments via Stripe Connect (2-7 business days)",
        "Independent contractor status — you are responsible for your tax obligations",
        "All payments must go through the Platform",
      ],
      fr: [
        "Frais administratifs de <strong>30%</strong> prélevés sur chaque paiement",
        "Les 30% couvrent : logistique, entretien, formations, marketing et support",
        "Vous recevez <strong>70%</strong> de chaque session directement sur votre compte Stripe",
        "Paiements automatiques via Stripe Connect (2-7 jours ouvrables)",
        "Statut d'entrepreneur indépendant - vous êtes responsable de vos obligations fiscales",
        "Tous les paiements doivent passer par la Plateforme",
      ],
    },
  },
  backBtn: { en: "Back to Dashboard", fr: "Retour au Tableau de Bord" },
  copyright: { en: "All rights reserved.", fr: "Tous droits réservés." },
};

// ── Icon map ──────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  building: <Building2 className="w-5 h-5 text-teal-600" />,
  wrench: <Wrench className="w-5 h-5 text-blue-600" />,
  grad: <GraduationCap className="w-5 h-5 text-purple-600" />,
  megaphone: <Megaphone className="w-5 h-5 text-orange-600" />,
  users: <Users className="w-5 h-5 text-green-600" />,
  shield: <Shield className="w-5 h-5 text-red-600" />,
};
const iconBgMap: Record<string, string> = {
  building: "bg-teal-100 dark:bg-teal-900/50",
  wrench: "bg-blue-100 dark:bg-blue-900/50",
  grad: "bg-purple-100 dark:bg-purple-900/50",
  megaphone: "bg-orange-100 dark:bg-orange-900/50",
  users: "bg-green-100 dark:bg-green-900/50",
  shield: "bg-red-100 dark:bg-red-900/50",
};

// ── Component ─────────────────────────────────────────────────────────────
export default function CoachTerms() {
  const { language, setLanguage } = useLanguage();
  const l = language as "en" | "fr";
  const lastUpdated = l === "fr" ? "29 janvier 2026" : "January 29, 2026";
  const termsVersion = "v2026.01.29";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-obsidian dark:to-teal-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-obsidian/80 backdrop-blur-md border-b border-slate-200 dark:border-teal-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/coach/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.header.back[l]}
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-black dark:text-white">{t.header.title[l]}</span>
              </div>
              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(l === "fr" ? "en" : "fr")}
                className="gap-1.5 text-xs"
              >
                <Globe className="w-3.5 h-3.5" />
                {l === "fr" ? "English" : "Français"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 dark:bg-foundation rounded-2xl shadow-xl border border-slate-200 dark:border-teal-800 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <img
                loading="lazy"
                src="/rusinga-logo.png"
                alt="Rusinga International Consulting Ltd."
                className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 p-1"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div>
                <h1 className="text-2xl font-bold">{t.hero.title[l]}</h1>
                <p className="text-teal-100 text-sm">{t.hero.subtitle[l]}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/10 rounded-lg p-4 mt-4">
              <p className="font-semibold">{t.hero.company}</p>
              <p className="text-teal-100 text-sm">{t.hero.brand[l]}</p>
              <p className="text-teal-200 text-xs mt-2">{t.hero.platform[l]}</p>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-teal-200">
              <span>{t.hero.updated[l]} : {lastUpdated}</span>
              <span>{t.hero.version[l]} : {termsVersion}</span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1 — Introduction */}
            <section>
              <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                {t.s1.title[l]}
              </h2>
              <p className="text-black dark:text-white/90 leading-relaxed mb-4">{t.s1.intro[l]}</p>
              <div className="bg-slate-50 dark:bg-teal-800/50 rounded-lg p-4 space-y-2 text-sm">
                {t.s1.defs[l].map((d, i) => (
                  <p key={i}><strong>{d.term}</strong> {d.def}</p>
                ))}
              </div>
            </section>

            {/* Section 2 — Commission */}
            <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                {t.s2.title[l]}
              </h2>
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 dark:bg-foundation rounded-lg p-4 border border-amber-300 dark:border-amber-600">
                  <p className="text-lg font-semibold text-black dark:text-white mb-2">
                    {t.s2.rate[l]} <span className="text-amber-600 text-2xl">{t.s2.rateValue}</span>
                  </p>
                  <p className="text-black dark:text-white/90" dangerouslySetInnerHTML={{ __html: t.s2.desc[l] }} />
                </div>

                <div className="bg-white dark:bg-slate-800 dark:bg-foundation rounded-lg p-5 border border-slate-200 dark:border-slate-600">
                  <h3 className="font-bold text-black dark:text-white mb-4 text-center">{t.s2.breakdownTitle[l]}</h3>
                  <p className="text-sm text-black dark:text-white dark:text-cyan-300 mb-4 text-center">{t.s2.breakdownDesc[l]}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {t.s2.items[l].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-teal-800/50 rounded-lg">
                        <div className={`w-10 h-10 ${iconBgMap[item.icon]} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {iconMap[item.icon]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-black dark:text-white text-sm">{item.title}</h4>
                          <p className="text-xs text-black dark:text-white dark:text-cyan-300">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 dark:bg-foundation rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <h4 className="font-semibold text-black dark:text-white mb-2">{t.s2.example.title[l]}</h4>
                    <ul className="text-sm text-black dark:text-white dark:text-cyan-300 space-y-1">
                      {t.s2.example.lines[l].map((line, i) => (
                        <li key={i}>• {i === 2 ? <strong>{line}</strong> : line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-slate-800 dark:bg-foundation rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <h4 className="font-semibold text-black dark:text-white mb-2">{t.s2.benefits.title[l]}</h4>
                    <ul className="text-sm text-black dark:text-white dark:text-cyan-300 space-y-1">
                      {t.s2.benefits.lines[l].map((line, i) => (
                        <li key={i}>✓ {line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Sections 3-6 — Clause-based */}
            {([t.s3, t.s4, t.s5, t.s6] as Array<{ title: Record<string, string>; clauses: Record<string, Array<{ id: string; title: string; body: string }>> }>).map((section, si) => (
              <section key={si}>
                <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  {si === 0 && <Clock className="w-5 h-5 text-teal-600" />}
                  {si === 1 && <Shield className="w-5 h-5 text-teal-600" />}
                  {si === 2 && <AlertTriangle className="w-5 h-5 text-teal-600" />}
                  {section.title[l]}
                </h2>
                <div className="space-y-3 text-black dark:text-white/90">
                  {section.clauses[l].map((clause) => (
                    <p key={clause.id}>
                      <strong>{clause.id} {clause.title}</strong> {clause.body}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* Section 7 — IP */}
            <section>
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t.s7.title[l]}</h2>
              <p className="text-black dark:text-white/90">{t.s7.body[l]}</p>
            </section>

            {/* Section 8 — Modifications */}
            <section>
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t.s8.title[l]}</h2>
              <p className="text-black dark:text-white/90">{t.s8.body[l]}</p>
            </section>

            {/* Section 9 — Governing Law */}
            <section>
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t.s9.title[l]}</h2>
              <p className="text-black dark:text-white/90">{t.s9.body[l]}</p>
            </section>

            {/* Section 10 — Contact */}
            <section>
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">{t.s10.title[l]}</h2>
              <div className="text-black dark:text-white/90 space-y-2">
                <p>{t.s10.intro[l]}</p>
                <div className="bg-slate-50 dark:bg-teal-800/50 rounded-lg p-4">
                  <p className="font-semibold">Rusinga International Consulting Ltd.</p>
                  <p className="text-sm">{t.hero.brand[l]}</p>
                  <p className="mt-2">
                    {l === "fr" ? "Courriel" : "Email"} :{" "}
                    <a href="mailto:coaches@rusingacademy.ca" className="text-teal-600 hover:underline">
                      coaches@rusingacademy.ca
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Key Points Summary */}
            <section className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                {t.summary.title[l]}
              </h2>
              <ul className="space-y-2 text-black dark:text-white/90">
                {t.summary.items[l].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 mt-1 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </section>

            {/* Legal Notice */}
            <div className="text-center text-xs text-black dark:text-white dark:text-cyan-300 pt-4 border-t border-slate-200 dark:border-teal-800">
              <p>&copy; {new Date().getFullYear()} Rusinga International Consulting Ltd. {t.copyright[l]}</p>
              <p className="mt-1">{l === "fr" ? "Document version" : "Document version"} {termsVersion}</p>
            </div>

            {/* Back Button */}
            <div className="pt-6">
              <Link href="/coach/dashboard">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  {t.backBtn[l]}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

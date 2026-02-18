/**
 * ============================================
 * PRESS KIT PAGE COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Screenshots, brand assets, key messaging
 * for media and press coverage.
 */
import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
interface BrandAsset {
  name: string;
  nameFr: string;
  type: "logo" | "screenshot" | "icon" | "color";
  description: string;
  descriptionFr: string;
}

interface KeyMessage {
  title: string;
  titleFr: string;
  content: string;
  contentFr: string;
}

/* ── Press Kit Data ── */
const BRAND_ASSETS: BrandAsset[] = [
  { name: "Primary Logo (SVG)", nameFr: "Logo principal (SVG)", type: "logo", description: "Full-color logo for light backgrounds", descriptionFr: "Logo en couleurs pour arrière-plans clairs" },
  { name: "Dark Mode Logo (SVG)", nameFr: "Logo mode sombre (SVG)", type: "logo", description: "Inverted logo for dark backgrounds", descriptionFr: "Logo inversé pour arrière-plans sombres" },
  { name: "Favicon (ICO/PNG)", nameFr: "Favicon (ICO/PNG)", type: "icon", description: "Browser tab icon, 16x16 to 512x512", descriptionFr: "Icône d'onglet navigateur, 16x16 à 512x512" },
  { name: "Homepage Screenshot", nameFr: "Capture d'écran page d'accueil", type: "screenshot", description: "Full-page screenshot of the landing page", descriptionFr: "Capture d'écran pleine page de la page d'accueil" },
  { name: "Dashboard Screenshot", nameFr: "Capture d'écran tableau de bord", type: "screenshot", description: "Student dashboard with progress tracking", descriptionFr: "Tableau de bord étudiant avec suivi de progression" },
  { name: "Mobile Screenshot", nameFr: "Capture d'écran mobile", type: "screenshot", description: "Mobile-responsive view of the platform", descriptionFr: "Vue réactive mobile de la plateforme" },
  { name: "Brand Color Palette", nameFr: "Palette de couleurs de la marque", type: "color", description: "Foundation Teal, CTA Copper, HAZY palette", descriptionFr: "Sarcelle fondation, Cuivre CTA, palette HAZY" },
];

const KEY_MESSAGES: KeyMessage[] = [
  {
    title: "Mission Statement",
    titleFr: "Énoncé de mission",
    content: "RusingÂcademy democratizes second-language training — making it more accessible, learner-centered, and aligned with the evolving needs of Canada's public service.",
    contentFr: "RusingÂcademy démocratise la formation en langue seconde — la rendant plus accessible, centrée sur l'apprenant et alignée sur les besoins évolutifs de la fonction publique du Canada.",
  },
  {
    title: "Value Proposition",
    titleFr: "Proposition de valeur",
    content: "Expert coaching that blends proven pedagogy with innovative technology, preparing public servants for official-language examinations with personalized, bilingual learning paths.",
    contentFr: "Un coaching expert qui allie une pédagogie éprouvée à une technologie innovante, préparant les fonctionnaires aux examens de langues officielles avec des parcours d'apprentissage bilingues personnalisés.",
  },
  {
    title: "Target Audience",
    titleFr: "Public cible",
    content: "Canadian federal public servants, language training departments, and organizations seeking to elevate bilingual capabilities across their workforce.",
    contentFr: "Les fonctionnaires fédéraux canadiens, les départements de formation linguistique et les organisations cherchant à élever les compétences bilingues de leur personnel.",
  },
  {
    title: "Ecosystem Overview",
    titleFr: "Aperçu de l'écosystème",
    content: "Three complementary brands — RusingÂcademy (SLE exam preparation), Lingueefy (personalized language programs), and Barholex Media (educational content & EdTech) — under Rusinga International Consulting Ltd.",
    contentFr: "Trois marques complémentaires — RusingÂcademy (préparation aux examens ELS), Lingueefy (programmes linguistiques personnalisés) et Barholex Media (contenu éducatif et EdTech) — sous Rusinga International Consulting Ltd.",
  },
  {
    title: "Key Differentiators",
    titleFr: "Différenciateurs clés",
    content: "AI-powered practice tools, certified bilingual coaches, WCAG AA accessible platform, Canadian-standard formatting, premium glassmorphism design, and government-aligned compliance.",
    contentFr: "Outils de pratique alimentés par l'IA, coachs bilingues certifiés, plateforme accessible WCAG AA, formatage aux normes canadiennes, design glassmorphisme premium et conformité alignée sur le gouvernement.",
  },
];

/* ── PressKit Component ── */
interface PressKitProps {
  className?: string;
}

export function PressKit({ className = "" }: PressKitProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<"messaging" | "assets" | "facts">("messaging");

  const labels = {
    en: {
      title: "Press Kit",
      subtitle: "Brand assets, key messaging, and media resources for the RusingÂcademy ecosystem",
      messaging: "Key Messaging",
      assets: "Brand Assets",
      facts: "Quick Facts",
      downloadAll: "Download All Assets",
      assetType: "Type",
      assetName: "Asset",
      description: "Description",
      founded: "Founded",
      foundedValue: "2024",
      headquarters: "Headquarters",
      headquartersValue: "Ottawa, Ontario, Canada",
      industry: "Industry",
      industryValue: "EdTech / Language Training",
      parentCompany: "Parent Company",
      parentCompanyValue: "Rusinga International Consulting Ltd.",
      platforms: "Platforms",
      platformsValue: "Web (responsive), Mobile-optimized",
      languages: "Languages",
      languagesValue: "English, French (Canadian)",
      compliance: "Compliance",
      complianceValue: "WCAG AA, Canadian Privacy Standards",
      targetMarket: "Target Market",
      targetMarketValue: "Canadian Federal Public Service",
    },
    fr: {
      title: "Dossier de presse",
      subtitle: "Actifs de marque, messages clés et ressources médias pour l'écosystème RusingÂcademy",
      messaging: "Messages clés",
      assets: "Actifs de marque",
      facts: "Faits rapides",
      downloadAll: "Télécharger tous les actifs",
      assetType: "Type",
      assetName: "Actif",
      description: "Description",
      founded: "Fondée",
      foundedValue: "2024",
      headquarters: "Siège social",
      headquartersValue: "Ottawa, Ontario, Canada",
      industry: "Industrie",
      industryValue: "EdTech / Formation linguistique",
      parentCompany: "Société mère",
      parentCompanyValue: "Rusinga International Consulting Ltd.",
      platforms: "Plateformes",
      platformsValue: "Web (réactif), Optimisé mobile",
      languages: "Langues",
      languagesValue: "Anglais, Français (canadien)",
      compliance: "Conformité",
      complianceValue: "WCAG AA, Normes canadiennes de confidentialité",
      targetMarket: "Marché cible",
      targetMarketValue: "Fonction publique fédérale du Canada",
    },
  };
  const t = labels[locale];

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
          {t.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
          {t.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[var(--section-bg-2)] p-1 dark:bg-[var(--dark-section-bg-2)]">
        {(["messaging", "assets", "facts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm dark:bg-[var(--dark-bg-base)] dark:text-[var(--dark-text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--dark-text-muted)] dark:hover:text-[var(--dark-text-secondary)]"
            }`}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {t[tab]}
          </button>
        ))}
      </div>

      {/* Key Messaging */}
      {activeTab === "messaging" && (
        <div className="space-y-4">
          {KEY_MESSAGES.map((msg, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-5 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
            >
              <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                {locale === "fr" ? msg.titleFr : msg.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                {locale === "fr" ? msg.contentFr : msg.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Brand Assets */}
      {activeTab === "assets" && (
        <div>
          <div className="mb-4 flex justify-end">
            <button className="rounded-lg bg-[var(--brand-foundation)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-foundation-2)] dark:bg-[var(--dark-brand-foundation)] dark:hover:bg-[var(--dark-brand-foundation-2)]">
              {t.downloadAll}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BRAND_ASSETS.map((asset, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-4 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
              >
                <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-[var(--section-bg-2)] dark:bg-[var(--dark-section-bg-2)]">
                  <span className="text-3xl">
                    {asset.type === "logo" ? "🏛️" : asset.type === "screenshot" ? "📸" : asset.type === "icon" ? "⭐" : "🎨"}
                  </span>
                </div>
                <h4 className="font-medium text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  {locale === "fr" ? asset.nameFr : asset.name}
                </h4>
                <p className="mt-1 text-xs text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
                  {locale === "fr" ? asset.descriptionFr : asset.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Facts */}
      {activeTab === "facts" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <tbody>
              {[
                { label: t.founded, value: t.foundedValue },
                { label: t.headquarters, value: t.headquartersValue },
                { label: t.industry, value: t.industryValue },
                { label: t.parentCompany, value: t.parentCompanyValue },
                { label: t.platforms, value: t.platformsValue },
                { label: t.languages, value: t.languagesValue },
                { label: t.compliance, value: t.complianceValue },
                { label: t.targetMarket, value: t.targetMarketValue },
              ].map((fact) => (
                <tr key={fact.label} className="border-b border-[var(--border-color-light)] dark:border-[rgba(255,255,255,0.05)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{fact.label}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{fact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PressKit;

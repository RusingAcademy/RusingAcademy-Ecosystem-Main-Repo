/**
 * ============================================
 * ECOSYSTEM HOME - PREMIUM UPGRADE (Wave 1)
 * ============================================
 * 
 * RusingAcademy Learning Ecosystem Home Page
 * Premium UI, Story-driven, MgCréa-inspired Hero
 */

import React from "react";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

// New Premium Components
import { PremiumHero } from "@/components/homepage/PremiumHero";
import { TrustBar } from "@/components/homepage/TrustBar";
import { StorySection } from "@/components/homepage/StorySection";
import { EcosystemPillars } from "@/components/homepage/EcosystemPillars";
import { PersonaPathways } from "@/components/homepage/PersonaPathways";
import { PremiumFinalCTA } from "@/components/homepage/PremiumFinalCTA";

// Content Data (Bilingual) - Preserving original content but adapting to new structure
const heroContent = {
  en: {
    badge: "Canada's Premier Bilingual Training Ecosystem",
    titleLine1: "CHOOSE",
    titleLine2: "YOUR",
    titleLine3: "PATH",
    subtitle: "To Bilingual Excellence",
    description: "Designed for Canadian public servants: SLE-focused learning, expert coaching, and premium media — for teams confident in both official languages.",
    cta1: "Book a Free Diagnostic",
    cta2: "Explore Programs",
    proof: "Over 2,000+ public servants trained",
  },
  fr: {
    badge: "L'écosystème de formation bilingue de référence au Canada",
    titleLine1: "CHOISISSEZ",
    titleLine2: "VOTRE",
    titleLine3: "PARCOURS",
    subtitle: "Vers l'Excellence Bilingue",
    description: "Conçu pour les fonctionnaires canadiens : apprentissage axé ELS, coaching d'experts et médias premium — pour des équipes confiantes dans les deux langues officielles.",
    cta1: "Réserver un diagnostic gratuit",
    cta2: "Explorer les programmes",
    proof: "Plus de 2 000 fonctionnaires formés",
  }
};

export default function EcosystemHome() {
  const { language } = useLanguage();
  const t = heroContent[language];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-obsidian">
      <SEO 
        title={language === 'fr' ? 'Écosystème RusingAcademy | Excellence Bilingue' : 'RusingAcademy Ecosystem | Bilingual Excellence'}
        description={t.description}
      />

      {/* WAVE 1: PREMIUM ARCHITECTURE */}
      
      {/* 1. Hero - MgCréa Style Glassmorphism */}
      <PremiumHero content={t} />

      {/* 2. Trust Bar - Logo Wall */}
      <TrustBar />

      {/* 3. The Promise - Story-driven Value Prop */}
      <StorySection />

      {/* 4. The Ecosystem - Product Clarity Pillars */}
      <EcosystemPillars />

      {/* 5. Persona Pathways - Entry points for B2G/B2B/B2C */}
      <PersonaPathways />

      {/* 6. Final CTA - High Conversion Closing */}
      <PremiumFinalCTA />

    </div>
  );
}

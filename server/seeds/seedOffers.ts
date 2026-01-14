/**
 * Seed Script: Create the 4 Structured Offers + Top-up Pack
 * 
 * Main Offers (ONE-TIME):
 * - BOOST SESSION (1h) - $67 CAD - 10 min/day AI - 3 months access
 * - QUICK PREP PLAN (5h) - $299 CAD - 15 min/day AI - 6 months access
 * - PROGRESSIVE PLAN (15h) - $899 CAD - 15 min/day AI - 12 months access
 * - MASTERY PROGRAM (30h) - $1,899 CAD - 30 min/day AI - 24 months access
 * 
 * Top-up Product:
 * - AI TOP-UP PACK 60 - $39 CAD - +60 minutes AI (no daily reset)
 */

import { getDb } from "../db";
import { offers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const OFFERS_DATA = [
  {
    code: "BOOST",
    type: "main" as const,
    nameEn: "Boost Session",
    nameFr: "Session Boost",
    descriptionEn: "Quick diagnosis of oral performance with immediate personalized feedback and targeted mini-simulation on weak spots.",
    descriptionFr: "Diagnostic rapide de votre performance orale avec rétroaction personnalisée immédiate et mini-simulation ciblée sur vos points faibles.",
    priceCad: 6700, // $67.00
    coachingMinutes: 60, // 1 hour
    aiDailyMinutes: 10, // 10 min/day AI Coach
    accessDurationMonths: 3, // 3 months access
    includesDiagnostic: true,
    includesLearningPlan: false,
    simulationsIncluded: 1,
    featuresEn: [
      "1 hour coaching",
      "1 simulation",
      "10 min/day AI Coach",
      "Quick diagnosis of oral performance",
      "Immediate personalized feedback",
      "Targeted mini-simulation on weak spots",
      "Professional assessment close to exam"
    ],
    featuresFr: [
      "1 heure de coaching",
      "1 simulation",
      "10 min/jour Coach IA",
      "Diagnostic rapide de la performance orale",
      "Rétroaction personnalisée immédiate",
      "Mini-simulation ciblée sur les points faibles",
      "Évaluation professionnelle proche de l'examen"
    ],
    idealForEn: "Quick clarity / professional feedback close to exam",
    idealForFr: "Clarté rapide / rétroaction professionnelle proche de l'examen",
    tags: ["Exam-focused", "Quick", "Professional"],
    sortOrder: 1,
  },
  {
    code: "QUICK",
    type: "main" as const,
    nameEn: "Quick Prep Plan",
    nameFr: "Plan Préparation Rapide",
    descriptionEn: "Diagnostic assessment to identify gaps, personalized learning plan with focused themes, and one full oral exam simulation with feedback.",
    descriptionFr: "Évaluation diagnostique pour identifier les lacunes, plan d'apprentissage personnalisé avec thèmes ciblés, et une simulation complète d'examen oral avec rétroaction.",
    priceCad: 29900, // $299.00
    coachingMinutes: 300, // 5 hours
    aiDailyMinutes: 15, // 15 min/day AI Coach
    accessDurationMonths: 6, // 6 months access
    includesDiagnostic: true,
    includesLearningPlan: true,
    simulationsIncluded: 1,
    featuresEn: [
      "5 hours coaching",
      "1 simulation",
      "15 min/day AI Coach",
      "Diagnostic assessment to identify gaps",
      "Personalized learning plan with focused themes",
      "One full oral exam simulation with feedback",
      "6 months access"
    ],
    featuresFr: [
      "5 heures de coaching",
      "1 simulation",
      "15 min/jour Coach IA",
      "Évaluation diagnostique pour identifier les lacunes",
      "Plan d'apprentissage personnalisé avec thèmes ciblés",
      "Une simulation complète d'examen oral avec rétroaction",
      "6 mois d'accès"
    ],
    idealForEn: "2–3 weeks timeline",
    idealForFr: "Échéancier de 2 à 3 semaines",
    tags: ["Exam-focused", "Structured", "Short-term"],
    sortOrder: 2,
  },
  {
    code: "PROGRESSIVE",
    type: "main" as const,
    nameEn: "Progressive Plan",
    nameFr: "Plan Progressif",
    descriptionEn: "Comprehensive learning plan with milestones, weekly progress assessments & feedback loops, and multiple targeted oral exam simulations.",
    descriptionFr: "Plan d'apprentissage complet avec jalons, évaluations hebdomadaires des progrès et boucles de rétroaction, et plusieurs simulations d'examen oral ciblées.",
    priceCad: 89900, // $899.00
    coachingMinutes: 900, // 15 hours
    aiDailyMinutes: 15, // 15 min/day AI Coach
    accessDurationMonths: 12, // 12 months access
    includesDiagnostic: true,
    includesLearningPlan: true,
    simulationsIncluded: 3,
    featuresEn: [
      "15 hours coaching",
      "3 simulations",
      "15 min/day AI Coach",
      "Comprehensive learning plan with milestones",
      "Weekly progress assessments & feedback loops",
      "Multiple targeted oral exam simulations",
      "Level B or C preparation",
      "12 months access"
    ],
    featuresFr: [
      "15 heures de coaching",
      "3 simulations",
      "15 min/jour Coach IA",
      "Plan d'apprentissage complet avec jalons",
      "Évaluations hebdomadaires et boucles de rétroaction",
      "Plusieurs simulations d'examen oral ciblées",
      "Préparation niveau B ou C",
      "12 mois d'accès"
    ],
    idealForEn: "Level B or C over 8–12 weeks",
    idealForFr: "Niveau B ou C sur 8 à 12 semaines",
    tags: ["Exam-focused", "Structured", "Executive-grade"],
    sortOrder: 3,
  },
  {
    code: "MASTERY",
    type: "main" as const,
    nameEn: "Mastery Program",
    nameFr: "Programme Maîtrise",
    descriptionEn: "30-Hour Confidence System™ with fully personalized bilingual roadmap, multiple exam simulations with real-time coaching, and exclusive Speaking Skeleton™ Framework.",
    descriptionFr: "Système de Confiance 30 heures™ avec feuille de route bilingue entièrement personnalisée, simulations d'examen multiples avec coaching en temps réel, et cadre exclusif Speaking Skeleton™.",
    priceCad: 189900, // $1,899.00
    coachingMinutes: 1800, // 30 hours
    aiDailyMinutes: 30, // 30 min/day AI Coach
    accessDurationMonths: 24, // 24 months access
    includesDiagnostic: true,
    includesLearningPlan: true,
    simulationsIncluded: 6,
    featuresEn: [
      "30 hours coaching",
      "6 simulations",
      "30 min/day AI Coach",
      "30-Hour Confidence System™",
      "Fully personalized bilingual roadmap",
      "Multiple exam simulations with real-time coaching",
      "Exclusive Speaking Skeleton™ Framework",
      "Confidence & performance readiness guarantee",
      "24 months access"
    ],
    featuresFr: [
      "30 heures de coaching",
      "6 simulations",
      "30 min/jour Coach IA",
      "Système de Confiance 30 heures™",
      "Feuille de route bilingue entièrement personnalisée",
      "Simulations d'examen multiples avec coaching en temps réel",
      "Cadre exclusif Speaking Skeleton™",
      "Garantie de confiance et de préparation à la performance",
      "24 mois d'accès"
    ],
    idealForEn: "Long-term mastery / promotion readiness",
    idealForFr: "Maîtrise à long terme / préparation à la promotion",
    tags: ["Exam-focused", "Structured", "Executive-grade", "Premium"],
    sortOrder: 4,
  },
  // TOP-UP PRODUCT
  {
    code: "AI_TOPUP_60",
    type: "topup" as const,
    nameEn: "AI Top-up Pack",
    nameFr: "Forfait Top-up IA",
    descriptionEn: "+60 minutes of AI Coach time. Use when your daily quota is exhausted.",
    descriptionFr: "+60 minutes de temps Coach IA. À utiliser lorsque votre quota quotidien est épuisé.",
    priceCad: 3900, // $39.00
    coachingMinutes: 0, // No human coaching
    aiDailyMinutes: 0, // Not a daily quota - this is a one-time top-up
    topupMinutes: 60, // +60 minutes top-up
    accessDurationMonths: 12, // 12 months validity for top-up
    includesDiagnostic: false,
    includesLearningPlan: false,
    simulationsIncluded: 0,
    featuresEn: [
      "+60 minutes AI Coach",
      "No daily reset",
      "Use anytime",
      "12 months validity"
    ],
    featuresFr: [
      "+60 minutes Coach IA",
      "Pas de réinitialisation quotidienne",
      "Utilisable à tout moment",
      "Validité 12 mois"
    ],
    idealForEn: "Extra AI time when daily quota is exhausted",
    idealForFr: "Temps IA supplémentaire lorsque le quota quotidien est épuisé",
    tags: ["Top-up", "AI Coach", "Flexible"],
    sortOrder: 10,
  },
];

export async function seedOffers() {
  const db = await getDb();
  if (!db) {
    console.error("[Seed] Database not available");
    return;
  }
  
  console.log("[Seed] Starting offers seed...");
  
  for (const offerData of OFFERS_DATA) {
    // Check if offer already exists
    const existing = await db.query.offers.findFirst({
      where: eq(offers.code, offerData.code),
    });
    
    if (existing) {
      console.log(`[Seed] Offer ${offerData.code} already exists, updating...`);
      await db.update(offers)
        .set({
          nameEn: offerData.nameEn,
          nameFr: offerData.nameFr,
          descriptionEn: offerData.descriptionEn,
          descriptionFr: offerData.descriptionFr,
          priceCad: offerData.priceCad,
          coachingMinutes: offerData.coachingMinutes,
          includesDiagnostic: offerData.includesDiagnostic,
          includesLearningPlan: offerData.includesLearningPlan,
          simulationsIncluded: offerData.simulationsIncluded,
          featuresEn: JSON.stringify(offerData.featuresEn),
          featuresFr: JSON.stringify(offerData.featuresFr),
          idealForEn: offerData.idealForEn,
          idealForFr: offerData.idealForFr,
          tags: JSON.stringify(offerData.tags),
          sortOrder: offerData.sortOrder,
        })
        .where(eq(offers.code, offerData.code));
    } else {
      console.log(`[Seed] Creating offer ${offerData.code}...`);
      await db.insert(offers).values({
        code: offerData.code,
        nameEn: offerData.nameEn,
        nameFr: offerData.nameFr,
        descriptionEn: offerData.descriptionEn,
        descriptionFr: offerData.descriptionFr,
        priceCad: offerData.priceCad,
        coachingMinutes: offerData.coachingMinutes,
        includesDiagnostic: offerData.includesDiagnostic,
        includesLearningPlan: offerData.includesLearningPlan,
        simulationsIncluded: offerData.simulationsIncluded,
        featuresEn: JSON.stringify(offerData.featuresEn),
        featuresFr: JSON.stringify(offerData.featuresFr),
        idealForEn: offerData.idealForEn,
        idealForFr: offerData.idealForFr,
        tags: JSON.stringify(offerData.tags),
        sortOrder: offerData.sortOrder,
        active: true,
        productArea: "lingueefy",
        currency: "CAD",
      });
    }
  }
  
  console.log("[Seed] Offers seed completed!");
}

// Export offer codes for use elsewhere
export const OFFER_CODES = {
  BOOST: "BOOST",
  QUICK: "QUICK",
  PROGRESSIVE: "PROGRESSIVE",
  MASTERY: "MASTERY",
  AI_TOPUP_60: "AI_TOPUP_60",
} as const;

export type OfferCode = keyof typeof OFFER_CODES;

// AI Daily Minutes mapping
export const AI_DAILY_MINUTES: Record<string, number> = {
  BOOST: 10,
  QUICK: 15,
  PROGRESSIVE: 15,
  MASTERY: 30,
};

// Access duration in months
export const ACCESS_DURATION_MONTHS: Record<string, number> = {
  BOOST: 3,
  QUICK: 6,
  PROGRESSIVE: 12,
  MASTERY: 24,
};

// Top-up minutes
export const TOPUP_MINUTES: Record<string, number> = {
  AI_TOPUP_60: 60,
};

/**
 * Seed Script: Create the 4 Structured Offers
 * 
 * This script seeds the offers table with the 4 coaching packages:
 * - BOOST SESSION (1h) - $67 CAD
 * - QUICK PREP PLAN (5h) - $299 CAD
 * - PROGRESSIVE PLAN (15h) - $899 CAD
 * - MASTERY PROGRAM (30h) - $1,899 CAD
 */

import { db } from "../db";
import { offers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const OFFERS_DATA = [
  {
    code: "BOOST",
    nameEn: "Boost Session",
    nameFr: "Session Boost",
    descriptionEn: "Quick diagnosis of oral performance with immediate personalized feedback and targeted mini-simulation on weak spots.",
    descriptionFr: "Diagnostic rapide de votre performance orale avec rétroaction personnalisée immédiate et mini-simulation ciblée sur vos points faibles.",
    priceCad: 6700, // $67.00
    coachingMinutes: 60, // 1 hour
    includesDiagnostic: true,
    includesLearningPlan: false,
    simulationsIncluded: 1,
    featuresEn: [
      "Quick diagnosis of oral performance",
      "Immediate personalized feedback",
      "Targeted mini-simulation on weak spots",
      "Professional assessment close to exam"
    ],
    featuresFr: [
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
    nameEn: "Quick Prep Plan",
    nameFr: "Plan Préparation Rapide",
    descriptionEn: "Diagnostic assessment to identify gaps, personalized learning plan with focused themes, and one full oral exam simulation with feedback.",
    descriptionFr: "Évaluation diagnostique pour identifier les lacunes, plan d'apprentissage personnalisé avec thèmes ciblés, et une simulation complète d'examen oral avec rétroaction.",
    priceCad: 29900, // $299.00
    coachingMinutes: 300, // 5 hours
    includesDiagnostic: true,
    includesLearningPlan: true,
    simulationsIncluded: 1,
    featuresEn: [
      "Diagnostic assessment to identify gaps",
      "Personalized learning plan with focused themes",
      "One full oral exam simulation with feedback",
      "5 hours of expert coaching"
    ],
    featuresFr: [
      "Évaluation diagnostique pour identifier les lacunes",
      "Plan d'apprentissage personnalisé avec thèmes ciblés",
      "Une simulation complète d'examen oral avec rétroaction",
      "5 heures de coaching expert"
    ],
    idealForEn: "2–3 weeks timeline",
    idealForFr: "Échéancier de 2 à 3 semaines",
    tags: ["Exam-focused", "Structured", "Short-term"],
    sortOrder: 2,
  },
  {
    code: "PROGRESSIVE",
    nameEn: "Progressive Plan",
    nameFr: "Plan Progressif",
    descriptionEn: "Comprehensive learning plan with milestones, weekly progress assessments & feedback loops, and multiple targeted oral exam simulations.",
    descriptionFr: "Plan d'apprentissage complet avec jalons, évaluations hebdomadaires des progrès et boucles de rétroaction, et plusieurs simulations d'examen oral ciblées.",
    priceCad: 89900, // $899.00
    coachingMinutes: 900, // 15 hours
    includesDiagnostic: true,
    includesLearningPlan: true,
    simulationsIncluded: 3,
    featuresEn: [
      "Comprehensive learning plan with milestones",
      "Weekly progress assessments & feedback loops",
      "Multiple targeted oral exam simulations",
      "15 hours of expert coaching",
      "Level B or C preparation"
    ],
    featuresFr: [
      "Plan d'apprentissage complet avec jalons",
      "Évaluations hebdomadaires et boucles de rétroaction",
      "Plusieurs simulations d'examen oral ciblées",
      "15 heures de coaching expert",
      "Préparation niveau B ou C"
    ],
    idealForEn: "Level B or C over 8–12 weeks",
    idealForFr: "Niveau B ou C sur 8 à 12 semaines",
    tags: ["Exam-focused", "Structured", "Executive-grade"],
    sortOrder: 3,
  },
  {
    code: "MASTERY",
    nameEn: "Mastery Program",
    nameFr: "Programme Maîtrise",
    descriptionEn: "30-Hour Confidence System™ with fully personalized bilingual roadmap, multiple exam simulations with real-time coaching, and exclusive Speaking Skeleton™ Framework.",
    descriptionFr: "Système de Confiance 30 heures™ avec feuille de route bilingue entièrement personnalisée, simulations d'examen multiples avec coaching en temps réel, et cadre exclusif Speaking Skeleton™.",
    priceCad: 189900, // $1,899.00
    coachingMinutes: 1800, // 30 hours
    includesDiagnostic: true,
    includesLearningPlan: true,
    simulationsIncluded: 6,
    featuresEn: [
      "30-Hour Confidence System™",
      "Fully personalized bilingual roadmap",
      "Multiple exam simulations with real-time coaching",
      "Exclusive Speaking Skeleton™ Framework",
      "Confidence & performance readiness guarantee"
    ],
    featuresFr: [
      "Système de Confiance 30 heures™",
      "Feuille de route bilingue entièrement personnalisée",
      "Simulations d'examen multiples avec coaching en temps réel",
      "Cadre exclusif Speaking Skeleton™",
      "Garantie de confiance et de préparation à la performance"
    ],
    idealForEn: "Long-term mastery / promotion readiness",
    idealForFr: "Maîtrise à long terme / préparation à la promotion",
    tags: ["Exam-focused", "Structured", "Executive-grade", "Premium"],
    sortOrder: 4,
  },
];

export async function seedOffers() {
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
          ...offerData,
          featuresEn: JSON.stringify(offerData.featuresEn),
          featuresFr: JSON.stringify(offerData.featuresFr),
          tags: JSON.stringify(offerData.tags),
        })
        .where(eq(offers.code, offerData.code));
    } else {
      console.log(`[Seed] Creating offer ${offerData.code}...`);
      await db.insert(offers).values({
        ...offerData,
        featuresEn: JSON.stringify(offerData.featuresEn),
        featuresFr: JSON.stringify(offerData.featuresFr),
        tags: JSON.stringify(offerData.tags),
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
} as const;

export type OfferCode = keyof typeof OFFER_CODES;

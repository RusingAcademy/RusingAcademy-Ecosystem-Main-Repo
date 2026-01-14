/**
 * Centralized KPI/Claims constants - Single source of truth
 * Sprint 1: KPI Unification
 */

export const KPI = {
  coaches: {
    count: 14,
    label: {
      en: "14+ Certified Coaches",
      fr: "14+ Coachs certifiés",
    },
  },
  learners: {
    count: 2500,
    label: {
      en: "2500+ Learners",
      fr: "2500+ Apprenants",
    },
  },
  ambition: {
    coaches2027: 500,
    label: {
      en: "Ambition: 500 coaches by 2027",
      fr: "Ambition : 500 coachs d'ici 2027",
    },
  },
} as const;

export type Language = 'en' | 'fr';

export function getKPILabel(key: keyof typeof KPI, language: Language): string {
  return KPI[key].label[language];
}

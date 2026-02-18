/**
 * ============================================
 * CASE STUDY SECTION — Full Case Studies Display
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * Displays 3-5 detailed case studies with expandable
 * challenge/solution/result format.
 */
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CASE_STUDIES } from "@/lib/month5/testimonial-data";
import { CaseStudyCard } from "./CaseStudyCard";

interface CaseStudySectionProps {
  maxItems?: number;
  filterTag?: string;
  className?: string;
}

export function CaseStudySection({
  maxItems = 4,
  filterTag,
  className = "",
}: CaseStudySectionProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";

  const items = filterTag
    ? CASE_STUDIES.filter(cs => cs.personaTag === filterTag).slice(0, maxItems)
    : CASE_STUDIES.slice(0, maxItems);

  const title = lang === "fr"
    ? "Histoires de réussite"
    : "Success Stories";
  const subtitle = lang === "fr"
    ? "Des fonctionnaires fédéraux comme vous qui ont atteint leurs objectifs linguistiques avec RusingAcademy"
    : "Federal public servants like you who achieved their language goals with RusingAcademy";

  return (
    <section className={`py-16 md:py-24 ${className}`} aria-labelledby="case-studies-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            id="case-studies-title"
            className="text-3xl md:text-4xl font-bold text-[var(--brand-foundation)] mb-3"
          >
            {title}
          </h2>
          <p className="text-lg text-[var(--sage-primary)] max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="space-y-8">
          {items.map((cs, i) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              defaultExpanded={i === 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudySection;

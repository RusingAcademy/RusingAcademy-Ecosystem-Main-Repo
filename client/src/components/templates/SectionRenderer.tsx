/**
 * SectionRenderer — Maps section types to template components
 * Used by both the admin editor (editable) and public page (read-only).
 */
import { HeroTemplate } from "./HeroTemplate";
import { FeaturesTemplate } from "./FeaturesTemplate";
import { PricingTemplate } from "./PricingTemplate";
import { TestimonialsTemplate } from "./TestimonialsTemplate";
import { CTATemplate } from "./CTATemplate";
import type { LandingPageSection } from "../../../../drizzle/landing-pages-schema";

interface SectionRendererProps {
  section: LandingPageSection;
  editable?: boolean;
  onChange?: (content: Record<string, any>) => void;
  lang?: string;
}

export function SectionRenderer({ section, editable, onChange, lang }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroTemplate content={section.content as any} editable={editable} onChange={onChange as any} lang={lang} />;
    case "features":
      return <FeaturesTemplate content={section.content as any} editable={editable} onChange={onChange as any} lang={lang} />;
    case "pricing":
      return <PricingTemplate content={section.content as any} editable={editable} onChange={onChange as any} lang={lang} />;
    case "testimonials":
      return <TestimonialsTemplate content={section.content as any} editable={editable} onChange={onChange as any} lang={lang} />;
    case "cta":
      return <CTATemplate content={section.content as any} editable={editable} onChange={onChange as any} lang={lang} />;
    case "text":
      return (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-lg" dangerouslySetInnerHTML={{ __html: section.content.html || "" }} />
        </section>
      );
    default:
      return null;
  }
}

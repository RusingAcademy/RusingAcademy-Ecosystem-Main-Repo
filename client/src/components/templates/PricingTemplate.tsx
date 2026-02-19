/**
 * PricingTemplate — Landing Page Pricing Cards Template
 */
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  nameFr?: string;
  price: string;
  period?: string;
  periodFr?: string;
  features: string[];
  featuresFr?: string[];
  ctaText: string;
  ctaTextFr?: string;
  ctaLink: string;
  highlighted?: boolean;
}

interface PricingContent {
  heading: string;
  headingFr?: string;
  subheading?: string;
  subheadingFr?: string;
  tiers: PricingTier[];
}

interface PricingTemplateProps {
  content: PricingContent;
  editable?: boolean;
  onChange?: (content: PricingContent) => void;
  lang?: string;
}

export function PricingTemplate({ content, lang = "en" }: PricingTemplateProps) {
  const heading = lang === "fr" && content.headingFr ? content.headingFr : content.heading;
  const subheading = lang === "fr" && content.subheadingFr ? content.subheadingFr : content.subheading;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{heading}</h2>
        {subheading && <p className="text-lg text-gray-600 mb-12">{subheading}</p>}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(content.tiers.length, 3)} gap-8 max-w-4xl mx-auto`}>
          {content.tiers.map((tier, i) => {
            const name = lang === "fr" && tier.nameFr ? tier.nameFr : tier.name;
            const period = lang === "fr" && tier.periodFr ? tier.periodFr : tier.period;
            const features = lang === "fr" && tier.featuresFr?.length ? tier.featuresFr : tier.features;
            const ctaText = lang === "fr" && tier.ctaTextFr ? tier.ctaTextFr : tier.ctaText;
            return (
              <div
                key={i}
                className={`p-8 rounded-2xl border-2 ${
                  tier.highlighted
                    ? "border-[var(--brand-gold,#D4AF37)] shadow-lg scale-105"
                    : "border-gray-200"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <div className="text-4xl font-bold mb-1">{tier.price}</div>
                {period && <p className="text-gray-500 text-sm mb-6">{period}</p>}
                <ul className="text-left space-y-3 mb-8">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.ctaLink}
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity hover:opacity-90 ${
                    tier.highlighted
                      ? "bg-[var(--brand-gold,#D4AF37)] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {ctaText}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

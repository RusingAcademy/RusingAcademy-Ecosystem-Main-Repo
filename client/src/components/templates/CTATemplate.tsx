/**
 * CTATemplate — Landing Page Call-to-Action Section Template
 */
interface CTAContent {
  heading: string;
  headingFr?: string;
  subheading?: string;
  subheadingFr?: string;
  ctaText: string;
  ctaTextFr?: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaTextFr?: string;
  secondaryCtaLink?: string;
  backgroundColor?: string;
}

interface CTATemplateProps {
  content: CTAContent;
  editable?: boolean;
  onChange?: (content: CTAContent) => void;
  lang?: string;
}

export function CTATemplate({ content, lang = "en" }: CTATemplateProps) {
  const heading = lang === "fr" && content.headingFr ? content.headingFr : content.heading;
  const subheading = lang === "fr" && content.subheadingFr ? content.subheadingFr : content.subheading;
  const ctaText = lang === "fr" && content.ctaTextFr ? content.ctaTextFr : content.ctaText;
  const secondaryCtaText = lang === "fr" && content.secondaryCtaTextFr ? content.secondaryCtaTextFr : content.secondaryCtaText;

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: content.backgroundColor ?? "var(--accent-purple-deep, #1a0533)" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>
        {subheading && <p className="text-lg text-gray-300 mb-8">{subheading}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={content.ctaLink}
            className="inline-block px-8 py-3 bg-[var(--brand-gold,#D4AF37)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {ctaText}
          </a>
          {content.secondaryCtaLink && secondaryCtaText && (
            <a
              href={content.secondaryCtaLink}
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

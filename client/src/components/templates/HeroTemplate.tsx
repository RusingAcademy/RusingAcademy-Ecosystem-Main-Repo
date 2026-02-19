/**
 * HeroTemplate — Landing Page Hero Section Template
 * Supports editable mode for admin builder and read-only for public rendering.
 */
interface HeroContent {
  headline: string;
  headlineFr?: string;
  subheadline: string;
  subheadlineFr?: string;
  ctaText: string;
  ctaTextFr?: string;
  ctaLink: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

interface HeroTemplateProps {
  content: HeroContent;
  editable?: boolean;
  onChange?: (content: HeroContent) => void;
  lang?: string;
}

export function HeroTemplate({ content, editable, onChange, lang = "en" }: HeroTemplateProps) {
  const headline = lang === "fr" && content.headlineFr ? content.headlineFr : content.headline;
  const subheadline = lang === "fr" && content.subheadlineFr ? content.subheadlineFr : content.subheadline;
  const ctaText = lang === "fr" && content.ctaTextFr ? content.ctaTextFr : content.ctaText;

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined }}
    >
      {content.backgroundImage && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: content.overlayOpacity ?? 0.4 }}
        />
      )}
      <div className="relative z-10 text-center max-w-3xl px-4">
        {editable ? (
          <input
            className="text-4xl md:text-6xl font-bold mb-4 bg-transparent border-b-2 border-dashed w-full text-center"
            value={content.headline}
            onChange={(e) => onChange?.({ ...content, headline: e.target.value })}
          />
        ) : (
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            {headline}
          </h1>
        )}
        {editable ? (
          <input
            className="text-xl md:text-2xl mb-8 bg-transparent border-b border-dashed w-full text-center"
            value={content.subheadline}
            onChange={(e) => onChange?.({ ...content, subheadline: e.target.value })}
          />
        ) : (
          <p className="text-xl md:text-2xl text-gray-200 mb-8">{subheadline}</p>
        )}
        <a
          href={content.ctaLink}
          className="inline-block px-8 py-3 bg-[var(--brand-gold,#D4AF37)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}

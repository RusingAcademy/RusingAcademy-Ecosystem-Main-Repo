/**
 * FeaturesTemplate — Landing Page Features Grid Template
 */
import { CheckCircle } from "lucide-react";

interface FeatureItem {
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  icon?: string;
}

interface FeaturesContent {
  heading: string;
  headingFr?: string;
  subheading?: string;
  subheadingFr?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

interface FeaturesTemplateProps {
  content: FeaturesContent;
  editable?: boolean;
  onChange?: (content: FeaturesContent) => void;
  lang?: string;
}

export function FeaturesTemplate({ content, editable, onChange, lang = "en" }: FeaturesTemplateProps) {
  const heading = lang === "fr" && content.headingFr ? content.headingFr : content.heading;
  const subheading = lang === "fr" && content.subheadingFr ? content.subheadingFr : content.subheading;
  const cols = content.columns ?? 3;
  const gridCols = cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {editable ? (
          <input
            className="text-3xl font-bold mb-4 bg-transparent border-b-2 border-dashed w-full text-center"
            value={content.heading}
            onChange={(e) => onChange?.({ ...content, heading: e.target.value })}
          />
        ) : (
          <h2 className="text-3xl font-bold mb-4">{heading}</h2>
        )}
        {subheading && <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">{subheading}</p>}
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {content.features.map((feature, i) => {
            const title = lang === "fr" && feature.titleFr ? feature.titleFr : feature.title;
            const desc = lang === "fr" && feature.descriptionFr ? feature.descriptionFr : feature.description;
            return (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="w-8 h-8 text-[var(--brand-gold,#D4AF37)] mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

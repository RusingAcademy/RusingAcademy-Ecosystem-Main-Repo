/**
 * TestimonialsTemplate — Landing Page Testimonials Template
 */
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role?: string;
  roleFr?: string;
  quote: string;
  quoteFr?: string;
  rating?: number;
  avatarUrl?: string;
}

interface TestimonialsContent {
  heading: string;
  headingFr?: string;
  testimonials: Testimonial[];
}

interface TestimonialsTemplateProps {
  content: TestimonialsContent;
  editable?: boolean;
  onChange?: (content: TestimonialsContent) => void;
  lang?: string;
}

export function TestimonialsTemplate({ content, lang = "en" }: TestimonialsTemplateProps) {
  const heading = lang === "fr" && content.headingFr ? content.headingFr : content.heading;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.testimonials.map((t, i) => {
            const quote = lang === "fr" && t.quoteFr ? t.quoteFr : t.quote;
            const role = lang === "fr" && t.roleFr ? t.roleFr : t.role;
            return (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                {t.rating && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
                <blockquote className="text-gray-700 mb-4 italic">"{quote}"</blockquote>
                <div className="flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-gold,#D4AF37)] flex items-center justify-center text-white font-bold">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    {role && <p className="text-xs text-gray-500">{role}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================
 * BILINGUAL EMAIL TEMPLATES — Preview Components
 * ============================================
 * Month 5: Content Strategy & Conversion
 * 
 * React components that render email template previews.
 * These serve as both visual previews and HTML generators
 * for email marketing platform integration.
 */
import { useLanguage } from "@/contexts/LanguageContext";

export type EmailTemplateType = "welcome" | "lead-magnet" | "nurture-1" | "nurture-2" | "assessment-reminder";

interface EmailTemplateProps {
  type: EmailTemplateType;
  recipientName?: string;
  className?: string;
}

const TEMPLATES: Record<EmailTemplateType, {
  subject: { en: string; fr: string };
  preheader: { en: string; fr: string };
  heading: { en: string; fr: string };
  body: { en: string[]; fr: string[] };
  ctaText: { en: string; fr: string };
  ctaUrl: string;
}> = {
  welcome: {
    subject: {
      en: "Welcome to RusingAcademy — Your Bilingual Journey Starts Here",
      fr: "Bienvenue à RusingAcademy — Votre parcours bilingue commence ici",
    },
    preheader: {
      en: "You've taken the first step toward bilingual excellence.",
      fr: "Vous avez fait le premier pas vers l'excellence bilingue.",
    },
    heading: {
      en: "Welcome to RusingAcademy!",
      fr: "Bienvenue à RusingAcademy !",
    },
    body: {
      en: [
        "Thank you for joining the RusingAcademy community. You've taken an important step toward achieving your language goals.",
        "As a public servant, we understand the unique challenges you face in preparing for your SLE exams. That's why our programs are designed specifically for the federal context.",
        "Here's what you can expect from us: personalized coaching from certified instructors, AI-powered practice tools available 24/7, and a proven methodology that has helped 500+ public servants achieve their target levels.",
      ],
      fr: [
        "Merci de rejoindre la communauté RusingAcademy. Vous avez franchi une étape importante vers l'atteinte de vos objectifs linguistiques.",
        "En tant que fonctionnaire, nous comprenons les défis uniques auxquels vous faites face dans la préparation de vos examens de l'ELS. C'est pourquoi nos programmes sont conçus spécifiquement pour le contexte fédéral.",
        "Voici ce que vous pouvez attendre de nous : un coaching personnalisé par des instructeurs certifiés, des outils de pratique alimentés par l'IA disponibles 24/7, et une méthodologie éprouvée qui a aidé plus de 500 fonctionnaires à atteindre leurs niveaux cibles.",
      ],
    },
    ctaText: {
      en: "Book Your Free Assessment",
      fr: "Réservez votre évaluation gratuite",
    },
    ctaUrl: "/assessment",
  },
  "lead-magnet": {
    subject: {
      en: "Your Free SLE Preparation Resource is Ready",
      fr: "Votre ressource gratuite de préparation à l'ELS est prête",
    },
    preheader: {
      en: "Download your resource and start preparing today.",
      fr: "Téléchargez votre ressource et commencez votre préparation aujourd'hui.",
    },
    heading: {
      en: "Your Resource is Ready!",
      fr: "Votre ressource est prête !",
    },
    body: {
      en: [
        "Thank you for your interest in our SLE preparation resources. Your download is ready — click the button below to access it.",
        "This resource was developed by our team of certified language instructors and former SLE evaluators, drawing on years of experience helping public servants succeed.",
        "For the best results, we recommend combining this resource with a personalized coaching session. Our free assessment will help us understand your current level and create a tailored study plan.",
      ],
      fr: [
        "Merci de votre intérêt pour nos ressources de préparation à l'ELS. Votre téléchargement est prêt — cliquez sur le bouton ci-dessous pour y accéder.",
        "Cette ressource a été développée par notre équipe d'instructeurs linguistiques certifiés et d'anciens évaluateurs de l'ELS, s'appuyant sur des années d'expérience pour aider les fonctionnaires à réussir.",
        "Pour de meilleurs résultats, nous recommandons de combiner cette ressource avec une séance de coaching personnalisée. Notre évaluation gratuite nous aidera à comprendre votre niveau actuel et à créer un plan d'étude sur mesure.",
      ],
    },
    ctaText: {
      en: "Download Your Resource",
      fr: "Téléchargez votre ressource",
    },
    ctaUrl: "/resources",
  },
  "nurture-1": {
    subject: {
      en: "3 Common SLE Mistakes (And How to Avoid Them)",
      fr: "3 erreurs courantes à l'ELS (et comment les éviter)",
    },
    preheader: {
      en: "Don't make these mistakes on exam day.",
      fr: "Ne faites pas ces erreurs le jour de l'examen.",
    },
    heading: {
      en: "Avoid These 3 Common SLE Mistakes",
      fr: "Évitez ces 3 erreurs courantes à l'ELS",
    },
    body: {
      en: [
        "After coaching 500+ public servants through their SLE exams, we've identified the three most common mistakes that cost candidates their target levels.",
        "Mistake #1: Preparing with generic language materials instead of SLE-specific content. The SLE tests specific competencies — your preparation should target them directly.",
        "Mistake #2: Neglecting the oral component until the last minute. Oral fluency requires consistent daily practice, not a last-week cram session.",
        "Mistake #3: Not understanding the difference between B and C level expectations. Each level has distinct criteria — knowing them is half the battle.",
      ],
      fr: [
        "Après avoir accompagné plus de 500 fonctionnaires dans leurs examens de l'ELS, nous avons identifié les trois erreurs les plus courantes qui coûtent aux candidats leurs niveaux cibles.",
        "Erreur n°1 : Se préparer avec du matériel linguistique générique au lieu de contenu spécifique à l'ELS. L'ELS teste des compétences spécifiques — votre préparation devrait les cibler directement.",
        "Erreur n°2 : Négliger la composante orale jusqu'à la dernière minute. La fluidité orale nécessite une pratique quotidienne constante, pas une session intensive de dernière semaine.",
        "Erreur n°3 : Ne pas comprendre la différence entre les attentes des niveaux B et C. Chaque niveau a des critères distincts — les connaître, c'est déjà la moitié du chemin.",
      ],
    },
    ctaText: {
      en: "Get Your Personalized Study Plan",
      fr: "Obtenez votre plan d'étude personnalisé",
    },
    ctaUrl: "/assessment",
  },
  "nurture-2": {
    subject: {
      en: "How Marie-Claire Went from Failing to BBB in 8 Weeks",
      fr: "Comment Marie-Claire est passée de l'échec au BBB en 8 semaines",
    },
    preheader: {
      en: "A real success story from a public servant like you.",
      fr: "Une vraie histoire de réussite d'une fonctionnaire comme vous.",
    },
    heading: {
      en: "From Failing to BBB in 8 Weeks",
      fr: "De l'échec au BBB en 8 semaines",
    },
    body: {
      en: [
        "Marie-Claire, a Policy Analyst at the Treasury Board Secretariat, had failed her SLE oral exam twice. She was ready to give up on bilingual positions entirely.",
        "Then she discovered RusingAcademy. Our diagnostic approach identified exactly where she was losing marks — hesitation patterns during opinion questions and inconsistent formal register.",
        "With targeted coaching and daily AI companion practice, Marie-Claire achieved BBB on her third attempt, scoring well above the threshold. She was promoted to Senior Policy Advisor within 4 months.",
        "\"RusingAcademy didn't just help me pass — they helped me understand why I was failing. That made all the difference.\" — Marie-Claire D.",
      ],
      fr: [
        "Marie-Claire, analyste de politiques au Secrétariat du Conseil du Trésor, avait échoué deux fois à son examen oral de l'ELS. Elle était prête à abandonner complètement les postes bilingues.",
        "Puis elle a découvert RusingAcademy. Notre approche diagnostique a identifié exactement où elle perdait des points — des schémas d'hésitation lors des questions d'opinion et une utilisation incohérente du registre formel.",
        "Avec un coaching ciblé et une pratique quotidienne avec le compagnon IA, Marie-Claire a obtenu BBB à sa troisième tentative, avec un score bien au-dessus du seuil. Elle a été promue Conseillère principale en politiques dans les 4 mois suivants.",
        "« RusingAcademy ne m'a pas seulement aidée à réussir — ils m'ont aidée à comprendre pourquoi j'échouais. Cela a fait toute la différence. » — Marie-Claire D.",
      ],
    },
    ctaText: {
      en: "Start Your Success Story",
      fr: "Commencez votre histoire de réussite",
    },
    ctaUrl: "/assessment",
  },
  "assessment-reminder": {
    subject: {
      en: "Your Free Assessment is Waiting — Don't Miss Out",
      fr: "Votre évaluation gratuite vous attend — Ne manquez pas cette occasion",
    },
    preheader: {
      en: "Take 15 minutes to discover your current level.",
      fr: "Prenez 15 minutes pour découvrir votre niveau actuel.",
    },
    heading: {
      en: "Your Free Assessment Awaits",
      fr: "Votre évaluation gratuite vous attend",
    },
    body: {
      en: [
        "We noticed you haven't completed your free language assessment yet. This 15-minute session with one of our expert coaches is the fastest way to understand your current level and create a clear path to your goals.",
        "During your assessment, you'll receive: an accurate evaluation of your current reading, writing, and oral proficiency; a personalized study plan with timeline estimates; and expert recommendations on the best program for your situation.",
        "Spots fill up quickly — we recommend booking within the next 48 hours to secure your preferred time slot.",
      ],
      fr: [
        "Nous avons remarqué que vous n'avez pas encore complété votre évaluation linguistique gratuite. Cette séance de 15 minutes avec l'un de nos coachs experts est le moyen le plus rapide de comprendre votre niveau actuel et de créer un chemin clair vers vos objectifs.",
        "Lors de votre évaluation, vous recevrez : une évaluation précise de votre compétence actuelle en lecture, écriture et expression orale ; un plan d'étude personnalisé avec des estimations de délais ; et des recommandations d'experts sur le meilleur programme pour votre situation.",
        "Les places se remplissent rapidement — nous recommandons de réserver dans les prochaines 48 heures pour obtenir votre créneau horaire préféré.",
      ],
    },
    ctaText: {
      en: "Book My Free Assessment Now",
      fr: "Réserver mon évaluation gratuite maintenant",
    },
    ctaUrl: "/assessment",
  },
};

/** Generate HTML email template for email marketing platforms */
export function generateEmailHTML(
  type: EmailTemplateType,
  lang: "en" | "fr",
  recipientName?: string
): string {
  const template = TEMPLATES[type];
  const greeting = recipientName
    ? (lang === "fr" ? `Bonjour ${recipientName},` : `Hi ${recipientName},`)
    : (lang === "fr" ? "Bonjour," : "Hi there,");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject[lang]}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #1B3A4B, #2D5F73); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
    .body { padding: 32px; color: #1B3A4B; line-height: 1.6; }
    .body p { margin: 0 0 16px 0; font-size: 16px; }
    .cta { display: inline-block; padding: 14px 32px; background: #C65A1E; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }
    .cta:hover { background: #A84A18; }
    .footer { padding: 24px 32px; background: #f5f5f0; text-align: center; font-size: 12px; color: #6B7280; }
    .footer a { color: #1B3A4B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RusingAcademy</h1>
    </div>
    <div class="body">
      <h2 style="color: #1B3A4B; font-size: 22px; margin: 0 0 20px 0;">${template.heading[lang]}</h2>
      <p>${greeting}</p>
      ${template.body[lang].map(p => `<p>${p}</p>`).join("\n      ")}
      <p style="text-align: center; margin: 32px 0;">
        <a href="https://www.rusingacademy.ca${template.ctaUrl}" class="cta">${template.ctaText[lang]}</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Rusinga International Consulting Ltd.</p>
      <p>
        ${lang === "fr"
          ? '<a href="#">Se désabonner</a> | <a href="#">Politique de confidentialité</a>'
          : '<a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a>'}
      </p>
    </div>
  </div>
</body>
</html>`;
}

/** Email template preview component */
export function EmailTemplatePreview({ type, recipientName, className = "" }: EmailTemplateProps) {
  const { language } = useLanguage();
  const lang = language === "fr" ? "fr" : "en";
  const template = TEMPLATES[type];

  const greeting = recipientName
    ? (lang === "fr" ? `Bonjour ${recipientName},` : `Hi ${recipientName},`)
    : (lang === "fr" ? "Bonjour," : "Hi there,");

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden max-w-xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--brand-foundation)] to-[var(--brand-foundation-2)] p-6 text-center">
        <h3 className="text-white font-bold text-lg">RusingAcademy</h3>
      </div>

      {/* Subject line preview */}
      <div className="px-6 py-3 bg-[var(--sage-pale)] border-b border-[var(--sage-soft)]">
        <p className="text-xs text-[var(--sage-primary)]">
          {lang === "fr" ? "Objet :" : "Subject:"} <strong>{template.subject[lang]}</strong>
        </p>
      </div>

      {/* Body */}
      <div className="p-6">
        <h4 className="text-lg font-bold text-[var(--brand-foundation)] mb-4">
          {template.heading[lang]}
        </h4>
        <p className="text-sm text-[var(--sage-primary)] mb-3">{greeting}</p>
        {template.body[lang].map((paragraph, i) => (
          <p key={i} className="text-sm text-[var(--sage-primary)] mb-3 leading-relaxed">
            {paragraph}
          </p>
        ))}
        <div className="text-center mt-6">
          <span className="inline-block px-6 py-3 bg-[var(--brand-cta)] text-white font-semibold rounded-lg text-sm">
            {template.ctaText[lang]}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[var(--sage-pale)] text-center">
        <p className="text-xs text-[var(--sage-primary)]">
          &copy; 2026 Rusinga International Consulting Ltd.
        </p>
      </div>
    </div>
  );
}

export default EmailTemplatePreview;

import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const translations = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about Lingueefy and SLE preparation",
    categories: {
      general: "General",
      sle: "SLE Exams",
      coaches: "Coaches",
      pricing: "Pricing & Payments",
      ai: "Prof Steven AI",
    },
    faqs: [
      {
        category: "general",
        question: "What is Lingueefy?",
        answer: "Lingueefy is Canada's premier platform for second language learning specifically designed for federal public servants. We connect learners with specialized coaches who understand the SLE (Second Language Evaluation) exam and provide 24/7 AI-powered practice with Prof Steven AI."
      },
      {
        category: "general",
        question: "Who is Lingueefy for?",
        answer: "Lingueefy is designed for Canadian federal public servants who need to improve their French or English proficiency for SLE exams, bilingual positions, or career advancement. Whether you're aiming for BBB, CBC, or CCC, our platform can help."
      },
      {
        category: "general",
        question: "Is Lingueefy available in both English and French?",
        answer: "Yes! Lingueefy is fully bilingual. You can switch between English and French at any time using the language toggle in the header. Our coaches are also available in both languages."
      },
      {
        category: "sle",
        question: "What are SLE levels A, B, and C?",
        answer: "SLE levels measure language proficiency for federal positions: Level A is basic interaction skills, Level B is intermediate proficiency required for most bilingual positions, and Level C is advanced mastery for executive and specialized roles. Each level is tested in Reading, Writing, and Oral Interaction."
      },
      {
        category: "sle",
        question: "How does Lingueefy help with SLE preparation?",
        answer: "Our coaches specialize in SLE exam preparation and understand the Treasury Board evaluation criteria. They provide targeted practice for oral interaction, written expression, and reading comprehension. Prof Steven AI offers unlimited practice with realistic exam simulations."
      },
      {
        category: "sle",
        question: "Can I practice SLE oral exams on Lingueefy?",
        answer: "Absolutely! Prof Steven AI provides unlimited oral exam simulations for levels A, B, and C. You can practice anytime, receive instant feedback, and track your progress. Our human coaches also conduct mock oral exams during sessions."
      },
      {
        category: "coaches",
        question: "How are Lingueefy coaches selected?",
        answer: "All coaches undergo a rigorous vetting process. We verify their language proficiency, teaching experience, and understanding of the SLE exam format. Many of our coaches are former federal employees or certified language instructors with proven track records."
      },
      {
        category: "coaches",
        question: "Can I choose my own coach?",
        answer: "Yes! You can browse coach profiles, watch their introduction videos, read reviews from other learners, and book trial sessions before committing. Filter by specialization, availability, price, and language to find your perfect match."
      },
      {
        category: "coaches",
        question: "What if I'm not satisfied with my coach?",
        answer: "Your satisfaction is our priority. If you're not happy with a coach after your trial session, you can easily switch to another coach at no additional cost. We also offer refunds for unused sessions."
      },
      {
        category: "pricing",
        question: "How much does Lingueefy cost?",
        answer: "Coaches set their own rates, typically ranging from $30-80 CAD per hour. Trial sessions are available at reduced rates. Prof Steven AI is included with your account at no extra charge for basic practice, with premium features available for subscribers."
      },
      {
        category: "pricing",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment system. Payments are processed in Canadian dollars."
      },
      {
        category: "pricing",
        question: "Can my department pay for Lingueefy?",
        answer: "Yes! Many federal departments cover language training costs. We can provide invoices and documentation for your learning and development budget. Contact us for group rates and enterprise solutions."
      },
      {
        category: "ai",
        question: "What is Prof Steven AI?",
        answer: "Prof Steven AI is your 24/7 AI-powered language practice partner. It offers voice conversation practice, SLE placement tests to assess your current level, and realistic oral exam simulations. Practice anytime, anywhere, at your own pace."
      },
      {
        category: "ai",
        question: "Can Prof Steven AI replace human coaches?",
        answer: "Prof Steven AI is designed to complement, not replace, human coaches. Use AI for unlimited daily practice between coaching sessions. Human coaches provide personalized feedback, cultural context, and exam strategies that AI cannot fully replicate."
      },
      {
        category: "ai",
        question: "Is Prof Steven AI accurate for SLE preparation?",
        answer: "Prof Steven AI is trained on SLE exam formats and federal workplace scenarios. It provides realistic practice and helpful feedback. However, we recommend combining AI practice with human coaching for the best results."
      },
    ],
    contact: {
      title: "Still have questions?",
      description: "Our team is here to help. Reach out and we'll get back to you as soon as possible.",
      button: "Contact Us"
    }
  },
  fr: {
    title: "Foire aux questions",
    subtitle: "Trouvez des réponses aux questions courantes sur Lingueefy et la préparation aux ELS",
    categories: {
      general: "Général",
      sle: "Examens ELS",
      coaches: "Coachs",
      pricing: "Tarifs et paiements",
      ai: "Prof Steven IA",
    },
    faqs: [
      {
        category: "general",
        question: "Qu'est-ce que Lingueefy?",
        answer: "Lingueefy est la plateforme canadienne de premier plan pour l'apprentissage des langues secondes, spécialement conçue pour les fonctionnaires fédéraux. Nous connectons les apprenants avec des coachs spécialisés qui comprennent l'examen ELS (Évaluation de langue seconde) et offrons une pratique 24/7 avec Prof Steven IA."
      },
      {
        category: "general",
        question: "À qui s'adresse Lingueefy?",
        answer: "Lingueefy est conçu pour les fonctionnaires fédéraux canadiens qui doivent améliorer leur maîtrise du français ou de l'anglais pour les examens ELS, les postes bilingues ou l'avancement de carrière. Que vous visiez BBB, CBC ou CCC, notre plateforme peut vous aider."
      },
      {
        category: "general",
        question: "Lingueefy est-il disponible en anglais et en français?",
        answer: "Oui! Lingueefy est entièrement bilingue. Vous pouvez passer de l'anglais au français à tout moment en utilisant le bouton de langue dans l'en-tête. Nos coachs sont également disponibles dans les deux langues."
      },
      {
        category: "sle",
        question: "Que sont les niveaux ELS A, B et C?",
        answer: "Les niveaux ELS mesurent la compétence linguistique pour les postes fédéraux : le niveau A correspond aux compétences d'interaction de base, le niveau B à la maîtrise intermédiaire requise pour la plupart des postes bilingues, et le niveau C à la maîtrise avancée pour les rôles de direction et spécialisés."
      },
      {
        category: "sle",
        question: "Comment Lingueefy aide-t-il à la préparation aux ELS?",
        answer: "Nos coachs se spécialisent dans la préparation aux examens ELS et comprennent les critères d'évaluation du Conseil du Trésor. Ils offrent une pratique ciblée pour l'interaction orale, l'expression écrite et la compréhension de lecture. Prof Steven IA offre une pratique illimitée avec des simulations d'examens réalistes."
      },
      {
        category: "sle",
        question: "Puis-je pratiquer les examens oraux ELS sur Lingueefy?",
        answer: "Absolument! Prof Steven IA propose des simulations d'examens oraux illimitées pour les niveaux A, B et C. Vous pouvez pratiquer à tout moment, recevoir des commentaires instantanés et suivre vos progrès. Nos coachs humains conduisent également des examens oraux simulés pendant les sessions."
      },
      {
        category: "coaches",
        question: "Comment les coachs Lingueefy sont-ils sélectionnés?",
        answer: "Tous les coachs passent par un processus de vérification rigoureux. Nous vérifions leur compétence linguistique, leur expérience d'enseignement et leur compréhension du format d'examen ELS. Beaucoup de nos coachs sont d'anciens employés fédéraux ou des instructeurs de langues certifiés."
      },
      {
        category: "coaches",
        question: "Puis-je choisir mon propre coach?",
        answer: "Oui! Vous pouvez parcourir les profils des coachs, regarder leurs vidéos d'introduction, lire les avis d'autres apprenants et réserver des sessions d'essai avant de vous engager. Filtrez par spécialisation, disponibilité, prix et langue pour trouver votre match parfait."
      },
      {
        category: "coaches",
        question: "Que faire si je ne suis pas satisfait de mon coach?",
        answer: "Votre satisfaction est notre priorité. Si vous n'êtes pas satisfait d'un coach après votre session d'essai, vous pouvez facilement changer de coach sans frais supplémentaires. Nous offrons également des remboursements pour les sessions non utilisées."
      },
      {
        category: "pricing",
        question: "Combien coûte Lingueefy?",
        answer: "Les coachs fixent leurs propres tarifs, généralement entre 30 et 80 $ CAD par heure. Les sessions d'essai sont disponibles à des tarifs réduits. Prof Steven IA est inclus avec votre compte sans frais supplémentaires pour la pratique de base."
      },
      {
        category: "pricing",
        question: "Quels modes de paiement acceptez-vous?",
        answer: "Nous acceptons toutes les principales cartes de crédit (Visa, Mastercard, American Express) via notre système de paiement sécurisé Stripe. Les paiements sont traités en dollars canadiens."
      },
      {
        category: "pricing",
        question: "Mon ministère peut-il payer pour Lingueefy?",
        answer: "Oui! De nombreux ministères fédéraux couvrent les coûts de formation linguistique. Nous pouvons fournir des factures et de la documentation pour votre budget d'apprentissage et de développement. Contactez-nous pour les tarifs de groupe."
      },
      {
        category: "ai",
        question: "Qu'est-ce que Prof Steven IA?",
        answer: "Prof Steven IA est votre partenaire de pratique linguistique alimenté par l'IA, disponible 24/7. Il offre la pratique de conversation vocale, des tests de placement ELS pour évaluer votre niveau actuel et des simulations d'examens oraux réalistes."
      },
      {
        category: "ai",
        question: "Prof Steven IA peut-il remplacer les coachs humains?",
        answer: "Prof Steven IA est conçu pour compléter, et non remplacer, les coachs humains. Utilisez l'IA pour une pratique quotidienne illimitée entre les sessions de coaching. Les coachs humains fournissent des commentaires personnalisés et un contexte culturel que l'IA ne peut pas reproduire."
      },
      {
        category: "ai",
        question: "Prof Steven IA est-il précis pour la préparation aux ELS?",
        answer: "Prof Steven IA est formé sur les formats d'examens ELS et les scénarios de travail fédéral. Il fournit une pratique réaliste et des commentaires utiles. Cependant, nous recommandons de combiner la pratique IA avec le coaching humain pour les meilleurs résultats."
      },
    ],
    contact: {
      title: "Vous avez encore des questions?",
      description: "Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons dès que possible.",
      button: "Nous contacter"
    }
  }
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="pb-5 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<string>("general");
  
  const filteredFaqs = t.faqs.filter(faq => faq.category === activeCategory);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </section>
        
        {/* FAQ Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="FAQ categories">
              {Object.entries(t.categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    activeCategory === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  role="tab"
                  aria-selected={activeCategory === key}
                  aria-controls={`faq-panel-${key}`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            {/* FAQ List */}
            <div 
              className="bg-card rounded-xl border border-border p-6 md:p-8"
              role="tabpanel"
              id={`faq-panel-${activeCategory}`}
              aria-labelledby={`tab-${activeCategory}`}
            >
              {filteredFaqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t.contact.title}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t.contact.description}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t.contact.button}
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

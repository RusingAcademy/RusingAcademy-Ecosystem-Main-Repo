import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import {
  Check,
  Bot,
  Users,
  Star,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

export default function Pricing() {
  const { language } = useLanguage();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section');
          if (id && entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const labels = {
    en: {
      title: "Simple, Transparent Pricing",
      subtitle: "Pay only for what you need. No subscriptions, no hidden fees.",
      forLearners: "For Learners",
      forCoaches: "For Coaches",
      aiPractice: "Prof Steven AI",
      aiFree: "Free",
      aiDescription: "Unlimited AI practice to supplement your coaching sessions",
      aiFeatures: [
        "Unlimited voice practice sessions",
        "SLE placement tests",
        "Oral exam simulations (A, B, C levels)",
        "Instant feedback and corrections",
        "24/7 availability",
      ],
      startPracticing: "Start Practicing Free",
      coachSessions: "Coach Sessions",
      sessionPricing: "Set by each coach",
      sessionRange: "$35 - $80",
      perHour: "per hour",
      sessionDescription: "Book directly with specialized SLE coaches",
      sessionFeatures: [
        "Trial sessions available",
        "Personalized feedback",
        "Real exam preparation",
        "Flexible scheduling",
        "Secure payments via Stripe",
      ],
      findCoach: "Find a Coach",
      coachTitle: "Become a Coach",
      coachSubtitle: "Join our network and help public servants succeed",
      coachDescription: "Set your own rates, manage your schedule, and earn while making a difference",
      commissionTitle: "Commission Structure",
      trialSessions: "Trial Sessions",
      trialCommission: "0% commission",
      trialDesc: "You keep 100% of trial session revenue",
      paidSessions: "Paid Sessions",
      verifiedSLE: "Verified SLE Coaches",
      verifiedCommission: "15% commission",
      verifiedDesc: "Preferred rate for coaches with SLE certification",
      standardCoaches: "Standard Coaches",
      standardCommission: "26% → 15%",
      standardDesc: "Commission decreases as you complete more hours",
      referralBonus: "Referral Bonus",
      referralCommission: "0-5% commission",
      referralDesc: "Bring your own learners and keep more",
      applyNow: "Apply to Become a Coach",
      faqTitle: "Frequently Asked Questions",
      faq: [
        {
          q: "How do I pay for coaching sessions?",
          a: "All payments are processed securely through Stripe. You can pay with any major credit card. Your payment information is never stored on our servers.",
        },
        {
          q: "Can I get a refund?",
          a: "Yes, you can cancel a session up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to the coach's cancellation policy.",
        },
        {
          q: "Is Prof Steven AI really free?",
          a: "Yes! Prof Steven AI is completely free for all users. We believe everyone should have access to practice tools to prepare for their SLE exams.",
        },
        {
          q: "How do coaches set their prices?",
          a: "Coaches set their own hourly rates based on their experience, specialization, and availability. Prices typically range from $35 to $80 per hour.",
        },
        {
          q: "What payment methods do coaches receive?",
          a: "Coaches receive payments directly to their bank account via Stripe Connect. Payouts are processed weekly.",
        },
      ],
    },
    fr: {
      title: "Tarification simple et transparente",
      subtitle: "Payez uniquement ce dont vous avez besoin. Pas d'abonnement, pas de frais cachés.",
      forLearners: "Pour les apprenants",
      forCoaches: "Pour les coachs",
      aiPractice: "Prof Steven IA",
      aiFree: "Gratuit",
      aiDescription: "Pratique IA illimitée pour compléter vos séances de coaching",
      aiFeatures: [
        "Sessions de pratique vocale illimitées",
        "Tests de placement ELS",
        "Simulations d'examens oraux (niveaux A, B, C)",
        "Rétroaction et corrections instantanées",
        "Disponibilité 24/7",
      ],
      startPracticing: "Commencer gratuitement",
      coachSessions: "Sessions de coaching",
      sessionPricing: "Fixé par chaque coach",
      sessionRange: "35$ - 80$",
      perHour: "par heure",
      sessionDescription: "Réservez directement avec des coachs spécialisés ELS",
      sessionFeatures: [
        "Sessions d'essai disponibles",
        "Rétroaction personnalisée",
        "Préparation aux vrais examens",
        "Horaires flexibles",
        "Paiements sécurisés via Stripe",
      ],
      findCoach: "Trouver un coach",
      coachTitle: "Devenir coach",
      coachSubtitle: "Rejoignez notre réseau et aidez les fonctionnaires à réussir",
      coachDescription: "Fixez vos propres tarifs, gérez votre emploi du temps et gagnez de l'argent tout en faisant une différence",
      commissionTitle: "Structure des commissions",
      trialSessions: "Sessions d'essai",
      trialCommission: "0% commission",
      trialDesc: "Vous gardez 100% des revenus des sessions d'essai",
      paidSessions: "Sessions payantes",
      verifiedSLE: "Coachs ELS vérifiés",
      verifiedCommission: "15% commission",
      verifiedDesc: "Tarif préférentiel pour les coachs certifiés ELS",
      standardCoaches: "Coachs standards",
      standardCommission: "26% → 15%",
      standardDesc: "La commission diminue à mesure que vous complétez plus d'heures",
      referralBonus: "Bonus de parrainage",
      referralCommission: "0-5% commission",
      referralDesc: "Amenez vos propres apprenants et gardez plus",
      applyNow: "Postuler pour devenir coach",
      faqTitle: "Questions fréquemment posées",
      faq: [
        {
          q: "Comment puis-je payer les sessions de coaching?",
          a: "Tous les paiements sont traités de manière sécurisée via Stripe. Vous pouvez payer avec n'importe quelle carte de crédit majeure. Vos informations de paiement ne sont jamais stockées sur nos serveurs.",
        },
        {
          q: "Puis-je obtenir un remboursement?",
          a: "Oui, vous pouvez annuler une session jusqu'à 24 heures avant l'heure prévue pour un remboursement complet. Les annulations dans les 24 heures peuvent être soumises à la politique d'annulation du coach.",
        },
        {
          q: "Prof Steven IA est-il vraiment gratuit?",
          a: "Oui! Prof Steven IA est entièrement gratuit pour tous les utilisateurs. Nous croyons que tout le monde devrait avoir accès à des outils de pratique pour se préparer aux examens ELS.",
        },
        {
          q: "Comment les coachs fixent-ils leurs prix?",
          a: "Les coachs fixent leurs propres tarifs horaires en fonction de leur expérience, spécialisation et disponibilité. Les prix varient généralement de 35$ à 80$ par heure.",
        },
        {
          q: "Quels modes de paiement les coachs reçoivent-ils?",
          a: "Les coachs reçoivent les paiements directement sur leur compte bancaire via Stripe Connect. Les versements sont traités chaque semaine.",
        },
      ],
    },
  };

  const l = labels[language];

  // SEO metadata
  const seoTitle = language === 'en' 
    ? 'Pricing - Affordable SLE Preparation Plans' 
    : 'Tarifs - Plans de préparation ELS abordables';
  const seoDescription = language === 'en'
    ? 'Explore our flexible pricing plans for SLE preparation. AI coaching included free, human coaches from $30/hour. Find the right plan for your bilingual goals.'
    : 'Découvrez nos plans tarifaires flexibles pour la préparation ELS. Coaching IA inclus gratuitement, coachs humains à partir de 30$/heure.';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/30 via-white to-teal-50/20">
      <SEO 
        title={seoTitle}
        description={seoDescription}
      />
      <Header />

      <main id="main-content" className="flex-1">
        <Breadcrumb 
          items={[
            { label: "Pricing", labelFr: "Tarifs" }
          ]} 
        />

        {/* Hero Section with Glassmorphism */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          {/* Decorative orbs */}
          <div className="orb orb-teal w-[500px] h-[500px] -top-64 -right-64 animate-float-slow" />
          <div className="orb orb-orange w-72 h-72 top-20 -left-36 animate-float-medium opacity-40" />
          <div className="orb orb-teal w-48 h-48 bottom-10 right-1/4 animate-float-fast opacity-30" />
          
          <div className="container relative z-10 text-center">
            {/* Glass badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge mb-6">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">
                {language === "fr" ? "Tarification transparente" : "Transparent Pricing"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {language === "fr" ? (
                <>Tarification <span className="gradient-text">simple</span></>
              ) : (
                <>Simple, <span className="gradient-text">Transparent</span> Pricing</>
              )}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {l.subtitle}
            </p>
          </div>
        </section>

        {/* For Learners - Glassmorphism Cards */}
        <section 
          className="py-16 relative"
          aria-labelledby="learners-title"
          ref={(el) => { if (el) sectionRefs.current.set('learners', el); }}
          data-section="learners"
        >
          <div className="container">
            <h2 id="learners-title" className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {l.forLearners}
            </h2>

            <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-700 ${
              visibleSections.has('learners') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* AI Practice Card - Glass */}
              <div className="glass-card overflow-hidden hover-lift relative group">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                    {l.aiFree}
                  </Badge>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="p-6 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/25">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{l.aiPractice}</h3>
                  <p className="text-muted-foreground mb-6">{l.aiDescription}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {l.aiFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/prof-steven-ai">
                    <Button className="w-full glass-btn">
                      {l.startPracticing}
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Coach Sessions Card - Glass */}
              <div className="glass-card overflow-hidden hover-lift relative group" style={{ transitionDelay: '100ms' }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="p-6 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/25">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{l.coachSessions}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold gradient-text">{l.sessionRange}</span>
                    <span className="text-muted-foreground ml-2">{l.perHour}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{l.sessionDescription}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {l.sessionFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-teal-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/coaches">
                    <Button className="w-full glass-btn-outline">
                      {l.findCoach}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Coaches - Glassmorphism */}
        <section 
          className="py-16 relative overflow-hidden"
          aria-labelledby="coaches-title"
          ref={(el) => { if (el) sectionRefs.current.set('coaches', el); }}
          data-section="coaches"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white" />
          <div className="orb orb-teal w-64 h-64 -bottom-32 -left-32 opacity-30" />
          
          <div className="container relative z-10">
            <div className={`text-center mb-12 transition-all duration-700 ${
              visibleSections.has('coaches') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 id="coaches-title" className="text-2xl md:text-3xl font-bold mb-2">
                {l.coachTitle}
              </h2>
              <p className="text-muted-foreground">{l.coachSubtitle}</p>
            </div>

            <div className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${
              visibleSections.has('coaches') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="glass-card overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-2">{l.commissionTitle}</h3>
                  <p className="text-muted-foreground mb-8">{l.coachDescription}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Trial Sessions */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 hover-lift">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold">{l.trialSessions}</h4>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600 mb-1">
                        {l.trialCommission}
                      </p>
                      <p className="text-sm text-muted-foreground">{l.trialDesc}</p>
                    </div>

                    {/* Verified SLE */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200/50 hover-lift">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold">{l.verifiedSLE}</h4>
                      </div>
                      <p className="text-2xl font-bold text-teal-600 mb-1">
                        {l.verifiedCommission}
                      </p>
                      <p className="text-sm text-muted-foreground">{l.verifiedDesc}</p>
                    </div>

                    {/* Standard Coaches */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 hover-lift">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-500 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold">{l.standardCoaches}</h4>
                      </div>
                      <p className="text-2xl font-bold mb-1">{l.standardCommission}</p>
                      <p className="text-sm text-muted-foreground">{l.standardDesc}</p>
                    </div>

                    {/* Referral Bonus */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 hover-lift">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold">{l.referralBonus}</h4>
                      </div>
                      <p className="text-2xl font-bold text-orange-600 mb-1">
                        {l.referralCommission}
                      </p>
                      <p className="text-sm text-muted-foreground">{l.referralDesc}</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/become-a-coach">
                      <Button size="lg" className="glass-btn-orange">
                        {l.applyNow}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Glassmorphism Accordion */}
        <section 
          className="py-16"
          aria-labelledby="faq-title"
          ref={(el) => { if (el) sectionRefs.current.set('faq', el); }}
          data-section="faq"
        >
          <div className="container">
            <h2 id="faq-title" className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {l.faqTitle}
            </h2>

            <div className={`max-w-3xl mx-auto space-y-4 transition-all duration-700 ${
              visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {l.faq.map((item, i) => (
                <div 
                  key={i} 
                  className="glass-card overflow-hidden hover-lift cursor-pointer"
                  style={{ transitionDelay: `${i * 100}ms` }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                        <HelpCircle className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{item.q}</h3>
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                            openFaq === i ? 'rotate-180' : ''
                          }`} />
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${
                          openFaq === i ? 'max-h-40 mt-3' : 'max-h-0'
                        }`}>
                          <p className="text-muted-foreground text-sm">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Enhanced Pricing Page
 * 
 * Complete pricing page with:
 * - 4 structured offers (BOOST SESSION, QUICK PREP PLAN, PROGRESSIVE PLAN, MASTERY PROGRAM)
 * - How Our Structured System Works section
 * - Stripe Checkout integration
 * - Bilingual support (EN/FR)
 */

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  Clock,
  Target,
  Bot,
  Users,
  FileText,
  Award,
  ChevronRight,
  Star,
  Shield,
  Headphones,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

interface Offer {
  code: string;
  name: { en: string; fr: string };
  price: number;
  description: { en: string; fr: string };
  coachingHours: number;
  simulations: number;
  features: { en: string[]; fr: string[] };
  idealFor: { en: string; fr: string };
  popular?: boolean;
  icon: any;
  color: string;
}

const offers: Offer[] = [
  {
    code: "BOOST",
    name: { en: "Boost Session", fr: "Session Boost" },
    price: 6700, // $67 CAD
    description: {
      en: "Quick diagnosis of oral performance with immediate personalized feedback and targeted mini-simulation on weak spots.",
      fr: "Diagnostic rapide de votre performance orale avec rétroaction personnalisée immédiate et mini-simulation ciblée sur vos points faibles.",
    },
    coachingHours: 1,
    simulations: 1,
    features: {
      en: [
        "Quick diagnosis of oral performance",
        "Immediate personalized feedback",
        "Targeted mini-simulation on weak spots",
        "Professional assessment close to exam",
      ],
      fr: [
        "Diagnostic rapide de la performance orale",
        "Rétroaction personnalisée immédiate",
        "Mini-simulation ciblée sur les points faibles",
        "Évaluation professionnelle proche de l'examen",
      ],
    },
    idealFor: {
      en: "Quick clarity / professional feedback close to exam",
      fr: "Clarté rapide / rétroaction professionnelle proche de l'examen",
    },
    icon: Zap,
    color: "blue",
  },
  {
    code: "QUICK",
    name: { en: "Quick Prep Plan", fr: "Plan Préparation Rapide" },
    price: 29900, // $299 CAD
    description: {
      en: "Diagnostic assessment to identify gaps, personalized learning plan with focused themes, and one full oral exam simulation with feedback.",
      fr: "Évaluation diagnostique pour identifier les lacunes, plan d'apprentissage personnalisé avec thèmes ciblés, et une simulation complète d'examen oral avec rétroaction.",
    },
    coachingHours: 5,
    simulations: 1,
    features: {
      en: [
        "Diagnostic assessment to identify gaps",
        "Personalized learning plan with focused themes",
        "One full oral exam simulation with feedback",
        "5 hours of expert coaching",
      ],
      fr: [
        "Évaluation diagnostique pour identifier les lacunes",
        "Plan d'apprentissage personnalisé avec thèmes ciblés",
        "Une simulation complète d'examen oral avec rétroaction",
        "5 heures de coaching expert",
      ],
    },
    idealFor: {
      en: "2–3 weeks timeline",
      fr: "Échéancier de 2 à 3 semaines",
    },
    popular: true,
    icon: Rocket,
    color: "teal",
  },
  {
    code: "PROGRESSIVE",
    name: { en: "Progressive Plan", fr: "Plan Progressif" },
    price: 89900, // $899 CAD
    description: {
      en: "Comprehensive learning plan with milestones, weekly progress assessments & feedback loops, and multiple targeted oral exam simulations.",
      fr: "Plan d'apprentissage complet avec jalons, évaluations hebdomadaires des progrès et boucles de rétroaction, et plusieurs simulations d'examen oral ciblées.",
    },
    coachingHours: 15,
    simulations: 3,
    features: {
      en: [
        "Comprehensive learning plan with milestones",
        "Weekly progress assessments & feedback loops",
        "Multiple targeted oral exam simulations",
        "15 hours of expert coaching",
        "Level B or C preparation",
      ],
      fr: [
        "Plan d'apprentissage complet avec jalons",
        "Évaluations hebdomadaires et boucles de rétroaction",
        "Plusieurs simulations d'examen oral ciblées",
        "15 heures de coaching expert",
        "Préparation niveau B ou C",
      ],
    },
    idealFor: {
      en: "Level B or C over 8–12 weeks",
      fr: "Niveau B ou C sur 8 à 12 semaines",
    },
    icon: TrendingUp,
    color: "purple",
  },
  {
    code: "MASTERY",
    name: { en: "Mastery Program", fr: "Programme Maîtrise" },
    price: 189900, // $1,899 CAD
    description: {
      en: "30-Hour Confidence System™ with fully personalized bilingual roadmap, multiple exam simulations with real-time coaching, and exclusive Speaking Skeleton™ Framework.",
      fr: "Système de Confiance 30 heures™ avec feuille de route bilingue entièrement personnalisée, simulations d'examen multiples avec coaching en temps réel, et cadre exclusif Speaking Skeleton™.",
    },
    coachingHours: 30,
    simulations: 6,
    features: {
      en: [
        "30-Hour Confidence System™",
        "Fully personalized bilingual roadmap",
        "Multiple exam simulations with real-time coaching",
        "Exclusive Speaking Skeleton™ Framework",
        "Confidence & performance readiness guarantee",
      ],
      fr: [
        "Système de Confiance 30 heures™",
        "Feuille de route bilingue entièrement personnalisée",
        "Simulations d'examen multiples avec coaching en temps réel",
        "Cadre exclusif Speaking Skeleton™",
        "Garantie de confiance et de préparation à la performance",
      ],
    },
    idealFor: {
      en: "Long-term mastery / promotion readiness",
      fr: "Maîtrise à long terme / préparation à la promotion",
    },
    icon: Crown,
    color: "amber",
  },
];

export default function PricingEnhanced() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [loadingOffer, setLoadingOffer] = useState<string | null>(null);

  const labels = {
    en: {
      title: "Invest in Your Career Success",
      subtitle: "Structured coaching packages designed for Canadian public servants preparing for SLE oral exams",
      perPackage: "one-time",
      hours: "hours coaching",
      hour: "hour coaching",
      simulations: "simulations",
      simulation: "simulation",
      mostPopular: "Most Popular",
      getStarted: "Get Started",
      idealFor: "Ideal for",
      // How It Works
      howItWorksTitle: "How Our Structured System Works",
      howItWorksSubtitle: "A proven methodology for SLE oral exam success",
      step1Title: "Strategic Diagnostic",
      step1Desc: "Complete our comprehensive assessment to identify your current level, strengths, and areas for improvement. This forms the foundation of your personalized preparation.",
      step2Title: "Personalized Learning Plan",
      step2Desc: "Receive a customized roadmap based on your diagnostic results and target SLE level. Every session is strategically designed to maximize your progress.",
      step3Title: "Expert Coaching",
      step3Desc: "Work with certified coaches who specialize in SLE oral exam preparation. Get real-time feedback and proven techniques to build confidence.",
      step4Title: "Exam Simulations",
      step4Desc: "Practice with realistic exam simulations that mirror the actual SLE oral test. Receive detailed feedback to track your progress and identify remaining gaps.",
      // Guarantees
      guaranteesTitle: "Our Guarantees",
      guarantee1: "Satisfaction Guarantee",
      guarantee1Desc: "We're committed to your success. If you're not satisfied with your first session, we'll make it right.",
      guarantee2: "Certified Coaches",
      guarantee2Desc: "All coaches are verified SLE experts with proven track records helping public servants succeed.",
      guarantee3: "Secure Payments",
      guarantee3Desc: "All transactions are encrypted and processed securely by Stripe.",
      // CTA
      ctaTitle: "Ready to Achieve Your SLE Goals?",
      ctaSubtitle: "Join thousands of Canadian public servants who have successfully prepared with our structured system.",
      ctaButton: "Start Your Journey",
    },
    fr: {
      title: "Investissez dans votre réussite professionnelle",
      subtitle: "Forfaits de coaching structurés conçus pour les fonctionnaires canadiens préparant les examens oraux ELS",
      perPackage: "unique",
      hours: "heures de coaching",
      hour: "heure de coaching",
      simulations: "simulations",
      simulation: "simulation",
      mostPopular: "Plus populaire",
      getStarted: "Commencer",
      idealFor: "Idéal pour",
      // How It Works
      howItWorksTitle: "Comment fonctionne notre système structuré",
      howItWorksSubtitle: "Une méthodologie éprouvée pour réussir l'examen oral ELS",
      step1Title: "Diagnostic stratégique",
      step1Desc: "Complétez notre évaluation complète pour identifier votre niveau actuel, vos forces et vos points à améliorer. Cela forme la base de votre préparation personnalisée.",
      step2Title: "Plan d'apprentissage personnalisé",
      step2Desc: "Recevez une feuille de route personnalisée basée sur vos résultats diagnostiques et votre niveau ELS cible. Chaque session est stratégiquement conçue pour maximiser vos progrès.",
      step3Title: "Coaching expert",
      step3Desc: "Travaillez avec des coachs certifiés spécialisés dans la préparation aux examens oraux ELS. Obtenez des commentaires en temps réel et des techniques éprouvées pour renforcer votre confiance.",
      step4Title: "Simulations d'examen",
      step4Desc: "Pratiquez avec des simulations d'examen réalistes qui reflètent le véritable test oral ELS. Recevez des commentaires détaillés pour suivre vos progrès et identifier les lacunes restantes.",
      // Guarantees
      guaranteesTitle: "Nos garanties",
      guarantee1: "Garantie satisfaction",
      guarantee1Desc: "Nous nous engageons pour votre réussite. Si vous n'êtes pas satisfait de votre première session, nous rectifierons.",
      guarantee2: "Coachs certifiés",
      guarantee2Desc: "Tous les coachs sont des experts ELS vérifiés avec des résultats prouvés aidant les fonctionnaires à réussir.",
      guarantee3: "Paiements sécurisés",
      guarantee3Desc: "Toutes les transactions sont cryptées et traitées de manière sécurisée par Stripe.",
      // CTA
      ctaTitle: "Prêt à atteindre vos objectifs ELS?",
      ctaSubtitle: "Rejoignez des milliers de fonctionnaires canadiens qui se sont préparés avec succès grâce à notre système structuré.",
      ctaButton: "Commencez votre parcours",
    },
  };

  const t = labels[language];

  const handleCheckout = async (offerCode: string) => {
    setLoadingOffer(offerCode);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerCode,
          language,
          successUrl: `${window.location.origin}/${language === "en" ? "en" : "fr"}/checkout/success`,
          cancelUrl: `${window.location.origin}/${language === "en" ? "en/pricing" : "fr/tarifs"}`,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoadingOffer(null);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(isEn ? "en-CA" : "fr-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const getColorClasses = (color: string, popular?: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
      },
      teal: {
        bg: "bg-teal-50",
        border: popular ? "border-teal-500 border-2" : "border-teal-200",
        text: "text-teal-600",
        badge: "bg-teal-100 text-teal-700",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        badge: "bg-purple-100 text-purple-700",
      },
      amber: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={isEn ? "Pricing - SLE Oral Exam Coaching Packages | RusingAcademy" : "Tarifs - Forfaits de coaching pour examens oraux ELS | RusingAcademy"}
        description={isEn
          ? "Choose from our structured SLE oral exam coaching packages. From quick boost sessions to comprehensive mastery programs. Invest in your Canadian public service career."
          : "Choisissez parmi nos forfaits structurés de coaching pour examens oraux ELS. Des sessions boost rapides aux programmes de maîtrise complets. Investissez dans votre carrière dans la fonction publique canadienne."
        }
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">{t.subtitle}</p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24 -mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {offers.map((offer) => {
                const colors = getColorClasses(offer.color, offer.popular);
                const IconComponent = offer.icon;
                
                return (
                  <Card
                    key={offer.code}
                    className={`relative flex flex-col ${colors.border} ${offer.popular ? "shadow-xl scale-105 z-10" : "shadow-lg"} transition-all hover:shadow-xl`}
                  >
                    {offer.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-teal-600 text-white px-4 py-1 text-sm font-semibold">
                          <Star className="w-4 h-4 mr-1 inline" />
                          {t.mostPopular}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className={`${colors.bg} rounded-t-lg pt-8`}>
                      <div className={`w-12 h-12 rounded-full ${colors.badge} flex items-center justify-center mb-4`}>
                        <IconComponent className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {offer.name[language]}
                      </CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(offer.price)}
                        </span>
                        <span className="text-gray-500 ml-2">{t.perPackage}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow pt-6">
                      <p className="text-gray-600 mb-4">{offer.description[language]}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{offer.coachingHours} {offer.coachingHours === 1 ? t.hour : t.hours}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{offer.simulations} {offer.simulations === 1 ? t.simulation : t.simulations}</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-3">
                        {offer.features[language].map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">{t.idealFor}:</span> {offer.idealFor[language]}
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button
                        className={`w-full ${offer.popular ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-900 hover:bg-gray-800"}`}
                        size="lg"
                        onClick={() => handleCheckout(offer.code)}
                        disabled={loadingOffer === offer.code}
                      >
                        {loadingOffer === offer.code ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Loading...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {t.getStarted}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.howItWorksTitle}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t.howItWorksSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { icon: FileText, title: t.step1Title, desc: t.step1Desc, step: 1 },
                { icon: Target, title: t.step2Title, desc: t.step2Desc, step: 2 },
                { icon: Users, title: t.step3Title, desc: t.step3Desc, step: 3 },
                { icon: Award, title: t.step4Title, desc: t.step4Desc, step: 4 },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-teal-600 font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="w-8 h-8 text-teal-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              {t.guaranteesTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.guarantee1}</h3>
                <p className="text-gray-600">{t.guarantee1Desc}</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.guarantee2}</h3>
                <p className="text-gray-600">{t.guarantee2Desc}</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.guarantee3}</h3>
                <p className="text-gray-600">{t.guarantee3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.ctaTitle}</h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-8">{t.ctaSubtitle}</p>
            <Button
              size="lg"
              className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-8 py-6 text-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {t.ctaButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

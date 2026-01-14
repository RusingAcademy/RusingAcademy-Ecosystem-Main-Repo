/**
 * Enhanced Pricing Page
 * 
 * Complete pricing page with:
 * - 4 structured offers (Starter, Pro, Elite, Enterprise)
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
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface Offer {
  code: string;
  name: { en: string; fr: string };
  price: number;
  description: { en: string; fr: string };
  coachingHours: number;
  simulations: number;
  features: { en: string[]; fr: string[] };
  popular?: boolean;
  icon: any;
  color: string;
}

const offers: Offer[] = [
  {
    code: "STARTER",
    name: { en: "Starter", fr: "Débutant" },
    price: 29900, // $299 CAD
    description: {
      en: "Perfect for getting started with SLE preparation",
      fr: "Parfait pour commencer la préparation ELS",
    },
    coachingHours: 2,
    simulations: 3,
    features: {
      en: [
        "2 hours of 1-on-1 coaching",
        "3 exam simulations",
        "Strategic diagnostic assessment",
        "Personalized learning plan",
        "Unlimited AI practice",
        "Email support",
      ],
      fr: [
        "2 heures de coaching individuel",
        "3 simulations d'examen",
        "Évaluation diagnostique stratégique",
        "Plan d'apprentissage personnalisé",
        "Pratique IA illimitée",
        "Support par courriel",
      ],
    },
    icon: Zap,
    color: "blue",
  },
  {
    code: "PRO",
    name: { en: "Professional", fr: "Professionnel" },
    price: 59900, // $599 CAD
    description: {
      en: "Comprehensive preparation for serious candidates",
      fr: "Préparation complète pour les candidats sérieux",
    },
    coachingHours: 5,
    simulations: 6,
    features: {
      en: [
        "5 hours of 1-on-1 coaching",
        "6 exam simulations",
        "Strategic diagnostic assessment",
        "Personalized learning plan",
        "Unlimited AI practice",
        "Priority scheduling",
        "Progress tracking dashboard",
        "Email & chat support",
      ],
      fr: [
        "5 heures de coaching individuel",
        "6 simulations d'examen",
        "Évaluation diagnostique stratégique",
        "Plan d'apprentissage personnalisé",
        "Pratique IA illimitée",
        "Planification prioritaire",
        "Tableau de bord de suivi",
        "Support par courriel et chat",
      ],
    },
    popular: true,
    icon: Sparkles,
    color: "teal",
  },
  {
    code: "ELITE",
    name: { en: "Elite", fr: "Élite" },
    price: 99900, // $999 CAD
    description: {
      en: "Maximum support for guaranteed results",
      fr: "Support maximal pour des résultats garantis",
    },
    coachingHours: 10,
    simulations: 12,
    features: {
      en: [
        "10 hours of 1-on-1 coaching",
        "12 exam simulations",
        "Strategic diagnostic assessment",
        "Personalized learning plan",
        "Unlimited AI practice",
        "VIP scheduling",
        "Progress tracking dashboard",
        "Weekly progress reports",
        "Dedicated coach assignment",
        "Phone, email & chat support",
      ],
      fr: [
        "10 heures de coaching individuel",
        "12 simulations d'examen",
        "Évaluation diagnostique stratégique",
        "Plan d'apprentissage personnalisé",
        "Pratique IA illimitée",
        "Planification VIP",
        "Tableau de bord de suivi",
        "Rapports de progrès hebdomadaires",
        "Coach dédié assigné",
        "Support téléphone, courriel et chat",
      ],
    },
    icon: Crown,
    color: "purple",
  },
  {
    code: "ENTERPRISE",
    name: { en: "Enterprise", fr: "Entreprise" },
    price: 0, // Custom pricing
    description: {
      en: "Custom solutions for departments and organizations",
      fr: "Solutions personnalisées pour ministères et organisations",
    },
    coachingHours: 0, // Custom
    simulations: 0, // Custom
    features: {
      en: [
        "Custom coaching hours",
        "Unlimited simulations",
        "Group training sessions",
        "Dedicated account manager",
        "Custom reporting & analytics",
        "Volume discounts",
        "Invoice billing",
        "SLA guarantee",
        "On-site training available",
        "24/7 priority support",
      ],
      fr: [
        "Heures de coaching personnalisées",
        "Simulations illimitées",
        "Sessions de formation en groupe",
        "Gestionnaire de compte dédié",
        "Rapports et analyses personnalisés",
        "Remises sur volume",
        "Facturation",
        "Garantie SLA",
        "Formation sur site disponible",
        "Support prioritaire 24/7",
      ],
    },
    icon: Building2,
    color: "slate",
  },
];

export default function PricingEnhanced() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [loadingOffer, setLoadingOffer] = useState<string | null>(null);

  const labels = {
    en: {
      title: "Invest in Your Career Success",
      subtitle: "Structured coaching packages designed for Canadian public servants",
      perPackage: "one-time",
      hours: "hours coaching",
      simulations: "simulations",
      mostPopular: "Most Popular",
      getStarted: "Get Started",
      contactSales: "Contact Sales",
      customPricing: "Custom Pricing",
      // How It Works
      howItWorksTitle: "How Our Structured System Works",
      howItWorksSubtitle: "A proven 4-step methodology for SLE success",
      step1Title: "Strategic Diagnostic",
      step1Desc: "Complete our comprehensive assessment to identify your current level, strengths, and areas for improvement.",
      step2Title: "Personalized Learning Plan",
      step2Desc: "Receive a customized roadmap based on your diagnostic results and target SLE level.",
      step3Title: "Expert Coaching",
      step3Desc: "Work with certified coaches who specialize in your target level and learning style.",
      step4Title: "Exam Simulations",
      step4Desc: "Practice with realistic exam simulations and receive detailed feedback to track your progress.",
      // Guarantees
      guaranteesTitle: "Our Guarantees",
      guarantee1: "100% Satisfaction Guarantee",
      guarantee1Desc: "Not satisfied? Get a full refund within 14 days.",
      guarantee2: "Certified Coaches",
      guarantee2Desc: "All coaches are verified SLE experts with proven track records.",
      guarantee3: "Secure Payments",
      guarantee3Desc: "All transactions are encrypted and processed by Stripe.",
      // FAQ
      faqTitle: "Frequently Asked Questions",
    },
    fr: {
      title: "Investissez dans votre réussite professionnelle",
      subtitle: "Forfaits de coaching structurés conçus pour les fonctionnaires canadiens",
      perPackage: "unique",
      hours: "heures de coaching",
      simulations: "simulations",
      mostPopular: "Plus populaire",
      getStarted: "Commencer",
      contactSales: "Contacter les ventes",
      customPricing: "Tarification personnalisée",
      // How It Works
      howItWorksTitle: "Comment fonctionne notre système structuré",
      howItWorksSubtitle: "Une méthodologie éprouvée en 4 étapes pour réussir l'ELS",
      step1Title: "Diagnostic stratégique",
      step1Desc: "Complétez notre évaluation complète pour identifier votre niveau actuel, vos forces et vos points à améliorer.",
      step2Title: "Plan d'apprentissage personnalisé",
      step2Desc: "Recevez une feuille de route personnalisée basée sur vos résultats diagnostiques et votre niveau ELS cible.",
      step3Title: "Coaching expert",
      step3Desc: "Travaillez avec des coachs certifiés spécialisés dans votre niveau cible et votre style d'apprentissage.",
      step4Title: "Simulations d'examen",
      step4Desc: "Pratiquez avec des simulations d'examen réalistes et recevez des commentaires détaillés pour suivre vos progrès.",
      // Guarantees
      guaranteesTitle: "Nos garanties",
      guarantee1: "Garantie satisfaction 100%",
      guarantee1Desc: "Pas satisfait? Obtenez un remboursement complet dans les 14 jours.",
      guarantee2: "Coachs certifiés",
      guarantee2Desc: "Tous les coachs sont des experts ELS vérifiés avec des résultats prouvés.",
      guarantee3: "Paiements sécurisés",
      guarantee3Desc: "Toutes les transactions sont cryptées et traitées par Stripe.",
      // FAQ
      faqTitle: "Questions fréquemment posées",
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

  const getColorClasses = (color: string, type: "bg" | "text" | "border") => {
    const colors: Record<string, Record<string, string>> = {
      blue: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600" },
      teal: { bg: "bg-teal-600", text: "text-teal-600", border: "border-teal-600" },
      purple: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-600" },
      slate: { bg: "bg-slate-600", text: "text-slate-600", border: "border-slate-600" },
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO
        title={isEn ? "Pricing | SLE Coaching Packages" : "Tarifs | Forfaits de coaching ELS"}
        description={isEn
          ? "Choose the perfect SLE coaching package for your career goals. Structured programs with certified coaches."
          : "Choisissez le forfait de coaching ELS parfait pour vos objectifs de carrière. Programmes structurés avec des coachs certifiés."
        }
      />
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {offers.map((offer) => {
            const Icon = offer.icon;
            const isEnterprise = offer.code === "ENTERPRISE";
            
            return (
              <Card
                key={offer.code}
                className={`relative flex flex-col ${
                  offer.popular ? `border-2 ${getColorClasses(offer.color, "border")} shadow-lg` : ""
                }`}
              >
                {offer.popular && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${getColorClasses(offer.color, "bg")} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    {t.mostPopular}
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl ${getColorClasses(offer.color, "bg")} bg-opacity-10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${getColorClasses(offer.color, "text")}`} />
                  </div>
                  <CardTitle className="text-xl">{offer.name[language]}</CardTitle>
                  <CardDescription>{offer.description[language]}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Price */}
                  <div className="text-center mb-6">
                    {isEnterprise ? (
                      <p className="text-2xl font-bold text-gray-900">{t.customPricing}</p>
                    ) : (
                      <>
                        <p className="text-4xl font-bold text-gray-900">{formatPrice(offer.price)}</p>
                        <p className="text-sm text-gray-500">{t.perPackage}</p>
                      </>
                    )}
                  </div>

                  {/* Highlights */}
                  {!isEnterprise && (
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{offer.coachingHours}</p>
                        <p className="text-xs text-gray-500">{t.hours}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{offer.simulations}</p>
                        <p className="text-xs text-gray-500">{t.simulations}</p>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-3">
                    {offer.features[language].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 ${getColorClasses(offer.color, "text")} shrink-0 mt-0.5`} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {isEnterprise ? (
                    <Link href={isEn ? "/en/contact" : "/fr/contact"} className="w-full">
                      <Button variant="outline" className="w-full">
                        {t.contactSales}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className={`w-full ${getColorClasses(offer.color, "bg")} hover:opacity-90`}
                      onClick={() => handleCheckout(offer.code)}
                      disabled={loadingOffer === offer.code}
                    >
                      {loadingOffer === offer.code ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        <>
                          {t.getStarted}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howItWorksTitle}</h2>
            <p className="text-lg text-gray-600">{t.howItWorksSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: t.step1Title, desc: t.step1Desc, step: 1 },
              { icon: FileText, title: t.step2Title, desc: t.step2Desc, step: 2 },
              { icon: Users, title: t.step3Title, desc: t.step3Desc, step: 3 },
              { icon: Award, title: t.step4Title, desc: t.step4Desc, step: 4 },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex mb-4">
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-teal-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.guaranteesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: t.guarantee1, desc: t.guarantee1Desc },
              { icon: Award, title: t.guarantee2, desc: t.guarantee2Desc },
              { icon: Shield, title: t.guarantee3, desc: t.guarantee3Desc },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <item.icon className="h-10 w-10 text-teal-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

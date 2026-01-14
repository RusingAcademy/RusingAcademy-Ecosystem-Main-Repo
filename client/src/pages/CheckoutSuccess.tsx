/**
 * Checkout Success Page
 * 
 * Displayed after successful Stripe Checkout payment.
 * Shows confirmation and next steps.
 */

import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Calendar, Bot, Target, Loader2 } from "lucide-react";

interface PurchaseDetails {
  status: string;
  purchaseId?: number;
  purchaseStatus?: string;
}

export default function CheckoutSuccess() {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get session_id from URL
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetchPurchaseStatus();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/checkout/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setPurchase(data);
      } else {
        setError("Could not verify payment status");
      }
    } catch (err) {
      setError("Error checking payment status");
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    en: {
      title: "Payment Successful!",
      subtitle: "Thank you for your purchase",
      description: "Your coaching package has been activated. You can now access all the features included in your plan.",
      nextSteps: "Next Steps",
      step1Title: "Complete Your Diagnostic",
      step1Desc: "Start with a strategic language assessment to identify your strengths and areas for improvement.",
      step2Title: "View Your Learning Plan",
      step2Desc: "Access your personalized learning roadmap designed to help you achieve your target level.",
      step3Title: "Book Your First Session",
      step3Desc: "Schedule a coaching session with one of our expert SLE coaches.",
      step4Title: "Practice with AI Coach",
      step4Desc: "Use our AI-powered practice tool to prepare between coaching sessions.",
      goToDashboard: "Go to Dashboard",
      viewPlan: "View My Plan",
      bookSession: "Book a Session",
      loading: "Verifying your payment...",
      errorTitle: "Verification Issue",
      errorDesc: "We couldn't verify your payment, but don't worry - if the payment was successful, your access will be activated shortly.",
      contactSupport: "Contact Support",
    },
    fr: {
      title: "Paiement réussi!",
      subtitle: "Merci pour votre achat",
      description: "Votre forfait de coaching a été activé. Vous pouvez maintenant accéder à toutes les fonctionnalités incluses dans votre plan.",
      nextSteps: "Prochaines étapes",
      step1Title: "Complétez votre diagnostic",
      step1Desc: "Commencez par une évaluation stratégique de la langue pour identifier vos forces et vos points à améliorer.",
      step2Title: "Consultez votre plan d'apprentissage",
      step2Desc: "Accédez à votre feuille de route personnalisée conçue pour vous aider à atteindre votre niveau cible.",
      step3Title: "Réservez votre première session",
      step3Desc: "Planifiez une session de coaching avec l'un de nos coachs experts ELS.",
      step4Title: "Pratiquez avec le coach IA",
      step4Desc: "Utilisez notre outil de pratique alimenté par l'IA pour vous préparer entre les sessions de coaching.",
      goToDashboard: "Aller au tableau de bord",
      viewPlan: "Voir mon plan",
      bookSession: "Réserver une session",
      loading: "Vérification de votre paiement...",
      errorTitle: "Problème de vérification",
      errorDesc: "Nous n'avons pas pu vérifier votre paiement, mais ne vous inquiétez pas - si le paiement a réussi, votre accès sera activé sous peu.",
      contactSupport: "Contacter le support",
    },
  };

  const t = labels[language];
  const dashboardPath = language === "fr" ? "/fr/tableau-de-bord" : "/en/dashboard";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">{t.loading}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-2">{t.subtitle}</p>
          <p className="text-gray-500 max-w-2xl mx-auto">{t.description}</p>
        </div>

        {error && (
          <Card className="max-w-2xl mx-auto mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-yellow-800 mb-2">{t.errorTitle}</h3>
              <p className="text-yellow-700 text-sm">{t.errorDesc}</p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">{t.nextSteps}</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Step 1: Diagnostic */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t.step1Title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{t.step1Desc}</p>
                <Link href={`${dashboardPath}?tab=diagnostic`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {language === "en" ? "Start Diagnostic" : "Commencer le diagnostic"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 2: Learning Plan */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{t.step2Title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{t.step2Desc}</p>
                <Link href={`${dashboardPath}?tab=plan`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t.viewPlan}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 3: Book Session */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{t.step3Title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{t.step3Desc}</p>
                <Link href={language === "en" ? "/en/coaches" : "/fr/coachs"}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t.bookSession}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 4: AI Coach */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Bot className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{t.step4Title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{t.step4Desc}</p>
                <Link href={`${dashboardPath}?tab=ai-coach`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {language === "en" ? "Try AI Coach" : "Essayer le coach IA"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main CTA */}
          <div className="text-center">
            <Link href={dashboardPath}>
              <Button size="lg" className="px-8">
                {t.goToDashboard}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

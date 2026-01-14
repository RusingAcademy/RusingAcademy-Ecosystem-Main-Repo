/**
 * Checkout Cancel Page
 * 
 * Displayed when user cancels Stripe Checkout.
 * Offers options to retry or get help.
 */

import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, HelpCircle, MessageSquare, RefreshCw } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutCancel() {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: "Payment Cancelled",
      subtitle: "Your payment was not completed",
      description: "No worries! Your card has not been charged. You can return to our pricing page to complete your purchase when you're ready.",
      whyCancel: "Changed your mind?",
      whyCancelDesc: "We understand. If you have questions about our coaching packages or need help choosing the right plan, we're here to help.",
      tryAgain: "Try Again",
      backToPricing: "Back to Pricing",
      contactUs: "Contact Us",
      faq: "View FAQ",
      helpTitle: "Need Help Deciding?",
      helpDesc: "Our team can help you choose the right coaching package based on your SLE goals and timeline.",
      scheduleCall: "Schedule a Free Consultation",
    },
    fr: {
      title: "Paiement annulé",
      subtitle: "Votre paiement n'a pas été complété",
      description: "Pas de souci! Votre carte n'a pas été débitée. Vous pouvez retourner à notre page de tarification pour compléter votre achat quand vous serez prêt.",
      whyCancel: "Vous avez changé d'avis?",
      whyCancelDesc: "Nous comprenons. Si vous avez des questions sur nos forfaits de coaching ou si vous avez besoin d'aide pour choisir le bon plan, nous sommes là pour vous aider.",
      tryAgain: "Réessayer",
      backToPricing: "Retour aux tarifs",
      contactUs: "Nous contacter",
      faq: "Voir la FAQ",
      helpTitle: "Besoin d'aide pour décider?",
      helpDesc: "Notre équipe peut vous aider à choisir le bon forfait de coaching en fonction de vos objectifs ELS et de votre calendrier.",
      scheduleCall: "Planifier une consultation gratuite",
    },
  };

  const t = labels[language];
  const pricingPath = language === "fr" ? "/fr/tarifs" : "/en/pricing";
  const faqPath = language === "fr" ? "/fr/faq" : "/en/faq";
  const contactPath = language === "fr" ? "/fr/contact" : "/en/contact";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Cancel Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <XCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-2">{t.subtitle}</p>
          <p className="text-gray-500 max-w-2xl mx-auto">{t.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href={pricingPath}>
            <Button size="lg" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-5 w-5" />
              {t.tryAgain}
            </Button>
          </Link>
          <Link href={pricingPath}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t.backToPricing}
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-3 rounded-full bg-blue-100">
                  <HelpCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.helpTitle}</h3>
                  <p className="text-gray-600 mb-4">{t.helpDesc}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={contactPath}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t.contactUs}
                      </Button>
                    </Link>
                    <Link href={faqPath}>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        {t.faq}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Section */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.whyCancel}</h3>
            <p className="text-gray-600 text-sm">{t.whyCancelDesc}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

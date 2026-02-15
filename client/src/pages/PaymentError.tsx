import { Link, useSearch } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, MessageCircle, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentError() {
  const { language } = useLanguage();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const reason = params.get("reason") || "cancelled";

  const l = language === "fr" ? {
    cancelled: {
      title: "Paiement annul\u00e9",
      subtitle: "Votre paiement a \u00e9t\u00e9 annul\u00e9. Aucun montant n'a \u00e9t\u00e9 d\u00e9bit\u00e9.",
    },
    failed: {
      title: "\u00c9chec du paiement",
      subtitle: "Nous n'avons pas pu traiter votre paiement. Veuillez r\u00e9essayer.",
    },
    expired: {
      title: "Session expir\u00e9e",
      subtitle: "Votre session de paiement a expir\u00e9. Veuillez recommencer.",
    },
    tryAgain: "R\u00e9essayer",
    goBack: "Retour",
    contactSupport: "Contacter le support",
    helpText: "Si le probl\u00e8me persiste, n'h\u00e9sitez pas \u00e0 nous contacter.",
  } : {
    cancelled: {
      title: "Payment Cancelled",
      subtitle: "Your payment was cancelled. No charges were made.",
    },
    failed: {
      title: "Payment Failed",
      subtitle: "We were unable to process your payment. Please try again.",
    },
    expired: {
      title: "Session Expired",
      subtitle: "Your payment session has expired. Please start over.",
    },
    tryAgain: "Try Again",
    goBack: "Go Back",
    contactSupport: "Contact Support",
    helpText: "If the problem persists, please don't hesitate to contact us.",
  };

  const errorInfo = reason === "failed" ? l.failed : reason === "expired" ? l.expired : l.cancelled;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-6">
          <Card className="border-red-200 dark:border-red-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <XCircle className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{errorInfo.title}</h1>
              <p className="text-white/90">{errorInfo.subtitle}</p>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Help Text */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <HelpCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{l.helpText}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pricing" className="flex-1">
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {l.tryAgain}
                  </Button>
                </Link>
                <Link href="/curriculum" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {l.goBack}
                  </Button>
                </Link>
              </div>

              {/* Contact Support */}
              <div className="text-center">
                <Link href="/contact">
                  <Button variant="link" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {l.contactSupport}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

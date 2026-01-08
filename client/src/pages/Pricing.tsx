import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
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
} from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const { language } = useLanguage();

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
      aiDescription: "Pratique IA illimitée pour compléter vos sessions de coaching",
      aiFeatures: [
        "Sessions de pratique vocale illimitées",
        "Tests de classement ELS",
        "Simulations d'examen oral (niveaux A, B, C)",
        "Rétroaction et corrections instantanées",
        "Disponibilité 24h/24",
      ],
      startPracticing: "Commencer la pratique gratuite",
      coachSessions: "Sessions de coaching",
      sessionPricing: "Fixé par chaque coach",
      sessionRange: "35$ - 80$",
      perHour: "par heure",
      sessionDescription: "Réservez directement avec des coachs ELS spécialisés",
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
      coachDescription: "Fixez vos propres tarifs, gérez votre horaire et gagnez de l'argent tout en faisant une différence",
      commissionTitle: "Structure de commission",
      trialSessions: "Sessions d'essai",
      trialCommission: "0% de commission",
      trialDesc: "Vous gardez 100% des revenus des sessions d'essai",
      paidSessions: "Sessions payantes",
      verifiedSLE: "Coachs ELS vérifiés",
      verifiedCommission: "15% de commission",
      verifiedDesc: "Taux préférentiel pour les coachs avec certification ELS",
      standardCoaches: "Coachs standard",
      standardCommission: "26% → 15%",
      standardDesc: "La commission diminue à mesure que vous complétez plus d'heures",
      referralBonus: "Bonus de parrainage",
      referralCommission: "0-5% de commission",
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 hero-gradient">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{l.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {l.subtitle}
            </p>
          </div>
        </section>

        {/* For Learners */}
        <section className="py-16" aria-labelledby="learners-title">
          <div className="container">
            <h2 id="learners-title" className="text-2xl font-bold mb-8 text-center">
              {l.forLearners}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* AI Practice Card */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500 text-white">{l.aiFree}</Badge>
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{l.aiPractice}</CardTitle>
                  <CardDescription>{l.aiDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {l.aiFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/prof-steven-ai">
                    <Button className="w-full">{l.startPracticing}</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Coach Sessions Card */}
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{l.coachSessions}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{l.sessionRange}</span>
                    <span className="text-muted-foreground ml-2">{l.perHour}</span>
                  </div>
                  <CardDescription>{l.sessionDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {l.sessionFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/coaches">
                    <Button className="w-full" variant="outline">
                      {l.findCoach} <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Coaches */}
        <section className="py-16 bg-muted/30" aria-labelledby="coaches-title">
          <div className="container">
            <div className="text-center mb-12">
              <h2 id="coaches-title" className="text-2xl font-bold mb-2">
                {l.coachTitle}
              </h2>
              <p className="text-muted-foreground">{l.coachSubtitle}</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{l.commissionTitle}</CardTitle>
                  <CardDescription>{l.coachDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Trial Sessions */}
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold">{l.trialSessions}</h3>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600 mb-1">
                        {l.trialCommission}
                      </p>
                      <p className="text-sm text-muted-foreground">{l.trialDesc}</p>
                    </div>

                    {/* Verified SLE */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{l.verifiedSLE}</h3>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-1">
                        {l.verifiedCommission}
                      </p>
                      <p className="text-sm text-muted-foreground">{l.verifiedDesc}</p>
                    </div>

                    {/* Standard Coaches */}
                    <div className="p-4 rounded-lg bg-muted border">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold">{l.standardCoaches}</h3>
                      </div>
                      <p className="text-2xl font-bold mb-1">{l.standardCommission}</p>
                      <p className="text-sm text-muted-foreground">{l.standardDesc}</p>
                    </div>

                    {/* Referral Bonus */}
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold">{l.referralBonus}</h3>
                      </div>
                      <p className="text-2xl font-bold text-amber-600 mb-1">
                        {l.referralCommission}
                      </p>
                      <p className="text-sm text-muted-foreground">{l.referralDesc}</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/become-a-coach">
                      <Button size="lg">
                        {l.applyNow} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16" aria-labelledby="faq-title">
          <div className="container">
            <h2 id="faq-title" className="text-2xl font-bold mb-8 text-center">
              {l.faqTitle}
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {l.faq.map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-2">{item.q}</h3>
                        <p className="text-muted-foreground text-sm">{item.a}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

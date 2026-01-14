import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoachApplicationWizard } from "@/components/CoachApplicationWizard";
import { ApplicationStatusTracker } from "@/components/ApplicationStatusTracker";
import {
  Users,
  DollarSign,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Globe,
  Shield,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Heart,
  Zap,
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function BecomeCoach() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showApplication, setShowApplication] = useState(false);
  const [applicationComplete, setApplicationComplete] = useState(false);
  const isEn = language === "en";

  const labels = {
    en: {
      title: "Become a Lingueefy Coach",
      subtitle: "Join our network of expert language coaches helping Canadian public servants achieve their SLE goals",
      heroStats: [
        { value: "500+", label: "Active Coaches" },
        { value: "$75", label: "Avg. Hourly Rate" },
        { value: "15K+", label: "Sessions Completed" },
        { value: "4.9", label: "Coach Rating" },
      ],
      whyJoin: "Why Coaches Love Lingueefy",
      benefits: [
        {
          icon: Clock,
          title: "Flexible Schedule",
          description: "Set your own hours and work from anywhere. Accept bookings that fit your lifestyle.",
          color: "bg-blue-100 text-blue-600",
        },
        {
          icon: DollarSign,
          title: "Competitive Earnings",
          description: "Earn $40-$100+ per hour with our transparent commission structure. Weekly payouts via Stripe.",
          color: "bg-emerald-100 text-emerald-600",
        },
        {
          icon: Users,
          title: "Targeted Audience",
          description: "Connect with motivated federal public servants who need your expertise for career advancement.",
          color: "bg-purple-100 text-purple-600",
        },
        {
          icon: Award,
          title: "Professional Growth",
          description: "Access SLE-specific training materials, community support, and professional development resources.",
          color: "bg-amber-100 text-amber-600",
        },
        {
          icon: Shield,
          title: "Secure Platform",
          description: "Automated scheduling, secure payments, and built-in video conferencing. Focus on teaching.",
          color: "bg-teal-100 text-teal-600",
        },
        {
          icon: TrendingUp,
          title: "Build Your Brand",
          description: "Create a professional profile, collect reviews, and grow your coaching business with us.",
          color: "bg-rose-100 text-rose-600",
        },
      ],
      requirements: "What We're Looking For",
      requirementsList: [
        { icon: Globe, text: "Fluent in French and/or English (native or near-native level)" },
        { icon: GraduationCap, text: "Experience teaching or tutoring languages to adults" },
        { icon: Briefcase, text: "Understanding of Canadian federal SLE requirements (preferred)" },
        { icon: Zap, text: "Reliable internet connection and quiet workspace" },
        { icon: Heart, text: "Passion for helping others achieve their language goals" },
      ],
      howItWorks: "How It Works",
      steps: [
        { step: "1", title: "Apply", description: "Complete our comprehensive application form with your qualifications and experience." },
        { step: "2", title: "Review", description: "Our team reviews your application within 2-3 business days." },
        { step: "3", title: "Onboard", description: "Complete your profile, set your availability, and connect your Stripe account." },
        { step: "4", title: "Start Coaching", description: "Accept bookings and start helping learners achieve their SLE goals!" },
      ],
      testimonials: "What Our Coaches Say",
      coachTestimonials: [
        {
          name: "Marie-Claire D.",
          role: "French Coach",
          image: "/images/coaches/sue-anne-richer.jpg",
          quote: "Lingueefy has transformed my coaching career. The platform handles all the admin work so I can focus on what I love - teaching!",
          rating: 5,
        },
        {
          name: "Steven B.",
          role: "SLE Specialist",
          image: "/images/coaches/steven-barholere.jpg",
          quote: "The quality of students on Lingueefy is exceptional. They're motivated professionals who value my expertise.",
          rating: 5,
        },
        {
          name: "Erika S.",
          role: "Bilingual Coach",
          image: "/images/coaches/erika-seguin.jpg",
          quote: "I've doubled my income since joining Lingueefy. The commission structure rewards hard work.",
          rating: 5,
        },
      ],
      faq: "Frequently Asked Questions",
      faqs: [
        {
          q: "What is the commission structure?",
          a: "Lingueefy charges 15-26% commission based on your monthly volume. The more you teach, the lower your commission rate.",
        },
        {
          q: "How do I get paid?",
          a: "Payments are processed weekly via Stripe Connect. You'll receive your earnings directly to your bank account.",
        },
        {
          q: "Can I set my own rates?",
          a: "Yes! You have full control over your hourly rate and trial session pricing. We recommend $50-$100/hour based on experience.",
        },
        {
          q: "What equipment do I need?",
          a: "A computer with a webcam, microphone, and stable internet connection. Our platform handles video conferencing.",
        },
        {
          q: "Do I need SLE certification?",
          a: "While not required, having achieved SLE levels yourself is highly valued by learners and can help you attract more students.",
        },
      ],
      applyNow: "Start Your Application",
      loginToApply: "Sign in to apply",
      alreadyCoach: "Already a coach?",
      goToDashboard: "Go to Dashboard",
      successTitle: "Application Submitted!",
      successMessage: "Thank you for applying to become a Lingueefy coach. We'll review your application and get back to you within 2-3 business days.",
      successNext: "What's Next?",
      successSteps: [
        "Check your email for a confirmation message",
        "Our team will review your qualifications",
        "You'll receive an email with next steps",
        "Complete onboarding and start coaching!",
      ],
      backToHome: "Back to Home",
    },
    fr: {
      title: "Devenez coach Lingueefy",
      subtitle: "Rejoignez notre réseau de coachs linguistiques experts aidant les fonctionnaires canadiens à atteindre leurs objectifs ELS",
      heroStats: [
        { value: "500+", label: "Coachs actifs" },
        { value: "75$", label: "Tarif horaire moy." },
        { value: "15K+", label: "Sessions complétées" },
        { value: "4.9", label: "Note des coachs" },
      ],
      whyJoin: "Pourquoi les coachs adorent Lingueefy",
      benefits: [
        {
          icon: Clock,
          title: "Horaire flexible",
          description: "Définissez vos propres heures et travaillez de n'importe où. Acceptez les réservations qui conviennent à votre style de vie.",
          color: "bg-blue-100 text-blue-600",
        },
        {
          icon: DollarSign,
          title: "Revenus compétitifs",
          description: "Gagnez 40-100$+ par heure avec notre structure de commission transparente. Paiements hebdomadaires via Stripe.",
          color: "bg-emerald-100 text-emerald-600",
        },
        {
          icon: Users,
          title: "Public ciblé",
          description: "Connectez-vous avec des fonctionnaires fédéraux motivés qui ont besoin de votre expertise pour leur avancement professionnel.",
          color: "bg-purple-100 text-purple-600",
        },
        {
          icon: Award,
          title: "Croissance professionnelle",
          description: "Accédez à des matériaux de formation ELS, au soutien communautaire et aux ressources de développement professionnel.",
          color: "bg-amber-100 text-amber-600",
        },
        {
          icon: Shield,
          title: "Plateforme sécurisée",
          description: "Planification automatisée, paiements sécurisés et vidéoconférence intégrée. Concentrez-vous sur l'enseignement.",
          color: "bg-teal-100 text-teal-600",
        },
        {
          icon: TrendingUp,
          title: "Développez votre marque",
          description: "Créez un profil professionnel, collectez des avis et développez votre entreprise de coaching avec nous.",
          color: "bg-rose-100 text-rose-600",
        },
      ],
      requirements: "Ce que nous recherchons",
      requirementsList: [
        { icon: Globe, text: "Maîtrise du français et/ou de l'anglais (niveau natif ou quasi-natif)" },
        { icon: GraduationCap, text: "Expérience en enseignement ou tutorat de langues aux adultes" },
        { icon: Briefcase, text: "Compréhension des exigences ELS fédérales canadiennes (préféré)" },
        { icon: Zap, text: "Connexion Internet fiable et espace de travail calme" },
        { icon: Heart, text: "Passion pour aider les autres à atteindre leurs objectifs linguistiques" },
      ],
      howItWorks: "Comment ça fonctionne",
      steps: [
        { step: "1", title: "Postulez", description: "Complétez notre formulaire de candidature complet avec vos qualifications et expérience." },
        { step: "2", title: "Révision", description: "Notre équipe examine votre candidature dans les 2-3 jours ouvrables." },
        { step: "3", title: "Intégration", description: "Complétez votre profil, définissez votre disponibilité et connectez votre compte Stripe." },
        { step: "4", title: "Commencez", description: "Acceptez des réservations et commencez à aider les apprenants à atteindre leurs objectifs ELS!" },
      ],
      testimonials: "Ce que disent nos coachs",
      coachTestimonials: [
        {
          name: "Marie-Claire D.",
          role: "Coach de français",
          image: "/images/coaches/sue-anne-richer.jpg",
          quote: "Lingueefy a transformé ma carrière de coach. La plateforme gère tout le travail administratif pour que je puisse me concentrer sur ce que j'aime - enseigner!",
          rating: 5,
        },
        {
          name: "Steven B.",
          role: "Spécialiste ELS",
          image: "/images/coaches/steven-barholere.jpg",
          quote: "La qualité des étudiants sur Lingueefy est exceptionnelle. Ce sont des professionnels motivés qui valorisent mon expertise.",
          rating: 5,
        },
        {
          name: "Erika S.",
          role: "Coach bilingue",
          image: "/images/coaches/erika-seguin.jpg",
          quote: "J'ai doublé mes revenus depuis que j'ai rejoint Lingueefy. La structure de commission récompense le travail acharné.",
          rating: 5,
        },
      ],
      faq: "Questions fréquentes",
      faqs: [
        {
          q: "Quelle est la structure de commission?",
          a: "Lingueefy prélève 15-26% de commission selon votre volume mensuel. Plus vous enseignez, plus votre taux de commission est bas.",
        },
        {
          q: "Comment suis-je payé?",
          a: "Les paiements sont traités chaque semaine via Stripe Connect. Vous recevrez vos gains directement sur votre compte bancaire.",
        },
        {
          q: "Puis-je fixer mes propres tarifs?",
          a: "Oui! Vous avez le contrôle total sur votre tarif horaire et le prix de la session d'essai. Nous recommandons 50-100$/heure selon l'expérience.",
        },
        {
          q: "De quel équipement ai-je besoin?",
          a: "Un ordinateur avec webcam, microphone et connexion Internet stable. Notre plateforme gère la vidéoconférence.",
        },
        {
          q: "Ai-je besoin d'une certification ELS?",
          a: "Bien que non requis, avoir atteint des niveaux ELS vous-même est très valorisé par les apprenants et peut vous aider à attirer plus d'étudiants.",
        },
      ],
      applyNow: "Commencer votre candidature",
      loginToApply: "Connectez-vous pour postuler",
      alreadyCoach: "Déjà coach?",
      goToDashboard: "Aller au tableau de bord",
      successTitle: "Candidature soumise!",
      successMessage: "Merci d'avoir postulé pour devenir coach Lingueefy. Nous examinerons votre candidature et vous répondrons dans les 2-3 jours ouvrables.",
      successNext: "Prochaines étapes",
      successSteps: [
        "Vérifiez votre courriel pour un message de confirmation",
        "Notre équipe examinera vos qualifications",
        "Vous recevrez un courriel avec les prochaines étapes",
        "Complétez l'intégration et commencez à coacher!",
      ],
      backToHome: "Retour à l'accueil",
    },
  };

  const l = labels[language];

  // Success state after application - show status tracker
  if (applicationComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{l.successTitle}</h1>
              <p className="text-muted-foreground">{l.successMessage}</p>
            </div>
            
            {/* Application Status Tracker */}
            <ApplicationStatusTracker />
            
            <div className="mt-8 text-center">
              <a href="/">
                <Button variant="outline" className="gap-2">
                  {l.backToHome}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Application form view
  if (showApplication && isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <CoachApplicationWizard
              onComplete={() => setApplicationComplete(true)}
              onCancel={() => setShowApplication(false)}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                {isEn ? "Now Accepting Applications" : "Candidatures ouvertes"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {l.title}
              </h1>
              <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                {l.subtitle}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {l.heroStats.map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-teal-200">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated ? (
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 gap-2 w-full sm:w-auto">
                      {l.loginToApply}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Button
                    size="lg"
                    className="bg-white text-teal-700 hover:bg-teal-50 gap-2"
                    onClick={() => setShowApplication(true)}
                  >
                    {l.applyNow}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2">
                  <Play className="h-4 w-4" />
                  {isEn ? "Watch Video" : "Voir la vidéo"}
                </Button>
              </div>

              {user?.role === "coach" && (
                <div className="mt-6 text-teal-200">
                  {l.alreadyCoach}{" "}
                  <a href="/coach/dashboard" className="text-white underline hover:no-underline">
                    {l.goToDashboard}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">{l.whyJoin}</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              {isEn 
                ? "Join a platform designed with coaches in mind. We handle the business side so you can focus on what you do best."
                : "Rejoignez une plateforme conçue pour les coachs. Nous gérons le côté affaires pour que vous puissiez vous concentrer sur ce que vous faites de mieux."}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {l.benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <Card key={i} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className={`h-12 w-12 rounded-xl ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{l.howItWorks}</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {l.steps.map((step, i) => (
                <div key={i} className="text-center relative">
                  {i < l.steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-teal-200" />
                  )}
                  <div className="relative z-10 h-16 w-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{l.requirements}</h2>
              <div className="space-y-4">
                {l.requirementsList.map((req, i) => {
                  const Icon = req.icon;
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-teal-600" />
                      </div>
                      <span className="text-lg">{req.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{l.testimonials}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {l.coachTestimonials.map((testimonial, i) => (
                <Card key={i} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      loading="lazy" />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{l.faq}</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {l.faqs.map((faq, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "Ready to Start Your Coaching Journey?" : "Prêt à commencer votre parcours de coach?"}
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              {isEn 
                ? "Join hundreds of coaches who are building successful careers on Lingueefy."
                : "Rejoignez des centaines de coachs qui construisent des carrières réussies sur Lingueefy."}
            </p>
            {!isAuthenticated ? (
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 gap-2">
                  {l.loginToApply}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 gap-2"
                onClick={() => setShowApplication(true)}
              >
                {l.applyNow}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

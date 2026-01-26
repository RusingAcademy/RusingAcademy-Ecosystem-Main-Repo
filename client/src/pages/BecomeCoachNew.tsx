import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoachApplicationWizard } from "@/components/CoachApplicationWizard";
import { ApplicationStatusTracker } from "@/components/ApplicationStatusTracker";
import {
  Users,
  DollarSign,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Shield,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Heart,
  Zap,
  Sparkles,
  Calendar,
  Video,
  Camera,
  FileText,
  Lock,
  Eye,
  UserCheck,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { getLoginUrl } from "@/const";
// EcosystemHeaderGold is provided by EcosystemLayout
import { cn } from "@/lib/utils";

export default function BecomeCoachNew() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showApplication, setShowApplication] = useState(false);
  const [applicationComplete, setApplicationComplete] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const isEn = language === "en";

  const labels = {
    en: {
      // Hero
      heroTitle: "Transform Your Expertise",
      heroTitleHighlight: "Into a Thriving Career",
      heroLead: "Join Canada's leading SLE preparation platform where thousands of public servants find their perfect language coach daily.",
      heroBenefits: [
        { icon: Calendar, text: "Organize your schedule" },
        { icon: Video, text: "Give lessons online or in person" },
        { icon: DollarSign, text: "Set your rates ($25-$100+ per hour)" },
      ],
      heroAudience: "Teachers, tutors, language professionals, government employees with SLE experience...",
      heroCta: "Register with Lingueefy and start coaching today!",
      
      // Form
      formTitle: "Create your coach profile",
      formFirstName: "First Name",
      formLastName: "Last Name",
      formEmail: "Email",
      formPassword: "Password",
      formSubmit: "Sign up by email",
      formTerms: "By clicking Continue or Sign up, you agree to Lingueefy",
      formTermsLink: "Terms of Use",
      formTermsExtra: ", including Subscription Terms and Privacy Policy",
      formOr: "or",
      formGoogle: "Sign up with Google",
      
      // How it works
      howItWorksTitle: "How it works",
      howItWorksSubtitle: "Getting started is simple. Follow these three steps to begin your coaching journey.",
      steps: [
        {
          number: "01",
          title: "Create your profile",
          description: "Fill out your professional information, upload a photo, and record a short introduction video. Highlight your SLE expertise and teaching experience.",
          duration: "15 minutes",
        },
        {
          number: "02",
          title: "Add availability & services",
          description: "Set your schedule, define your hourly rate, and specify which SLE levels you teach (Oral A/B/C, Written, Reading). Connect your Stripe account for payments.",
          duration: "10 minutes",
        },
        {
          number: "03",
          title: "Get approved & start coaching",
          description: "Our team reviews your application within 2-3 business days. Once approved, your profile goes live and learners can book sessions with you.",
          duration: "2-3 days",
        },
      ],
      
      // Requirements
      requirementsTitle: "Requirements",
      requirementsSubtitle: "Who can become a Lingueefy coach?",
      qualifications: {
        title: "Qualifications",
        items: [
          "Native or near-native fluency in French and/or English",
          "Experience teaching or tutoring languages to adults",
          "Understanding of Canadian federal SLE requirements (preferred)",
          "Strong communication and interpersonal skills",
        ],
      },
      contentNeeded: {
        title: "What you'll need",
        items: [
          "Professional headshot photo",
          "Short introduction video (1-2 minutes)",
          "Bio highlighting your teaching experience",
          "Credentials or certifications (if applicable)",
        ],
      },
      timeline: {
        title: "Review process",
        items: [
          "Application review: 2-3 business days",
          "Profile approval: Same day after review",
          "First booking: Within 1 week of going live",
        ],
      },
      
      // Safety & Trust
      safetyTitle: "Safety & Trust",
      safetySubtitle: "Your security and privacy are our top priorities.",
      safetyItems: [
        {
          icon: Lock,
          title: "Data Privacy",
          description: "Your personal information is encrypted and never shared with third parties. We comply with Canadian privacy laws.",
        },
        {
          icon: UserCheck,
          title: "Profile Verification",
          description: "All coach profiles are manually reviewed by our team to ensure quality and authenticity.",
        },
        {
          icon: Shield,
          title: "Secure Payments",
          description: "Payments are processed securely through Stripe. You receive weekly payouts directly to your bank account.",
        },
        {
          icon: Eye,
          title: "Content Moderation",
          description: "We maintain high standards for all content on the platform. Inappropriate behavior results in immediate removal.",
        },
      ],
      
      // FAQ
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "How long does the application process take?",
          a: "The initial application takes about 15-20 minutes to complete. Our team reviews applications within 2-3 business days. Once approved, you can start accepting bookings immediately.",
        },
        {
          q: "Can I edit my profile after it's published?",
          a: "Yes! You can update your bio, photo, video, availability, and rates at any time from your coach dashboard. Major changes may require re-approval.",
        },
        {
          q: "What are the video requirements?",
          a: "We recommend a 1-2 minute introduction video where you speak in your teaching language(s). Good lighting, clear audio, and a professional background are important. You can upload a video file or link to YouTube.",
        },
        {
          q: "What is the approval process?",
          a: "Our team reviews your qualifications, teaching experience, and profile content. We verify your language proficiency and ensure your profile meets our quality standards. You'll receive an email with the decision.",
        },
        {
          q: "Who will see my profile?",
          a: "Your public profile is visible to all Lingueefy users searching for coaches. Personal contact information (email, phone) is kept private until a learner books a session with you.",
        },
        {
          q: "What is the commission structure?",
          a: "Lingueefy charges 15-26% commission based on your monthly volume. The more you teach, the lower your commission rate. You keep 74-85% of your earnings.",
        },
        {
          q: "Do I need SLE certification?",
          a: "While not required, having achieved SLE levels yourself is highly valued by learners. Many successful coaches are current or former public servants who passed their own SLE exams.",
        },
      ],
      
      // Why Coaches Love Lingueefy
      whyJoinTitle: "Why Coaches Love Lingueefy",
      whyJoinSubtitle: "Join a platform designed with coaches in mind. We handle the business side so you can focus on what you do best.",
      benefits: [
        {
          icon: Clock,
          title: "Flexible Schedule",
          description: "Set your own hours and work from anywhere. Accept bookings that fit your lifestyle.",
        },
        {
          icon: DollarSign,
          title: "Competitive Earnings",
          description: "Earn $40-$100+ per hour with our transparent commission structure. Weekly payouts via Stripe.",
        },
        {
          icon: Users,
          title: "Targeted Audience",
          description: "Connect with motivated federal public servants who need your expertise for career advancement.",
        },
        {
          icon: Award,
          title: "Professional Growth",
          description: "Access SLE-specific training materials, community support, and professional development resources.",
        },
        {
          icon: Shield,
          title: "Secure Platform",
          description: "Automated scheduling, secure payments, and built-in video conferencing. Focus on teaching.",
        },
        {
          icon: TrendingUp,
          title: "Build Your Brand",
          description: "Create a professional profile, collect reviews, and grow your coaching business with us.",
        },
      ],
      
      // Earning Potential
      earningTitle: "Earn What You Deserve",
      earningSubtitle: "Our transparent commission structure rewards your hard work. The more you teach, the more you keep.",
      earningFeatures: [
        { title: "Weekly Payouts", subtitle: "Via Stripe Connect" },
        { title: "15-26% Commission", subtitle: "Volume-based tiers" },
        { title: "You Set Your Rates", subtitle: "$25-$100+/hour" },
      ],
      earningExamples: [
        { sessions: "20 sessions/month", amount: "$1,000+" },
        { sessions: "40 sessions/month", amount: "$2,000+" },
        { sessions: "60+ sessions/month", amount: "$3,000+" },
      ],
      earningNote: "* Based on $50/hour rate with volume discounts",
      
      // Testimonials
      testimonialsTitle: "What Our Coaches Say",
      coachTestimonials: [
        {
          name: "Sue-Anne R.",
          role: "SLE Confidence Coach",
          image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/sue-anne-richer.jpg",
          quote: "Lingueefy has transformed my coaching career. The platform handles all the admin work so I can focus on what I love - teaching!",
          rating: 5,
        },
        {
          name: "Steven B.",
          role: "SLE Specialist",
          image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/steven-barholere.jpg",
          quote: "The quality of students on Lingueefy is exceptional. They're motivated professionals who value my expertise.",
          rating: 5,
        },
        {
          name: "Erika S.",
          role: "Bilingual Coach",
          image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/erika-seguin.jpg",
          quote: "I've doubled my income since joining Lingueefy. The commission structure rewards hard work.",
          rating: 5,
        },
      ],
      
      // CTA
      ctaTitle: "Ready to start your coaching journey?",
      ctaSubtitle: "Join hundreds of coaches who are building successful careers on Lingueefy.",
      ctaButton: "Start Your Application",
      ctaLoginButton: "Sign in to apply",
      ctaTrust: [
        "Free to join",
        "Weekly payouts",
        "No minimum hours",
      ],
    },
    fr: {
      // Hero
      heroTitle: "Transformez votre expertise",
      heroTitleHighlight: "en carrière florissante",
      heroLead: "Rejoignez la principale plateforme de préparation ELS du Canada où des milliers de fonctionnaires trouvent leur coach linguistique idéal chaque jour.",
      heroBenefits: [
        { icon: Calendar, text: "Organisez votre emploi du temps" },
        { icon: Video, text: "Donnez des cours en ligne ou en personne" },
        { icon: DollarSign, text: "Fixez vos tarifs (25-100$+ par heure)" },
      ],
      heroAudience: "Enseignants, tuteurs, professionnels des langues, employés du gouvernement avec expérience ELS...",
      heroCta: "Inscrivez-vous sur Lingueefy et commencez à coacher aujourd'hui!",
      
      // Form
      formTitle: "Créez votre profil de coach",
      formFirstName: "Prénom",
      formLastName: "Nom",
      formEmail: "Courriel",
      formPassword: "Mot de passe",
      formSubmit: "S'inscrire par courriel",
      formTerms: "En cliquant sur Continuer ou S'inscrire, vous acceptez les",
      formTermsLink: "Conditions d'utilisation",
      formTermsExtra: " de Lingueefy, y compris les Conditions d'abonnement et la Politique de confidentialité",
      formOr: "ou",
      formGoogle: "S'inscrire avec Google",
      
      // How it works
      howItWorksTitle: "Comment ça marche",
      howItWorksSubtitle: "Commencer est simple. Suivez ces trois étapes pour débuter votre parcours de coach.",
      steps: [
        {
          number: "01",
          title: "Créez votre profil",
          description: "Remplissez vos informations professionnelles, téléchargez une photo et enregistrez une courte vidéo d'introduction. Mettez en valeur votre expertise ELS et votre expérience d'enseignement.",
          duration: "15 minutes",
        },
        {
          number: "02",
          title: "Ajoutez disponibilité et services",
          description: "Définissez votre emploi du temps, votre tarif horaire et les niveaux ELS que vous enseignez (Oral A/B/C, Écrit, Lecture). Connectez votre compte Stripe pour les paiements.",
          duration: "10 minutes",
        },
        {
          number: "03",
          title: "Approbation et début du coaching",
          description: "Notre équipe examine votre candidature dans les 2-3 jours ouvrables. Une fois approuvé, votre profil est publié et les apprenants peuvent réserver des sessions.",
          duration: "2-3 jours",
        },
      ],
      
      // Requirements
      requirementsTitle: "Exigences",
      requirementsSubtitle: "Qui peut devenir coach Lingueefy?",
      qualifications: {
        title: "Qualifications",
        items: [
          "Maîtrise native ou quasi-native du français et/ou de l'anglais",
          "Expérience d'enseignement ou de tutorat de langues aux adultes",
          "Compréhension des exigences ELS du gouvernement fédéral canadien (préféré)",
          "Excellentes compétences en communication et relations interpersonnelles",
        ],
      },
      contentNeeded: {
        title: "Ce dont vous aurez besoin",
        items: [
          "Photo professionnelle",
          "Courte vidéo d'introduction (1-2 minutes)",
          "Bio mettant en valeur votre expérience d'enseignement",
          "Diplômes ou certifications (si applicable)",
        ],
      },
      timeline: {
        title: "Processus de révision",
        items: [
          "Examen de la candidature: 2-3 jours ouvrables",
          "Approbation du profil: Le jour même après examen",
          "Première réservation: Dans la semaine suivant la publication",
        ],
      },
      
      // Safety & Trust
      safetyTitle: "Sécurité et confiance",
      safetySubtitle: "Votre sécurité et votre vie privée sont nos priorités.",
      safetyItems: [
        {
          icon: Lock,
          title: "Protection des données",
          description: "Vos informations personnelles sont cryptées et jamais partagées avec des tiers. Nous respectons les lois canadiennes sur la vie privée.",
        },
        {
          icon: UserCheck,
          title: "Vérification des profils",
          description: "Tous les profils de coach sont examinés manuellement par notre équipe pour garantir qualité et authenticité.",
        },
        {
          icon: Shield,
          title: "Paiements sécurisés",
          description: "Les paiements sont traités de manière sécurisée via Stripe. Vous recevez des versements hebdomadaires directement sur votre compte bancaire.",
        },
        {
          icon: Eye,
          title: "Modération du contenu",
          description: "Nous maintenons des standards élevés pour tout le contenu sur la plateforme. Les comportements inappropriés entraînent un retrait immédiat.",
        },
      ],
      
      // FAQ
      faqTitle: "Questions fréquemment posées",
      faqs: [
        {
          q: "Combien de temps prend le processus de candidature?",
          a: "La candidature initiale prend environ 15-20 minutes. Notre équipe examine les candidatures dans les 2-3 jours ouvrables. Une fois approuvé, vous pouvez commencer à accepter des réservations immédiatement.",
        },
        {
          q: "Puis-je modifier mon profil après sa publication?",
          a: "Oui! Vous pouvez mettre à jour votre bio, photo, vidéo, disponibilité et tarifs à tout moment depuis votre tableau de bord. Les modifications majeures peuvent nécessiter une nouvelle approbation.",
        },
        {
          q: "Quelles sont les exigences pour la vidéo?",
          a: "Nous recommandons une vidéo d'introduction de 1-2 minutes où vous parlez dans votre(vos) langue(s) d'enseignement. Un bon éclairage, un son clair et un arrière-plan professionnel sont importants.",
        },
        {
          q: "Quel est le processus d'approbation?",
          a: "Notre équipe examine vos qualifications, votre expérience d'enseignement et le contenu de votre profil. Nous vérifions votre maîtrise linguistique et nous assurons que votre profil répond à nos standards de qualité.",
        },
        {
          q: "Qui verra mon profil?",
          a: "Votre profil public est visible par tous les utilisateurs Lingueefy recherchant des coachs. Vos coordonnées personnelles (courriel, téléphone) restent privées jusqu'à ce qu'un apprenant réserve une session.",
        },
        {
          q: "Quelle est la structure de commission?",
          a: "Lingueefy facture 15-26% de commission selon votre volume mensuel. Plus vous enseignez, plus votre taux de commission est bas. Vous gardez 74-85% de vos gains.",
        },
        {
          q: "Ai-je besoin d'une certification ELS?",
          a: "Bien que non requis, avoir atteint des niveaux ELS vous-même est très apprécié par les apprenants. Beaucoup de coachs à succès sont des fonctionnaires actuels ou anciens qui ont passé leurs propres examens ELS.",
        },
      ],
      
      // Why Coaches Love Lingueefy
      whyJoinTitle: "Pourquoi les coachs adorent Lingueefy",
      whyJoinSubtitle: "Rejoignez une plateforme conçue pour les coachs. Nous gérons le côté affaires pour que vous puissiez vous concentrer sur ce que vous faites de mieux.",
      benefits: [
        {
          icon: Clock,
          title: "Horaire flexible",
          description: "Définissez vos propres heures et travaillez de n'importe où. Acceptez les réservations qui conviennent à votre style de vie.",
        },
        {
          icon: DollarSign,
          title: "Revenus compétitifs",
          description: "Gagnez 40-100$+ par heure avec notre structure de commission transparente. Paiements hebdomadaires via Stripe.",
        },
        {
          icon: Users,
          title: "Public ciblé",
          description: "Connectez-vous avec des fonctionnaires fédéraux motivés qui ont besoin de votre expertise pour leur avancement professionnel.",
        },
        {
          icon: Award,
          title: "Croissance professionnelle",
          description: "Accédez à des matériaux de formation ELS, au soutien communautaire et aux ressources de développement professionnel.",
        },
        {
          icon: Shield,
          title: "Plateforme sécurisée",
          description: "Planification automatisée, paiements sécurisés et vidéoconférence intégrée. Concentrez-vous sur l'enseignement.",
        },
        {
          icon: TrendingUp,
          title: "Construisez votre marque",
          description: "Créez un profil professionnel, collectez des avis et développez votre activité de coaching avec nous.",
        },
      ],
      
      // Earning Potential
      earningTitle: "Gagnez ce que vous méritez",
      earningSubtitle: "Notre structure de commission transparente récompense votre travail acharné. Plus vous enseignez, plus vous gardez.",
      earningFeatures: [
        { title: "Paiements hebdomadaires", subtitle: "Via Stripe Connect" },
        { title: "15-26% de commission", subtitle: "Paliers basés sur le volume" },
        { title: "Vous fixez vos tarifs", subtitle: "25-100$+/heure" },
      ],
      earningExamples: [
        { sessions: "20 sessions/mois", amount: "1 000$+" },
        { sessions: "40 sessions/mois", amount: "2 000$+" },
        { sessions: "60+ sessions/mois", amount: "3 000$+" },
      ],
      earningNote: "* Basé sur un tarif de 50$/heure avec remises de volume",
      
      // Testimonials
      testimonialsTitle: "Ce que disent nos coachs",
      coachTestimonials: [
        {
          name: "Sue-Anne R.",
          role: "Coach confiance ELS",
          image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/sue-anne-richer.jpg",
          quote: "Lingueefy a transformé ma carrière de coach. La plateforme gère tout le travail administratif pour que je puisse me concentrer sur ce que j'aime - enseigner!",
          rating: 5,
        },
        {
          name: "Steven B.",
          role: "Spécialiste ELS",
          image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/steven-barholere.jpg",
          quote: "La qualité des étudiants sur Lingueefy est exceptionnelle. Ce sont des professionnels motivés qui valorisent mon expertise.",
          rating: 5,
        },
        {
          name: "Erika S.",
          role: "Coach bilingue",
          image: "https://rusingacademy-cdn.b-cdn.net/images/coaches/erika-seguin.jpg",
          quote: "J'ai doublé mes revenus depuis que j'ai rejoint Lingueefy. La structure de commission récompense le travail acharné.",
          rating: 5,
        },
      ],
      
      // CTA
      ctaTitle: "Prêt à commencer votre parcours de coach?",
      ctaSubtitle: "Rejoignez des centaines de coachs qui construisent des carrières réussies sur Lingueefy.",
      ctaButton: "Commencer ma candidature",
      ctaLoginButton: "Se connecter pour postuler",
      ctaTrust: [
        "Inscription gratuite",
        "Paiements hebdomadaires",
        "Pas d'heures minimum",
      ],
    },
  };

  const l = labels[language] || labels.en;

  // Application success view
  if (applicationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{isEn ? "Application Submitted!" : "Candidature soumise!"}</h1>
            <p className="text-muted-foreground mb-6">
              {isEn 
                ? "Thank you for applying to become a Lingueefy coach. We'll review your application and get back to you within 2-3 business days."
                : "Merci d'avoir postulé pour devenir coach Lingueefy. Nous examinerons votre candidature et vous répondrons dans les 2-3 jours ouvrables."}
            </p>
            <a href="/">
              <Button variant="outline" className="gap-2">
                {isEn ? "Back to Home" : "Retour à l'accueil"}
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Application wizard view
  if (showApplication && isAuthenticated) {
    return (
      <>
        <div className="container py-8 bg-slate-50 min-h-screen">
          <ApplicationStatusTracker />
          <CoachApplicationWizard
            onComplete={() => setApplicationComplete(true)}
            onCancel={() => setShowApplication(false)}
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="bg-white">
        {/* Hero Section - Superprof-inspired Split Layout */}
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-amber-100/50 to-transparent" />
          
          <div className="container relative py-16 md:py-24 px-4 md:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Column - Content */}
              <div className="max-w-xl">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-slate-900 mb-6 leading-tight">
                  {l.heroTitle}
                  <br />
                  <span className="text-teal-600">{l.heroTitleHighlight}</span>
                </h1>

                {/* Lead text */}
                <p className="text-lg text-slate-600 mb-8">
                  {l.heroLead}
                </p>

                {/* Benefits list */}
                <div className="space-y-4 mb-8">
                  {l.heroBenefits.map((benefit, i) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-teal-600" />
                        </div>
                        <span className="text-slate-700">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Audience */}
                <p className="text-sm text-slate-500 mb-4">
                  {l.heroAudience}
                </p>

                {/* CTA text */}
                <p className="text-slate-700 font-medium">
                  {l.heroCta}
                </p>
              </div>

              {/* Right Column - Registration Form */}
              <div className="lg:sticky lg:top-24">
                <Card className="shadow-2xl shadow-slate-200/50 border-0">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">{l.formTitle}</h2>

                    {/* Social login buttons */}
                    <div className="space-y-3 mb-6">
                      <Button 
                        variant="outline" 
                        className="w-full justify-center gap-3 h-12 bg-white hover:bg-slate-50"
                        onClick={() => {
                          if (!isAuthenticated) {
                            window.location.href = getLoginUrl();
                          } else {
                            setShowApplication(true);
                          }
                        }}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {l.formGoogle}
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">{l.formOr}</span>
                      </div>
                    </div>

                    {/* Email form */}
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      if (!isAuthenticated) {
                        window.location.href = getLoginUrl();
                      } else {
                        setShowApplication(true);
                      }
                    }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="sr-only">{l.formFirstName}</Label>
                          <Input 
                            id="firstName" 
                            placeholder={l.formFirstName}
                            className="h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="sr-only">{l.formLastName}</Label>
                          <Input 
                            id="lastName" 
                            placeholder={l.formLastName}
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="sr-only">{l.formEmail}</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder={l.formEmail}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="sr-only">{l.formPassword}</Label>
                        <Input 
                          id="password" 
                          type="password"
                          placeholder={l.formPassword}
                          className="h-12"
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                      >
                        {l.formSubmit}
                      </Button>
                    </form>

                    {/* Terms */}
                    <p className="text-xs text-center text-slate-500 mt-4">
                      {l.formTerms}{" "}
                      <a href="/terms" className="text-teal-600 hover:underline">{l.formTermsLink}</a>
                      {l.formTermsExtra}.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Editorial Layout with Large Numbers */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{l.howItWorksTitle}</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">{l.howItWorksSubtitle}</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {l.steps.map((step, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "grid md:grid-cols-[120px_1fr] gap-8 pb-12 mb-12",
                    i < l.steps.length - 1 && "border-b border-slate-100"
                  )}
                >
                  {/* Large number */}
                  <div className="text-7xl md:text-8xl font-bold leading-none" style={{color: '#0d6349'}}>
                    {step.number}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{step.description}</p>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{l.requirementsTitle}</h2>
              <p className="text-lg text-slate-600">{l.requirementsSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Qualifications */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{l.qualifications.title}</h3>
                  <ul className="space-y-3">
                    {l.qualifications.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500 mt-1 shrink-0" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Content Needed */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{l.contentNeeded.title}</h3>
                  <ul className="space-y-3">
                    {l.contentNeeded.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{l.timeline.title}</h3>
                  <ul className="space-y-3">
                    {l.timeline.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Safety & Trust Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Shield className="h-4 w-4 mr-2" />
                {isEn ? "Your Security Matters" : "Votre sécurité compte"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{l.safetyTitle}</h2>
              <p className="text-lg text-slate-600">{l.safetySubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {l.safetyItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center p-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Coaches Love Lingueefy */}
        <section className="py-20 bg-slate-50">
          <div className="container pl-4 md:pl-8 lg:pl-12">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200">
                {isEn ? "Benefits" : "Avantages"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{l.whyJoinTitle}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{l.whyJoinSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {l.benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                const colors = [
                  "bg-blue-100 text-blue-600",
                  "bg-emerald-100 text-emerald-600",
                  "bg-purple-100 text-purple-600",
                  "bg-amber-100 text-amber-600",
                  "bg-teal-100 text-teal-600",
                  "bg-rose-100 text-rose-600",
                ];
                return (
                  <Card key={i} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                    <CardContent className="pt-6">
                      <div className={`h-12 w-12 rounded-xl ${colors[i]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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

        {/* Earning Potential */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                    {isEn ? "Earning Potential" : "Potentiel de revenus"}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{l.earningTitle}</h2>
                  <p className="text-muted-foreground mb-6">{l.earningSubtitle}</p>

                  <div className="space-y-4">
                    {l.earningFeatures.map((feature, i) => {
                      const icons = [Briefcase, TrendingUp, DollarSign];
                      const colors = ["bg-teal-100 text-teal-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600"];
                      const Icon = icons[i];
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg ${colors[i]} flex items-center justify-center`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{feature.title}</div>
                            <div className="text-sm text-muted-foreground">{feature.subtitle}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-semibold mb-6">{isEn ? "Example Monthly Earnings" : "Exemple de revenus mensuels"}</h3>
                  <div className="space-y-4">
                    {l.earningExamples.map((example, i) => (
                      <div key={i} className={`flex justify-between items-center py-3 ${i < l.earningExamples.length - 1 ? "border-b border-white/20" : ""}`}>
                        <span className="text-teal-200">{example.sessions}</span>
                        <span className="text-2xl font-bold">{example.amount}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-4" style={{color: '#f9fafa'}}>{l.earningNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
                {isEn ? "Success Stories" : "Témoignages"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{l.testimonialsTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {l.coachTestimonials.map((testimonial, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
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
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-100"
                      />
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

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{l.faqTitle}</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {l.faqs.map((faq, i) => (
                <Card 
                  key={i} 
                  className={cn(
                    "border-0 shadow-sm transition-all cursor-pointer",
                    expandedFaq === i && "shadow-lg"
                  )}
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                      {expandedFaq === i ? (
                        <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                    </div>
                    {expandedFaq === i && (
                      <p className="text-slate-600 mt-4 leading-relaxed">{faq.a}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container relative text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              {isEn ? "Start Today" : "Commencez aujourd'hui"}
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {l.ctaTitle}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{color: '#fcfcfd'}}>
              {l.ctaSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {!isAuthenticated ? (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 shadow-xl gap-2 w-full sm:w-auto">
                    {l.ctaLoginButton}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Button
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-teal-50 shadow-xl gap-2"
                  onClick={() => setShowApplication(true)}
                >
                  {l.ctaButton}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-teal-200">
              {l.ctaTrust.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

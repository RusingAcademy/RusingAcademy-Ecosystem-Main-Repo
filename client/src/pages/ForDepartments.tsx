import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Calendar,
  FileText,
  Shield,
  Clock,
  Target,
  BarChart3,
  Headphones,
  ArrowRight,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function ForDepartments() {
  const { language } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const labels = {
    en: {
      badge: "Enterprise Solutions",
      title: "Language Training for",
      titleHighlight: "Government Teams",
      subtitle: "Empower your department with scalable, results-driven SLE preparation. Lingueefy helps federal teams achieve their bilingual requirements efficiently and cost-effectively.",
      ctaPrimary: "Request a Demo",
      ctaSecondary: "Download Brochure",
      
      // Stats
      stat1Value: "94%",
      stat1Label: "SLE Pass Rate",
      stat2Value: "500+",
      stat2Label: "Public Servants Trained",
      stat3Value: "50+",
      stat3Label: "Departments Served",
      stat4Value: "4.8/5",
      stat4Label: "Client Satisfaction",
      
      // Benefits section
      benefitsTitle: "Why Departments Choose Lingueefy",
      benefitsSubtitle: "Purpose-built for the unique needs of Canadian federal government language training",
      
      benefit1Title: "SLE-Focused Curriculum",
      benefit1Desc: "Our coaches specialize exclusively in SLE preparation, with proven methodologies for Oral A, B, and C levels.",
      
      benefit2Title: "Flexible Scheduling",
      benefit2Desc: "Sessions available early morning to late evening, accommodating diverse work schedules across time zones.",
      
      benefit3Title: "Progress Tracking",
      benefit3Desc: "Real-time dashboards showing team progress, session completion rates, and predicted SLE readiness.",
      
      benefit4Title: "Dedicated Account Manager",
      benefit4Desc: "A single point of contact to coordinate training schedules, handle billing, and ensure team success.",
      
      benefit5Title: "Secure & Compliant",
      benefit5Desc: "Canadian-hosted platform meeting federal security requirements. No data leaves Canada.",
      
      benefit6Title: "Cost-Effective",
      benefit6Desc: "Volume discounts and flexible payment terms. No upfront costs for unused sessions.",
      
      // Packages section
      packagesTitle: "Team Training Packages",
      packagesSubtitle: "Scalable solutions for teams of any size",
      
      package1Name: "Starter Team",
      package1Size: "5 Employees",
      package1Price: "$4,500",
      package1Period: "per quarter",
      package1Features: ["20 sessions per employee", "Group progress dashboard", "Email support", "Quarterly progress report"],
      
      package2Name: "Growth Team",
      package2Size: "10 Employees",
      package2Price: "$8,000",
      package2Period: "per quarter",
      package2Features: ["25 sessions per employee", "Dedicated account manager", "Priority scheduling", "Monthly progress reports", "Custom curriculum options"],
      package2Popular: "Most Popular",
      
      package3Name: "Enterprise",
      package3Size: "25+ Employees",
      package3Price: "Custom",
      package3Period: "contact us",
      package3Features: ["Unlimited sessions", "On-site training options", "API integration", "Custom reporting", "SLA guarantees", "Invoice billing"],
      
      // Testimonials
      testimonialsTitle: "Trusted by Federal Departments",
      testimonial1Quote: "Lingueefy helped our team of 15 analysts achieve their bilingual requirements in just 6 months. The progress tracking made it easy to report to senior management.",
      testimonial1Author: "Director, Policy Branch",
      testimonial1Dept: "Treasury Board Secretariat",
      
      testimonial2Quote: "The flexibility of scheduling around our operational demands was crucial. Our officers could train without impacting service delivery.",
      testimonial2Author: "Regional Manager",
      testimonial2Dept: "Immigration, Refugees and Citizenship Canada",
      
      testimonial3Quote: "We've tried several language training providers. Lingueefy's SLE-specific approach and coach quality are unmatched.",
      testimonial3Author: "HR Director",
      testimonial3Dept: "Health Canada",
      
      // Process section
      processTitle: "How It Works",
      processSubtitle: "Getting started is simple",
      
      process1Title: "Initial Consultation",
      process1Desc: "We assess your team's current levels and training goals",
      
      process2Title: "Custom Training Plan",
      process2Desc: "Receive a tailored curriculum and schedule for your team",
      
      process3Title: "Coach Matching",
      process3Desc: "We match each employee with the ideal coach for their level",
      
      process4Title: "Training & Tracking",
      process4Desc: "Sessions begin with real-time progress monitoring",
      
      // Contact form
      contactTitle: "Request a Consultation",
      contactSubtitle: "Tell us about your team's language training needs",
      formName: "Your Name",
      formEmail: "Work Email",
      formDepartment: "Department",
      formTeamSize: "Team Size",
      formTeamSizePlaceholder: "Select team size",
      formTeamSize5: "1-5 employees",
      formTeamSize10: "6-10 employees",
      formTeamSize25: "11-25 employees",
      formTeamSize50: "26-50 employees",
      formTeamSize100: "50+ employees",
      formMessage: "Tell us about your training needs",
      formSubmit: "Request Consultation",
      formSuccess: "Thank you! We'll be in touch within 24 hours.",
      
      // FAQ
      faqTitle: "Frequently Asked Questions",
      faq1Q: "Can we use our departmental training budget?",
      faq1A: "Yes, Lingueefy is an approved vendor for most federal departments. We can provide quotes and invoices compatible with your procurement process.",
      
      faq2Q: "What if an employee leaves mid-training?",
      faq2A: "Unused sessions can be transferred to another team member or credited to your account for future use.",
      
      faq3Q: "Do you offer group sessions?",
      faq3A: "Yes, we offer both 1-on-1 coaching and small group sessions (up to 4 participants) for team-building and peer learning.",
      
      faq4Q: "How do you measure progress?",
      faq4A: "Each session includes assessment notes. We provide monthly reports with predicted SLE readiness scores based on our proprietary evaluation framework.",
    },
    fr: {
      badge: "Solutions Entreprise",
      title: "Formation linguistique pour les",
      titleHighlight: "équipes gouvernementales",
      subtitle: "Donnez à votre ministère une préparation aux ELS évolutive et axée sur les résultats. Lingueefy aide les équipes fédérales à atteindre leurs exigences bilingues de manière efficace et rentable.",
      ctaPrimary: "Demander une démo",
      ctaSecondary: "Télécharger la brochure",
      
      // Stats
      stat1Value: "94%",
      stat1Label: "Taux de réussite ELS",
      stat2Value: "500+",
      stat2Label: "Fonctionnaires formés",
      stat3Value: "50+",
      stat3Label: "Ministères servis",
      stat4Value: "4.8/5",
      stat4Label: "Satisfaction client",
      
      // Benefits section
      benefitsTitle: "Pourquoi les ministères choisissent Lingueefy",
      benefitsSubtitle: "Conçu spécifiquement pour les besoins uniques de la formation linguistique du gouvernement fédéral canadien",
      
      benefit1Title: "Programme axé sur les ELS",
      benefit1Desc: "Nos coachs se spécialisent exclusivement dans la préparation aux ELS, avec des méthodologies éprouvées pour les niveaux oraux A, B et C.",
      
      benefit2Title: "Horaires flexibles",
      benefit2Desc: "Sessions disponibles tôt le matin jusqu'en soirée, accommodant divers horaires de travail à travers les fuseaux horaires.",
      
      benefit3Title: "Suivi des progrès",
      benefit3Desc: "Tableaux de bord en temps réel montrant les progrès de l'équipe, les taux de complétion et la préparation prévue aux ELS.",
      
      benefit4Title: "Gestionnaire de compte dédié",
      benefit4Desc: "Un point de contact unique pour coordonner les horaires de formation, gérer la facturation et assurer le succès de l'équipe.",
      
      benefit5Title: "Sécurisé et conforme",
      benefit5Desc: "Plateforme hébergée au Canada répondant aux exigences de sécurité fédérales. Aucune donnée ne quitte le Canada.",
      
      benefit6Title: "Rentable",
      benefit6Desc: "Remises sur volume et conditions de paiement flexibles. Pas de frais initiaux pour les sessions non utilisées.",
      
      // Packages section
      packagesTitle: "Forfaits de formation d'équipe",
      packagesSubtitle: "Solutions évolutives pour les équipes de toutes tailles",
      
      package1Name: "Équipe Débutante",
      package1Size: "5 Employés",
      package1Price: "4 500 $",
      package1Period: "par trimestre",
      package1Features: ["20 sessions par employé", "Tableau de bord de groupe", "Support par courriel", "Rapport trimestriel"],
      
      package2Name: "Équipe Croissance",
      package2Size: "10 Employés",
      package2Price: "8 000 $",
      package2Period: "par trimestre",
      package2Features: ["25 sessions par employé", "Gestionnaire de compte dédié", "Planification prioritaire", "Rapports mensuels", "Options de programme personnalisé"],
      package2Popular: "Le plus populaire",
      
      package3Name: "Entreprise",
      package3Size: "25+ Employés",
      package3Price: "Sur mesure",
      package3Period: "contactez-nous",
      package3Features: ["Sessions illimitées", "Options de formation sur place", "Intégration API", "Rapports personnalisés", "Garanties SLA", "Facturation"],
      
      // Testimonials
      testimonialsTitle: "Approuvé par les ministères fédéraux",
      testimonial1Quote: "Lingueefy a aidé notre équipe de 15 analystes à atteindre leurs exigences bilingues en seulement 6 mois. Le suivi des progrès a facilité les rapports à la haute direction.",
      testimonial1Author: "Directeur, Direction des politiques",
      testimonial1Dept: "Secrétariat du Conseil du Trésor",
      
      testimonial2Quote: "La flexibilité de planification autour de nos demandes opérationnelles était cruciale. Nos agents pouvaient se former sans impact sur la prestation de services.",
      testimonial2Author: "Gestionnaire régional",
      testimonial2Dept: "Immigration, Réfugiés et Citoyenneté Canada",
      
      testimonial3Quote: "Nous avons essayé plusieurs fournisseurs de formation linguistique. L'approche spécifique aux ELS de Lingueefy et la qualité des coachs sont inégalées.",
      testimonial3Author: "Directeur RH",
      testimonial3Dept: "Santé Canada",
      
      // Process section
      processTitle: "Comment ça fonctionne",
      processSubtitle: "Commencer est simple",
      
      process1Title: "Consultation initiale",
      process1Desc: "Nous évaluons les niveaux actuels et les objectifs de formation de votre équipe",
      
      process2Title: "Plan de formation personnalisé",
      process2Desc: "Recevez un programme et un calendrier adaptés à votre équipe",
      
      process3Title: "Jumelage des coachs",
      process3Desc: "Nous jumelons chaque employé avec le coach idéal pour son niveau",
      
      process4Title: "Formation et suivi",
      process4Desc: "Les sessions commencent avec un suivi des progrès en temps réel",
      
      // Contact form
      contactTitle: "Demander une consultation",
      contactSubtitle: "Parlez-nous des besoins de formation linguistique de votre équipe",
      formName: "Votre nom",
      formEmail: "Courriel professionnel",
      formDepartment: "Ministère",
      formTeamSize: "Taille de l'équipe",
      formTeamSizePlaceholder: "Sélectionner la taille",
      formTeamSize5: "1-5 employés",
      formTeamSize10: "6-10 employés",
      formTeamSize25: "11-25 employés",
      formTeamSize50: "26-50 employés",
      formTeamSize100: "50+ employés",
      formMessage: "Parlez-nous de vos besoins de formation",
      formSubmit: "Demander une consultation",
      formSuccess: "Merci! Nous vous contacterons dans les 24 heures.",
      
      // FAQ
      faqTitle: "Questions fréquentes",
      faq1Q: "Pouvons-nous utiliser notre budget de formation ministériel?",
      faq1A: "Oui, Lingueefy est un fournisseur approuvé pour la plupart des ministères fédéraux. Nous pouvons fournir des devis et factures compatibles avec votre processus d'approvisionnement.",
      
      faq2Q: "Que se passe-t-il si un employé part en cours de formation?",
      faq2A: "Les sessions non utilisées peuvent être transférées à un autre membre de l'équipe ou créditées à votre compte pour une utilisation future.",
      
      faq3Q: "Offrez-vous des sessions de groupe?",
      faq3A: "Oui, nous offrons à la fois du coaching 1-à-1 et des sessions en petit groupe (jusqu'à 4 participants) pour le renforcement d'équipe et l'apprentissage entre pairs.",
      
      faq4Q: "Comment mesurez-vous les progrès?",
      faq4A: "Chaque session comprend des notes d'évaluation. Nous fournissons des rapports mensuels avec des scores de préparation aux ELS prédits basés sur notre cadre d'évaluation propriétaire.",
    },
  };

  const t = labels[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Building2 className="h-4 w-4" />
                {t.badge}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t.title}{" "}
                <span className="text-primary">{t.titleHighlight}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {t.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  {t.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" /> {t.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{t.stat1Value}</div>
                <div className="text-sm text-muted-foreground">{t.stat1Label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{t.stat2Value}</div>
                <div className="text-sm text-muted-foreground">{t.stat2Label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{t.stat3Value}</div>
                <div className="text-sm text-muted-foreground">{t.stat3Label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{t.stat4Value}</div>
                <div className="text-sm text-muted-foreground">{t.stat4Label}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.benefitsTitle}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t.benefitsSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.benefit1Title}</h3>
                  <p className="text-muted-foreground text-sm">{t.benefit1Desc}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.benefit2Title}</h3>
                  <p className="text-muted-foreground text-sm">{t.benefit2Desc}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.benefit3Title}</h3>
                  <p className="text-muted-foreground text-sm">{t.benefit3Desc}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.benefit4Title}</h3>
                  <p className="text-muted-foreground text-sm">{t.benefit4Desc}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.benefit5Title}</h3>
                  <p className="text-muted-foreground text-sm">{t.benefit5Desc}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t.benefit6Title}</h3>
                  <p className="text-muted-foreground text-sm">{t.benefit6Desc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.packagesTitle}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t.packagesSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter Package */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-1">{t.package1Name}</div>
                    <div className="text-sm text-muted-foreground mb-4">{t.package1Size}</div>
                    <div className="text-4xl font-bold">{t.package1Price}</div>
                    <div className="text-sm text-muted-foreground">{t.package1Period}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.package1Features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    {t.ctaPrimary}
                  </Button>
                </CardContent>
              </Card>

              {/* Growth Package */}
              <Card className="border-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {t.package2Popular}
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-1">{t.package2Name}</div>
                    <div className="text-sm text-muted-foreground mb-4">{t.package2Size}</div>
                    <div className="text-4xl font-bold">{t.package2Price}</div>
                    <div className="text-sm text-muted-foreground">{t.package2Period}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.package2Features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">
                    {t.ctaPrimary}
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Package */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-1">{t.package3Name}</div>
                    <div className="text-sm text-muted-foreground mb-4">{t.package3Size}</div>
                    <div className="text-4xl font-bold">{t.package3Price}</div>
                    <div className="text-sm text-muted-foreground">{t.package3Period}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.package3Features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    {t.ctaPrimary}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.processTitle}</h2>
              <p className="text-muted-foreground">{t.processSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">{t.process1Title}</h3>
                <p className="text-sm text-muted-foreground">{t.process1Desc}</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">{t.process2Title}</h3>
                <p className="text-sm text-muted-foreground">{t.process2Desc}</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">{t.process3Title}</h3>
                <p className="text-sm text-muted-foreground">{t.process3Desc}</p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold mb-2">{t.process4Title}</h3>
                <p className="text-sm text-muted-foreground">{t.process4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.testimonialsTitle}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.testimonial1Quote}"</p>
                  <div>
                    <div className="font-semibold">{t.testimonial1Author}</div>
                    <div className="text-sm text-muted-foreground">{t.testimonial1Dept}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.testimonial2Quote}"</p>
                  <div>
                    <div className="font-semibold">{t.testimonial2Author}</div>
                    <div className="text-sm text-muted-foreground">{t.testimonial2Dept}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.testimonial3Quote}"</p>
                  <div>
                    <div className="font-semibold">{t.testimonial3Author}</div>
                    <div className="text-sm text-muted-foreground">{t.testimonial3Dept}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t.contactTitle}</h2>
                <p className="text-muted-foreground">{t.contactSubtitle}</p>
              </div>

              {formSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">{t.formSuccess}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.formName}</Label>
                          <Input id="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t.formEmail}</Label>
                          <Input id="email" type="email" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">{t.formDepartment}</Label>
                          <Input id="department" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teamSize">{t.formTeamSize}</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder={t.formTeamSizePlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">{t.formTeamSize5}</SelectItem>
                              <SelectItem value="10">{t.formTeamSize10}</SelectItem>
                              <SelectItem value="25">{t.formTeamSize25}</SelectItem>
                              <SelectItem value="50">{t.formTeamSize50}</SelectItem>
                              <SelectItem value="100">{t.formTeamSize100}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t.formMessage}</Label>
                        <Textarea id="message" rows={4} />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        {t.formSubmit}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.faqTitle}</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{t.faq1Q}</h3>
                  <p className="text-muted-foreground text-sm">{t.faq1A}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{t.faq2Q}</h3>
                  <p className="text-muted-foreground text-sm">{t.faq2A}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{t.faq3Q}</h3>
                  <p className="text-muted-foreground text-sm">{t.faq3A}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{t.faq4Q}</h3>
                  <p className="text-muted-foreground text-sm">{t.faq4A}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

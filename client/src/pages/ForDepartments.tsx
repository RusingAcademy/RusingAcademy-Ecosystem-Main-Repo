import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
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
  Sparkles,
  ChevronDown,
  Quote,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ForDepartments() {
  const { language } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
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
      badge: "Enterprise Solutions",
      title: "Language Training for",
      titleHighlight: "Government Teams",
      subtitle: "Empower your department with scalable, results-driven SLE preparation. Lingueefy helps federal teams achieve their bilingual requirements efficiently and cost-effectively.",
      ctaPrimary: "Request a Demo",
      ctaSecondary: "Download Brochure",
      
      stat1Value: "94%",
      stat1Label: "SLE Pass Rate",
      stat2Value: "500+",
      stat2Label: "Public Servants Trained",
      stat3Value: "50+",
      stat3Label: "Departments Served",
      stat4Value: "4.8/5",
      stat4Label: "Client Satisfaction",
      
      benefitsTitle: "Why Departments Choose Lingueefy",
      benefitsSubtitle: "Purpose-built for the unique needs of Canadian federal government language training",
      
      benefits: [
        { icon: Target, title: "SLE-Focused Curriculum", desc: "Our coaches specialize exclusively in SLE preparation, with proven methodologies for Oral A, B, and C levels.", color: "teal" },
        { icon: Clock, title: "Flexible Scheduling", desc: "Sessions available early morning to late evening, accommodating diverse work schedules across time zones.", color: "blue" },
        { icon: BarChart3, title: "Progress Tracking", desc: "Real-time dashboards showing team progress, session completion rates, and predicted SLE readiness.", color: "emerald" },
        { icon: Headphones, title: "Dedicated Account Manager", desc: "A single point of contact to coordinate training schedules, handle billing, and ensure team success.", color: "orange" },
        { icon: Shield, title: "Secure & Compliant", desc: "Canadian-hosted platform meeting federal security requirements. No data leaves Canada.", color: "rose" },
        { icon: TrendingUp, title: "Cost-Effective", desc: "Volume discounts and flexible payment terms. No upfront costs for unused sessions.", color: "amber" },
      ],
      
      packagesTitle: "Team Training Packages",
      packagesSubtitle: "Scalable solutions for teams of any size",
      
      packages: [
        { name: "Starter Team", size: "5 Employees", price: "$4,500", period: "per quarter", features: ["20 sessions per employee", "Group progress dashboard", "Email support", "Quarterly progress report"], popular: false },
        { name: "Growth Team", size: "10 Employees", price: "$8,000", period: "per quarter", features: ["25 sessions per employee", "Dedicated account manager", "Priority scheduling", "Monthly progress reports", "Custom curriculum options"], popular: true, popularLabel: "Most Popular" },
        { name: "Enterprise", size: "25+ Employees", price: "Custom", period: "contact us", features: ["Unlimited sessions", "On-site training options", "API integration", "Custom reporting", "SLA guarantees", "Invoice billing"], popular: false },
      ],
      
      testimonialsTitle: "Trusted by Federal Departments",
      testimonials: [
        { quote: "Lingueefy helped our team of 15 analysts achieve their bilingual requirements in just 6 months. The progress tracking made it easy to report to senior management.", author: "Director, Policy Branch", dept: "Treasury Board Secretariat" },
        { quote: "The flexibility of scheduling around our operational demands was crucial. Our officers could train without impacting service delivery.", author: "Regional Manager", dept: "Immigration, Refugees and Citizenship Canada" },
        { quote: "We've tried several language training providers. Lingueefy's SLE-specific approach and coach quality are unmatched.", author: "HR Director", dept: "Health Canada" },
      ],
      
      processTitle: "How It Works",
      processSubtitle: "Getting started is simple",
      process: [
        { title: "Initial Consultation", desc: "We assess your team's current levels and training goals" },
        { title: "Custom Training Plan", desc: "Receive a tailored curriculum and schedule for your team" },
        { title: "Coach Matching", desc: "We match each employee with the ideal coach for their level" },
        { title: "Training & Tracking", desc: "Sessions begin with real-time progress monitoring" },
      ],
      
      contactTitle: "Request a Consultation",
      contactSubtitle: "Tell us about your team's language training needs",
      formName: "Your Name",
      formEmail: "Work Email",
      formDepartment: "Department",
      formTeamSize: "Team Size",
      formTeamSizePlaceholder: "Select team size",
      formTeamSizes: ["1-5 employees", "6-10 employees", "11-25 employees", "26-50 employees", "50+ employees"],
      formMessage: "Tell us about your training needs",
      formSubmit: "Request Consultation",
      formSuccess: "Thank you! We'll be in touch within 24 hours.",
      
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "Can we use our departmental training budget?", a: "Yes, Lingueefy is an approved vendor for most federal departments. We can provide quotes and invoices compatible with your procurement process." },
        { q: "What if an employee leaves mid-training?", a: "Unused sessions can be transferred to another team member or credited to your account for future use." },
        { q: "Do you offer group sessions?", a: "Yes, we offer both 1-on-1 coaching and small group sessions (up to 4 participants) for team-building and peer learning." },
        { q: "How do you measure progress?", a: "Each session includes assessment notes. We provide monthly reports with predicted SLE readiness scores based on our proprietary evaluation framework." },
      ],
    },
    fr: {
      badge: "Solutions Entreprise",
      title: "Formation linguistique pour les",
      titleHighlight: "équipes gouvernementales",
      subtitle: "Donnez à votre ministère une préparation aux ELS évolutive et axée sur les résultats. Lingueefy aide les équipes fédérales à atteindre leurs exigences bilingues de manière efficace et rentable.",
      ctaPrimary: "Demander une démo",
      ctaSecondary: "Télécharger la brochure",
      
      stat1Value: "94%",
      stat1Label: "Taux de réussite ELS",
      stat2Value: "500+",
      stat2Label: "Fonctionnaires formés",
      stat3Value: "50+",
      stat3Label: "Ministères servis",
      stat4Value: "4.8/5",
      stat4Label: "Satisfaction client",
      
      benefitsTitle: "Pourquoi les ministères choisissent Lingueefy",
      benefitsSubtitle: "Conçu spécifiquement pour les besoins uniques de la formation linguistique du gouvernement fédéral canadien",
      
      benefits: [
        { icon: Target, title: "Programme axé sur les ELS", desc: "Nos coachs se spécialisent exclusivement dans la préparation aux ELS, avec des méthodologies éprouvées pour les niveaux oraux A, B et C.", color: "teal" },
        { icon: Clock, title: "Horaires flexibles", desc: "Sessions disponibles tôt le matin jusqu'en soirée, accommodant divers horaires de travail à travers les fuseaux horaires.", color: "blue" },
        { icon: BarChart3, title: "Suivi des progrès", desc: "Tableaux de bord en temps réel montrant les progrès de l'équipe, les taux de complétion et la préparation prévue aux ELS.", color: "emerald" },
        { icon: Headphones, title: "Gestionnaire de compte dédié", desc: "Un point de contact unique pour coordonner les horaires de formation, gérer la facturation et assurer le succès de l'équipe.", color: "orange" },
        { icon: Shield, title: "Sécurisé et conforme", desc: "Plateforme hébergée au Canada répondant aux exigences de sécurité fédérales. Aucune donnée ne quitte le Canada.", color: "rose" },
        { icon: TrendingUp, title: "Rentable", desc: "Remises sur volume et conditions de paiement flexibles. Pas de frais initiaux pour les sessions non utilisées.", color: "amber" },
      ],
      
      packagesTitle: "Forfaits de formation d'équipe",
      packagesSubtitle: "Solutions évolutives pour les équipes de toutes tailles",
      
      packages: [
        { name: "Équipe Débutante", size: "5 Employés", price: "4 500 $", period: "par trimestre", features: ["20 sessions par employé", "Tableau de bord de groupe", "Support par courriel", "Rapport trimestriel"], popular: false },
        { name: "Équipe Croissance", size: "10 Employés", price: "8 000 $", period: "par trimestre", features: ["25 sessions par employé", "Gestionnaire de compte dédié", "Planification prioritaire", "Rapports mensuels", "Options de programme personnalisé"], popular: true, popularLabel: "Le plus populaire" },
        { name: "Entreprise", size: "25+ Employés", price: "Sur mesure", period: "contactez-nous", features: ["Sessions illimitées", "Options de formation sur place", "Intégration API", "Rapports personnalisés", "Garanties SLA", "Facturation"], popular: false },
      ],
      
      testimonialsTitle: "Approuvé par les ministères fédéraux",
      testimonials: [
        { quote: "Lingueefy a aidé notre équipe de 15 analystes à atteindre leurs exigences bilingues en seulement 6 mois. Le suivi des progrès a facilité les rapports à la haute direction.", author: "Directeur, Direction des politiques", dept: "Secrétariat du Conseil du Trésor" },
        { quote: "La flexibilité de planification autour de nos demandes opérationnelles était cruciale. Nos agents pouvaient se former sans impact sur la prestation de services.", author: "Gestionnaire régional", dept: "Immigration, Réfugiés et Citoyenneté Canada" },
        { quote: "Nous avons essayé plusieurs fournisseurs de formation linguistique. L'approche spécifique aux ELS de Lingueefy et la qualité des coachs sont inégalées.", author: "Directeur RH", dept: "Santé Canada" },
      ],
      
      processTitle: "Comment ça fonctionne",
      processSubtitle: "Commencer est simple",
      process: [
        { title: "Consultation initiale", desc: "Nous évaluons les niveaux actuels et les objectifs de formation de votre équipe" },
        { title: "Plan de formation personnalisé", desc: "Recevez un programme et un calendrier adaptés à votre équipe" },
        { title: "Jumelage des coachs", desc: "Nous jumelons chaque employé avec le coach idéal pour son niveau" },
        { title: "Formation et suivi", desc: "Les sessions commencent avec un suivi des progrès en temps réel" },
      ],
      
      contactTitle: "Demander une consultation",
      contactSubtitle: "Parlez-nous des besoins de formation linguistique de votre équipe",
      formName: "Votre nom",
      formEmail: "Courriel professionnel",
      formDepartment: "Ministère",
      formTeamSize: "Taille de l'équipe",
      formTeamSizePlaceholder: "Sélectionner la taille",
      formTeamSizes: ["1-5 employés", "6-10 employés", "11-25 employés", "26-50 employés", "50+ employés"],
      formMessage: "Parlez-nous de vos besoins de formation",
      formSubmit: "Demander une consultation",
      formSuccess: "Merci! Nous vous contacterons dans les 24 heures.",
      
      faqTitle: "Questions fréquentes",
      faqs: [
        { q: "Pouvons-nous utiliser notre budget de formation ministériel?", a: "Oui, Lingueefy est un fournisseur approuvé pour la plupart des ministères fédéraux. Nous pouvons fournir des devis et factures compatibles avec votre processus d'approvisionnement." },
        { q: "Que se passe-t-il si un employé part en cours de formation?", a: "Les sessions non utilisées peuvent être transférées à un autre membre de l'équipe ou créditées à votre compte pour une utilisation future." },
        { q: "Offrez-vous des sessions de groupe?", a: "Oui, nous offrons à la fois du coaching 1-à-1 et des sessions en petit groupe (jusqu'à 4 participants) pour le renforcement d'équipe et l'apprentissage entre pairs." },
        { q: "Comment mesurez-vous les progrès?", a: "Chaque session comprend des notes d'évaluation. Nous fournissons des rapports mensuels avec des scores de préparation aux ELS prédits basés sur notre cadre d'évaluation propriétaire." },
      ],
    },
  };

  const t = labels[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { iconBg: string; iconShadow: string }> = {
      teal: { iconBg: "bg-teal-500", iconShadow: "shadow-teal-500/25" },
      blue: { iconBg: "bg-blue-500", iconShadow: "shadow-blue-500/25" },
      emerald: { iconBg: "bg-emerald-500", iconShadow: "shadow-emerald-500/25" },
      orange: { iconBg: "bg-orange-500", iconShadow: "shadow-orange-500/25" },
      rose: { iconBg: "bg-rose-500", iconShadow: "shadow-rose-500/25" },
      amber: { iconBg: "bg-amber-500", iconShadow: "shadow-amber-500/25" },
    };
    return colors[color] || colors.teal;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/30 via-white to-teal-50/20">
      <Header />

      <main className="flex-1">
        <Breadcrumb 
          items={[
            { label: "For Departments", labelFr: "Pour les ministères" }
          ]} 
        />

        {/* Hero Section with Glassmorphism */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Decorative orbs */}
          <div className="orb orb-teal w-[600px] h-[600px] -top-72 -right-72 animate-float-slow" />
          <div className="orb orb-orange w-80 h-80 top-32 -left-40 animate-float-medium opacity-40" />
          <div className="orb orb-teal w-56 h-56 bottom-20 right-1/3 animate-float-fast opacity-30" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Glass badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge mb-6">
                <Building2 className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">{t.badge}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t.title}{" "}
                <span className="gradient-text">{t.titleHighlight}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {t.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="glass-btn gap-2">
                  {t.ctaPrimary} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" className="glass-btn-outline gap-2">
                  <FileText className="h-4 w-4" /> {t.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Glassmorphism */}
        <section 
          className="py-12 relative"
          ref={(el) => { if (el) sectionRefs.current.set('stats', el); }}
          data-section="stats"
        >
          <div className="container">
            <div className={`glass-card p-8 transition-all duration-700 ${
              visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: t.stat1Value, label: t.stat1Label },
                  { value: t.stat2Value, label: t.stat2Label },
                  { value: t.stat3Value, label: t.stat3Label },
                  { value: t.stat4Value, label: t.stat4Label },
                ].map((stat, i) => (
                  <div key={i} className="text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Glassmorphism */}
        <section 
          className="py-20"
          ref={(el) => { if (el) sectionRefs.current.set('benefits', el); }}
          data-section="benefits"
        >
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.benefitsTitle}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t.benefitsSubtitle}</p>
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
              visibleSections.has('benefits') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {t.benefits.map((benefit, i) => {
                const colors = getColorClasses(benefit.color);
                return (
                  <div 
                    key={i} 
                    className="glass-card p-6 hover-lift group"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className={`h-14 w-14 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4 shadow-lg ${colors.iconShadow} group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Packages Section - Glassmorphism */}
        <section 
          className="py-20 relative overflow-hidden"
          ref={(el) => { if (el) sectionRefs.current.set('packages', el); }}
          data-section="packages"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white" />
          <div className="orb orb-teal w-64 h-64 -bottom-32 -left-32 opacity-30" />
          
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.packagesTitle}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t.packagesSubtitle}</p>
            </div>

            <div className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-700 ${
              visibleSections.has('packages') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {t.packages.map((pkg, i) => (
                <div 
                  key={i} 
                  className={`glass-card overflow-hidden hover-lift relative ${pkg.popular ? 'ring-2 ring-teal-500' : ''}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 rounded-t-none rounded-b-xl px-4">
                        {pkg.popularLabel}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="p-6 pt-8 text-center">
                    <div className="text-lg font-medium text-muted-foreground mb-1">{pkg.name}</div>
                    <div className="text-sm text-muted-foreground mb-4">{pkg.size}</div>
                    <div className="text-4xl font-bold gradient-text mb-1">{pkg.price}</div>
                    <div className="text-sm text-muted-foreground mb-6">{pkg.period}</div>
                    
                    <ul className="space-y-3 text-left mb-6">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3 w-3 text-teal-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button className={`w-full ${pkg.popular ? 'glass-btn' : 'glass-btn-outline'}`}>
                      {t.ctaPrimary}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section - Glassmorphism */}
        <section 
          className="py-20"
          ref={(el) => { if (el) sectionRefs.current.set('process', el); }}
          data-section="process"
        >
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.processTitle}</h2>
              <p className="text-muted-foreground">{t.processSubtitle}</p>
            </div>

            <div className={`grid md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-700 ${
              visibleSections.has('process') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {t.process.map((step, i) => (
                <div 
                  key={i} 
                  className="text-center relative"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Connector line */}
                  {i < t.process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-300 to-teal-100" />
                  )}
                  
                  <div className="relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
                      <span className="text-2xl font-bold text-white">{i + 1}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Glassmorphism */}
        <section 
          className="py-20 relative overflow-hidden"
          ref={(el) => { if (el) sectionRefs.current.set('testimonials', el); }}
          data-section="testimonials"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white to-teal-50/50" />
          <div className="orb orb-orange w-48 h-48 top-20 -right-24 opacity-30" />
          
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.testimonialsTitle}</h2>
            </div>

            <div className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-700 ${
              visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {t.testimonials.map((testimonial, i) => (
                <div 
                  key={i} 
                  className="glass-card p-6 hover-lift"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex gap-3 mb-4">
                    <Quote className="h-6 w-6 text-teal-300 shrink-0" />
                    <p className="text-muted-foreground italic">{testimonial.quote}</p>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-teal-600">{testimonial.dept}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section - Glassmorphism */}
        <section 
          className="py-20"
          ref={(el) => { if (el) sectionRefs.current.set('contact', el); }}
          data-section="contact"
        >
          <div className="container">
            <div className={`max-w-2xl mx-auto transition-all duration-700 ${
              visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contactTitle}</h2>
                <p className="text-muted-foreground">{t.contactSubtitle}</p>
              </div>

              {formSubmitted ? (
                <div className="glass-card p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-medium">{t.formSuccess}</p>
                </div>
              ) : (
                <div className="glass-card p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.formName}</Label>
                        <Input id="name" required className="bg-white/50 border-white/30 focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.formEmail}</Label>
                        <Input id="email" type="email" required className="bg-white/50 border-white/30 focus:border-teal-500" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">{t.formDepartment}</Label>
                        <Input id="department" required className="bg-white/50 border-white/30 focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamSize">{t.formTeamSize}</Label>
                        <Select required>
                          <SelectTrigger className="bg-white/50 border-white/30">
                            <SelectValue placeholder={t.formTeamSizePlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {t.formTeamSizes.map((size, i) => (
                              <SelectItem key={i} value={String(i + 1)}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t.formMessage}</Label>
                      <Textarea id="message" rows={4} className="bg-white/50 border-white/30 focus:border-teal-500" />
                    </div>

                    <Button type="submit" className="w-full glass-btn" size="lg">
                      {t.formSubmit}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section - Glassmorphism Accordion */}
        <section 
          className="py-20 relative overflow-hidden"
          ref={(el) => { if (el) sectionRefs.current.set('faq', el); }}
          data-section="faq"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white" />
          
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.faqTitle}</h2>
            </div>

            <div className={`max-w-3xl mx-auto space-y-4 transition-all duration-700 ${
              visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {t.faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="glass-card overflow-hidden hover-lift cursor-pointer"
                  style={{ transitionDelay: `${i * 100}ms` }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold pr-4">{faq.q}</h3>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`} />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? 'max-h-40 mt-3' : 'max-h-0'
                    }`}>
                      <p className="text-muted-foreground text-sm">{faq.a}</p>
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

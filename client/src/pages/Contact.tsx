import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import SEO from "@/components/SEO";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  HelpCircle,
  Users,
  Briefcase,
} from "lucide-react";

export default function Contact() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labels = {
    en: {
      title: "Contact Us",
      subtitle: "Have questions? We're here to help.",
      formTitle: "Send us a message",
      formDescription: "Fill out the form below and we'll get back to you within 24 hours.",
      name: "Your Name",
      namePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "your.email@example.com",
      subject: "Subject",
      subjectPlaceholder: "Select a subject",
      subjects: {
        general: "General Inquiry",
        learner: "Learner Support",
        coach: "Coach Support",
        technical: "Technical Issue",
        billing: "Billing Question",
        partnership: "Partnership Opportunity",
      },
      message: "Message",
      messagePlaceholder: "How can we help you?",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent successfully! We'll get back to you soon.",
      error: "Failed to send message. Please try again.",
      contactInfo: "Other Ways to Reach Us",
      emailUs: "Email Us",
      emailAddress: "admin@rusingacademy.ca",
      responseTime: "Response Time",
      responseTimeValue: "Within 24 hours",
      location: "Location",
      locationValue: "Ottawa, Ontario, Canada",
      faqTitle: "Frequently Asked Questions",
      faqDescription: "Find quick answers to common questions",
      faqLink: "Visit our FAQ page",
      coachSupport: "Coach Support",
      coachSupportDesc: "Questions about becoming or being a coach?",
      coachSupportLink: "Coach Resources",
      b2b: "For Organizations",
      b2bDesc: "Interested in team training solutions?",
      b2bLink: "Learn More",
    },
    fr: {
      title: "Contactez-nous",
      subtitle: "Des questions? Nous sommes là pour vous aider.",
      formTitle: "Envoyez-nous un message",
      formDescription: "Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures.",
      name: "Votre nom",
      namePlaceholder: "Entrez votre nom complet",
      email: "Adresse courriel",
      emailPlaceholder: "votre.courriel@exemple.com",
      subject: "Sujet",
      subjectPlaceholder: "Sélectionnez un sujet",
      subjects: {
        general: "Demande générale",
        learner: "Support apprenant",
        coach: "Support coach",
        technical: "Problème technique",
        billing: "Question de facturation",
        partnership: "Opportunité de partenariat",
      },
      message: "Message",
      messagePlaceholder: "Comment pouvons-nous vous aider?",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès! Nous vous répondrons bientôt.",
      error: "Échec de l'envoi du message. Veuillez réessayer.",
      contactInfo: "Autres façons de nous joindre",
      emailUs: "Courriel",
      emailAddress: "admin@rusingacademy.ca",
      responseTime: "Temps de réponse",
      responseTimeValue: "Dans les 24 heures",
      location: "Emplacement",
      locationValue: "Ottawa, Ontario, Canada",
      faqTitle: "Questions fréquemment posées",
      faqDescription: "Trouvez des réponses rapides aux questions courantes",
      faqLink: "Visitez notre page FAQ",
      coachSupport: "Support coach",
      coachSupportDesc: "Questions sur devenir ou être coach?",
      coachSupportLink: "Ressources coach",
      b2b: "Pour les organisations",
      b2bDesc: "Intéressé par des solutions de formation d'équipe?",
      b2bLink: "En savoir plus",
    },
  };

  const l = labels[language];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(l.success);
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  // SEO metadata
  const seoTitle = language === 'en' 
    ? 'Contact Us - Get in Touch' 
    : 'Contactez-nous - Entrer en contact';
  const seoDescription = language === 'en'
    ? 'Have questions about SLE preparation or our services? Contact the Lingueefy team. We\'re here to help you achieve your bilingual goals.'
    : 'Vous avez des questions sur la préparation ELS ou nos services? Contactez l\'équipe Lingueefy. Nous sommes là pour vous aider.';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title={seoTitle}
        description={seoDescription}
      />
      <Header />

      <main id="main-content" className="flex-1">
        <Breadcrumb 
          items={[
            { label: "Contact", labelFr: "Contact" }
          ]} 
        />

        {/* Hero Section */}
        <section className="py-16 lg:py-24 hero-gradient">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{l.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {l.subtitle}
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{l.formTitle}</CardTitle>
                    <CardDescription>{l.formDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{l.name}</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder={l.namePlaceholder}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{l.email}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={l.emailPlaceholder}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{l.subject}</Label>
                        <Select name="subject" required>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder={l.subjectPlaceholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">{l.subjects.general}</SelectItem>
                            <SelectItem value="learner">{l.subjects.learner}</SelectItem>
                            <SelectItem value="coach">{l.subjects.coach}</SelectItem>
                            <SelectItem value="technical">{l.subjects.technical}</SelectItem>
                            <SelectItem value="billing">{l.subjects.billing}</SelectItem>
                            <SelectItem value="partnership">{l.subjects.partnership}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{l.message}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={l.messagePlaceholder}
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? l.sending : l.send}
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{l.contactInfo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{l.emailUs}</p>
                        <a
                          href="mailto:admin@rusingacademy.ca"
                          className="text-primary hover:underline text-sm"
                        >
                          {l.emailAddress}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{l.responseTime}</p>
                        <p className="text-muted-foreground text-sm">{l.responseTimeValue}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{l.location}</p>
                        <p className="text-muted-foreground text-sm">{l.locationValue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="coach-card">
                  <CardContent className="p-6">
                    <HelpCircle className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{l.faqTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{l.faqDescription}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {l.faqLink}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="coach-card">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{l.coachSupport}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{l.coachSupportDesc}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {l.coachSupportLink}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="coach-card">
                  <CardContent className="p-6">
                    <Briefcase className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{l.b2b}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{l.b2bDesc}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {l.b2bLink}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

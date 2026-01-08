import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import {
  Target,
  Heart,
  Users,
  Award,
  Globe,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export default function About() {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: "About Lingueefy",
      subtitle: "Empowering Canadian public servants to achieve bilingual excellence",
      missionTitle: "Our Mission",
      missionText: "Lingueefy exists to democratize access to high-quality second language training for Canadian federal public servants. We believe that language proficiency should not be a barrier to career advancement in the public service.",
      storyTitle: "Our Story",
      storyP1: "Lingueefy was born from a simple observation: too many talented public servants struggle to find effective, affordable language training that fits their busy schedules and specifically addresses the SLE exam requirements.",
      storyP2: "Founded by Steven Barholere, a language coach with over a decade of experience helping federal employees achieve their SLE goals, Lingueefy combines the best of human expertise with cutting-edge AI technology.",
      storyP3: "As part of the Rusing Academy ecosystem, Lingueefy represents our commitment to making bilingual excellence achievable for every public servant in Canada.",
      valuesTitle: "Our Values",
      values: [
        {
          icon: Target,
          title: "Results-Focused",
          description: "Everything we do is measured by one metric: helping you pass your SLE exam and advance your career.",
        },
        {
          icon: Heart,
          title: "Learner-Centered",
          description: "We design every feature around the real needs of busy public servants juggling work, life, and language learning.",
        },
        {
          icon: Users,
          title: "Community-Driven",
          description: "Our coaches are former public servants and language experts who understand your journey firsthand.",
        },
        {
          icon: Award,
          title: "Excellence",
          description: "We maintain the highest standards for our coaches, content, and technology to ensure quality outcomes.",
        },
        {
          icon: Globe,
          title: "Bilingual by Design",
          description: "Our platform is fully bilingual because we practice what we preach about language accessibility.",
        },
        {
          icon: Lightbulb,
          title: "Innovation",
          description: "We leverage AI and modern technology to make language learning more effective and accessible than ever.",
        },
      ],
      teamTitle: "Leadership",
      teamSubtitle: "Meet the people behind Lingueefy",
      founder: {
        name: "Steven Barholere",
        role: "Founder & CEO",
        bio: "Steven founded Rusing Academy and Lingueefy after spending over 10 years as a language coach specializing in SLE preparation. He has personally helped hundreds of public servants achieve their language goals and advance their careers in the federal government.",
      },
      ctaTitle: "Ready to Start Your Language Journey?",
      ctaDescription: "Join thousands of public servants who have achieved their SLE goals with Lingueefy.",
      ctaButton: "Get Started",
    },
    fr: {
      title: "À propos de Lingueefy",
      subtitle: "Permettre aux fonctionnaires canadiens d'atteindre l'excellence bilingue",
      missionTitle: "Notre mission",
      missionText: "Lingueefy existe pour démocratiser l'accès à une formation linguistique de haute qualité pour les fonctionnaires fédéraux canadiens. Nous croyons que la maîtrise des langues ne devrait pas être un obstacle à l'avancement de carrière dans la fonction publique.",
      storyTitle: "Notre histoire",
      storyP1: "Lingueefy est né d'une simple observation : trop de fonctionnaires talentueux peinent à trouver une formation linguistique efficace et abordable qui s'adapte à leur emploi du temps chargé et répond spécifiquement aux exigences de l'examen ELS.",
      storyP2: "Fondé par Steven Barholere, un coach linguistique avec plus d'une décennie d'expérience à aider les employés fédéraux à atteindre leurs objectifs ELS, Lingueefy combine le meilleur de l'expertise humaine avec une technologie d'IA de pointe.",
      storyP3: "En tant que partie de l'écosystème Rusing Academy, Lingueefy représente notre engagement à rendre l'excellence bilingue accessible à chaque fonctionnaire au Canada.",
      valuesTitle: "Nos valeurs",
      values: [
        {
          icon: Target,
          title: "Axé sur les résultats",
          description: "Tout ce que nous faisons est mesuré par un seul critère : vous aider à réussir votre examen ELS et à faire avancer votre carrière.",
        },
        {
          icon: Heart,
          title: "Centré sur l'apprenant",
          description: "Nous concevons chaque fonctionnalité autour des besoins réels des fonctionnaires occupés qui jonglent avec le travail, la vie et l'apprentissage des langues.",
        },
        {
          icon: Users,
          title: "Axé sur la communauté",
          description: "Nos coachs sont d'anciens fonctionnaires et des experts linguistiques qui comprennent votre parcours de première main.",
        },
        {
          icon: Award,
          title: "Excellence",
          description: "Nous maintenons les normes les plus élevées pour nos coachs, notre contenu et notre technologie pour assurer des résultats de qualité.",
        },
        {
          icon: Globe,
          title: "Bilingue par conception",
          description: "Notre plateforme est entièrement bilingue parce que nous pratiquons ce que nous prêchons sur l'accessibilité linguistique.",
        },
        {
          icon: Lightbulb,
          title: "Innovation",
          description: "Nous exploitons l'IA et la technologie moderne pour rendre l'apprentissage des langues plus efficace et accessible que jamais.",
        },
      ],
      teamTitle: "Direction",
      teamSubtitle: "Rencontrez les personnes derrière Lingueefy",
      founder: {
        name: "Steven Barholere",
        role: "Fondateur et PDG",
        bio: "Steven a fondé Rusing Academy et Lingueefy après avoir passé plus de 10 ans comme coach linguistique spécialisé dans la préparation ELS. Il a personnellement aidé des centaines de fonctionnaires à atteindre leurs objectifs linguistiques et à faire avancer leur carrière au gouvernement fédéral.",
      },
      ctaTitle: "Prêt à commencer votre parcours linguistique?",
      ctaDescription: "Rejoignez des milliers de fonctionnaires qui ont atteint leurs objectifs ELS avec Lingueefy.",
      ctaButton: "Commencer",
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

        {/* Mission Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">{l.missionTitle}</h2>
              <p className="text-lg text-muted-foreground">{l.missionText}</p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{l.storyTitle}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{l.storyP1}</p>
                <p>{l.storyP2}</p>
                <p>{l.storyP3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold mb-12 text-center">{l.valuesTitle}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {l.values.map((value, i) => (
                <Card key={i} className="coach-card">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-2">{l.teamTitle}</h2>
              <p className="text-muted-foreground">{l.teamSubtitle}</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-4xl font-bold text-primary">SB</span>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold">{l.founder.name}</h3>
                      <p className="text-primary font-medium mb-3">{l.founder.role}</p>
                      <p className="text-muted-foreground">{l.founder.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">{l.ctaTitle}</h2>
                <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  {l.ctaDescription}
                </p>
                <Link href="/coaches">
                  <Button size="lg" variant="secondary">
                    {l.ctaButton} <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

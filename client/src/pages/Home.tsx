import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import ProfStevenChatbot from "@/components/ProfStevenChatbot";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GraduationCap,
  Users,
  Bot,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  Award,
  MessageSquare,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section - Full-width Image Background */}
        <section 
          className="relative overflow-hidden"
          aria-labelledby="hero-title"
        >
          {/* Hero Image Background */}
          <div className="relative w-full">
            <img 
              src="/images/hero-final-v19.png" 
              alt="Lingueefy - Connect with SLE coaches through video calls"
              className="w-full h-auto object-cover"
              style={{ maxHeight: '85vh' }}
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            
            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container">
                <div className="max-w-2xl space-y-6 text-white">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-medium text-white border border-white/30">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    {t("hero.badge")}
                  </div>

                  {/* Title */}
                  <h1 
                    id="hero-title"
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
                  >
                    {t("hero.title")}{" "}
                    <span className="text-teal-400">{t("hero.titleHighlight")}</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl md:text-2xl font-medium text-white/90">
                    {t("hero.subtitle")}
                  </p>

                  {/* Description */}
                  <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                    {t("hero.description")}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/coaches">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-teal-500/30">
                        {t("hero.findCoach")} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/ai-coach">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full px-8 h-14 text-base font-medium">
                        <Bot className="h-5 w-5" aria-hidden="true" /> {t("hero.tryAI")}
                      </Button>
                    </Link>
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex -space-x-3" aria-hidden="true">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-12 w-12 rounded-full border-3 border-white bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-lg"
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-white text-base">500+ {t("hero.socialProof")}</p>
                      <p className="text-white/70">{t("hero.socialProofSub")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Coaches Section - Right after Hero */}
        <FeaturedCoaches />

        {/* SLE Levels Section - Glassmorphism */}
        <section 
          className="py-20 relative overflow-hidden"
          aria-labelledby="sle-title"
        >
          <div className="absolute inset-0 gradient-bg" aria-hidden="true" />
          
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 id="sle-title" className="text-3xl md:text-4xl font-bold mb-4">{t("sle.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("sle.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  level: "A",
                  title: t("sle.levelA"),
                  description: t("sle.levelADesc"),
                  gradient: "from-amber-400 to-amber-500",
                  shadow: "shadow-amber-500/30",
                },
                {
                  level: "B",
                  title: t("sle.levelB"),
                  description: t("sle.levelBDesc"),
                  gradient: "from-blue-400 to-blue-500",
                  shadow: "shadow-blue-500/30",
                },
                {
                  level: "C",
                  title: t("sle.levelC"),
                  description: t("sle.levelCDesc"),
                  gradient: "from-emerald-400 to-emerald-500",
                  shadow: "shadow-emerald-500/30",
                },
              ].map((item) => (
                <div key={item.level} className="glass-card hover:shadow-2xl group">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-300`}
                      aria-hidden="true"
                    >
                      <span className="text-2xl font-bold text-white">{item.level}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{item.title}</h3>
                      <Badge className="glass-badge text-xs mt-1">{t("sle.skills")}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden mesh-gradient"
          aria-labelledby="how-title"
        >
          <div className="container relative z-10">
            <div className="text-center mb-20">
              <h2 id="how-title" className="text-3xl md:text-4xl font-bold mb-4">{t("how.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("how.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: t("how.step1Title"),
                  description: t("how.step1Desc"),
                },
                {
                  icon: Calendar,
                  title: t("how.step2Title"),
                  description: t("how.step2Desc"),
                },
                {
                  icon: Bot,
                  title: t("how.step3Title"),
                  description: t("how.step3Desc"),
                },
                {
                  icon: Award,
                  title: t("how.step4Title"),
                  description: t("how.step4Desc"),
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="glass-card text-center group hover:shadow-2xl">
                    <div className="mb-6">
                      <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10" aria-hidden="true">
                      <ArrowRight className="h-6 w-6 text-teal-500/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden"
          aria-labelledby="features-title"
        >
          <div className="absolute inset-0 gradient-bg" aria-hidden="true" />
          
          <div className="container relative z-10">
            <div className="text-center mb-20">
              <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-4">{t("features.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("features.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: t("features.sleCoaches"),
                  description: t("features.sleCoachesDesc"),
                },
                {
                  icon: Bot,
                  title: t("features.ai"),
                  description: t("features.aiDesc"),
                },
                {
                  icon: Clock,
                  title: t("features.flexible"),
                  description: t("features.flexibleDesc"),
                },
                {
                  icon: Globe,
                  title: t("features.bilingual"),
                  description: t("features.bilingualDesc"),
                },
                {
                  icon: Star,
                  title: t("features.results"),
                  description: t("features.resultsDesc"),
                },
                {
                  icon: MessageSquare,
                  title: t("features.federal"),
                  description: t("features.federalDesc"),
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card group hover:shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden mesh-gradient"
          aria-labelledby="cta-title"
        >
          <div className="container relative z-10">
            <div className="glass-card max-w-4xl mx-auto text-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 glass-badge rounded-full px-5 py-2 text-sm font-medium text-teal-700">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {t("hero.badge")}
                </div>
                
                <h2 id="cta-title" className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {t("cta.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/coaches">
                    <Button size="lg" className="w-full sm:w-auto gap-2 glass-btn text-white rounded-full px-8 h-14 text-base font-semibold">
                      {t("cta.findCoach")} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/become-coach">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 glass-btn-outline rounded-full px-8 h-14 text-base font-medium">
                      {t("cta.becomeCoach")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Prof Steven AI Chatbot Widget */}
      <ProfStevenChatbot />
    </div>
  );
}

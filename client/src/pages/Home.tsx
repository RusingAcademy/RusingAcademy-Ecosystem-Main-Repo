import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCoaches from "@/components/FeaturedCoaches";
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
        {/* Hero Section - Glassmorphism */}
        <section 
          className="relative overflow-hidden py-20 lg:py-32 mesh-gradient"
          aria-labelledby="hero-title"
        >
          {/* Decorative glass orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" aria-hidden="true" />
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {/* Badge with glass effect */}
                <div className="inline-flex items-center gap-2 glass-badge rounded-full px-5 py-2 text-sm font-medium text-teal-700">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  {t("hero.badge")}
                </div>

                <h1 
                  id="hero-title"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance"
                >
                  {t("hero.title")}{" "}
                  <span className="gradient-text">{t("hero.titleHighlight")}</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {t("hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/coaches">
                    <Button size="lg" className="w-full sm:w-auto gap-2 glass-btn text-white rounded-full px-8 h-14 text-base font-semibold">
                      {t("hero.findCoach")} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/ai-coach">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 glass-btn-outline rounded-full px-8 h-14 text-base font-medium">
                      <Bot className="h-5 w-5" aria-hidden="true" /> {t("hero.tryAI")}
                    </Button>
                  </Link>
                </div>

                {/* Social proof with glass effect */}
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
                    <p className="font-bold text-foreground text-base">500+ {t("hero.socialProof")}</p>
                    <p className="text-muted-foreground">{t("hero.socialProofSub")}</p>
                  </div>
                </div>
              </div>

              {/* AI Card - Glassmorphism */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-orange-500/10 rounded-3xl blur-3xl" aria-hidden="true" />
                <div className="glass-card relative border-white/40 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                        <Bot className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="font-bold text-xl">{t("ai.title")}</h2>
                        <p className="text-sm text-muted-foreground">{t("ai.subtitle")}</p>
                      </div>
                    </div>

                    <ul className="space-y-3" role="list">
                      <li className="flex items-center gap-3 p-4 rounded-xl glass-subtle hover:bg-white/60 transition-all duration-300">
                        <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-teal-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">{t("ai.voicePractice")}</span>
                      </li>
                      <li className="flex items-center gap-3 p-4 rounded-xl glass-subtle hover:bg-white/60 transition-all duration-300">
                        <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-teal-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">{t("ai.placementTests")}</span>
                      </li>
                      <li className="flex items-center gap-3 p-4 rounded-xl glass-subtle hover:bg-white/60 transition-all duration-300">
                        <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                          <Play className="h-5 w-5 text-teal-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">{t("ai.examSimulations")}</span>
                      </li>
                    </ul>

                    <Button className="w-full glass-btn text-white rounded-xl h-14 text-base font-semibold" size="lg">
                      {t("ai.startPractice")}
                    </Button>
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
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="h-20 w-20 mx-auto rounded-2xl glass flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                      <step.icon className="h-10 w-10 text-teal-600" aria-hidden="true" />
                    </div>
                    <div 
                      className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-teal-500/30"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid - Glassmorphism */}
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
                  icon: CheckCircle2,
                  title: t("features.federal"),
                  description: t("features.federalDesc"),
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card hover:shadow-2xl group">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-teal-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Coaches Section - Glassmorphism */}
        <section 
          className="py-24 relative overflow-hidden mesh-gradient"
          aria-labelledby="featured-coaches-title"
        >
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 id="featured-coaches-title" className="text-3xl md:text-4xl font-bold mb-4">
                {t("featured.title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t("featured.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Coach Steven */}
              <div className="glass-card overflow-hidden p-0 hover:shadow-2xl">
                <div className="relative aspect-video">
                  <a 
                    href="https://www.youtube.com/watch?v=LEc84vX0xe0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative group"
                    aria-label="Watch Coach Steven's introduction video"
                  >
                    <img 
                      src="/images/coaches/steven-barholere.jpg" 
                      alt="Coach Steven - SLE French Specialist"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="h-16 w-16 rounded-full glass flex items-center justify-center shadow-xl">
                        <Play className="h-8 w-8 text-teal-600 ml-1" />
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="glass-badge-orange text-xs font-semibold">SLE C Expert</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Steven Barholere</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t("featured.stevenDesc")}
                  </p>
                  <Link href="/coaches/steven-barholere">
                    <Button variant="outline" className="w-full glass-btn-outline rounded-xl h-12 font-medium">
                      {t("featured.viewProfile")}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Coach Sue-Anne */}
              <div className="glass-card overflow-hidden p-0 hover:shadow-2xl">
                <div className="relative aspect-video">
                  <a 
                    href="https://www.youtube.com/watch?v=SuuhMpF5KoA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative group"
                    aria-label="Watch Coach Sue-Anne's introduction video"
                  >
                    <img 
                      src="/images/coaches/sue-anne-richer.jpg" 
                      alt="Coach Sue-Anne Richer - Bilingual Communication Expert"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="h-16 w-16 rounded-full glass flex items-center justify-center shadow-xl">
                        <Play className="h-8 w-8 text-teal-600 ml-1" />
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="glass-badge-orange text-xs font-semibold">SLE C Expert</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">5.0</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Sue-Anne Richer</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t("featured.sueanneDesc")}
                  </p>
                  <Link href="/coaches/sue-anne-richer">
                    <Button variant="outline" className="w-full glass-btn-outline rounded-xl h-12 font-medium">
                      {t("featured.viewProfile")}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Coach Erika */}
              <div className="glass-card overflow-hidden p-0 hover:shadow-2xl">
                <div className="relative aspect-video">
                  <a 
                    href="https://www.youtube.com/watch?v=rAdJZ4o_N2Y" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative group"
                    aria-label="Watch Coach Erika's introduction video"
                  >
                    <img 
                      src="/images/coaches/erika-seguin.jpg" 
                      alt="Coach Erika Séguin - Oral Exam Specialist"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="h-16 w-16 rounded-full glass flex items-center justify-center shadow-xl">
                        <Play className="h-8 w-8 text-teal-600 ml-1" />
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="glass-badge text-xs font-semibold text-teal-700">SLE B-C Specialist</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Erika Séguin</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t("featured.erikaDesc")}
                  </p>
                  <Link href="/coaches/erika-seguin">
                    <Button variant="outline" className="w-full glass-btn-outline rounded-xl h-12 font-medium">
                      {t("featured.viewProfile")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/coaches">
                <Button size="lg" className="glass-btn-outline rounded-full px-10 h-14 text-base font-medium gap-2">
                  {t("featured.viewAll")} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Glassmorphism */}
        <section className="py-24 relative overflow-hidden" aria-labelledby="cta-title">
          <div className="container relative z-10">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-600" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.15),transparent_50%)]" />
              
              <div className="relative p-12 md:p-16 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Start your journey today</span>
                  </div>
                  
                  <h2 id="cta-title" className="text-3xl md:text-5xl font-bold mb-6 text-white">
                    {t("cta.title")}
                  </h2>
                  <p className="text-white/80 mb-10 text-lg leading-relaxed">
                    {t("cta.description")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/coaches">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-teal-700 hover:bg-white/90 rounded-full px-10 h-14 text-base font-semibold shadow-xl">
                        {t("cta.findCoach")} <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/become-a-coach">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full px-10 h-14 text-base font-medium backdrop-blur-sm"
                      >
                        {t("cta.becomeCoach")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

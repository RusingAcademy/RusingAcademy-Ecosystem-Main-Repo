import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden hero-gradient py-20 lg:py-32"
          aria-labelledby="hero-title"
        >
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  {t("hero.badge")}
                </div>

                <h1 
                  id="hero-title"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance"
                >
                  {t("hero.title")}{" "}
                  <span className="text-primary">{t("hero.titleHighlight")}</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  {t("hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/coaches">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      {t("hero.findCoach")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/ai-coach">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                      <Bot className="h-4 w-4" aria-hidden="true" /> {t("hero.tryAI")}
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2" aria-hidden="true">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">500+ {t("hero.socialProof")}</p>
                    <p className="text-muted-foreground">{t("hero.socialProofSub")}</p>
                  </div>
                </div>
              </div>

              {/* AI Card */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl" aria-hidden="true" />
                <Card className="relative bg-card/80 backdrop-blur border-2">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg">{t("ai.title")}</h2>
                          <p className="text-sm text-muted-foreground">{t("ai.subtitle")}</p>
                        </div>
                      </div>

                      <ul className="space-y-3" role="list">
                        <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
                          <span className="text-sm">{t("ai.voicePractice")}</span>
                        </li>
                        <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                          <span className="text-sm">{t("ai.placementTests")}</span>
                        </li>
                        <li className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Play className="h-5 w-5 text-primary" aria-hidden="true" />
                          <span className="text-sm">{t("ai.examSimulations")}</span>
                        </li>
                      </ul>

                      <Button className="w-full" size="lg">
                        {t("ai.startPractice")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* SLE Levels Section */}
        <section 
          className="py-16 bg-muted/30"
          aria-labelledby="sle-title"
        >
          <div className="container">
            <div className="text-center mb-12">
              <h2 id="sle-title" className="text-3xl font-bold mb-4">{t("sle.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("sle.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  level: "A",
                  title: t("sle.levelA"),
                  description: t("sle.levelADesc"),
                  color: "bg-amber-500",
                  badgeClass: "sle-badge-a",
                },
                {
                  level: "B",
                  title: t("sle.levelB"),
                  description: t("sle.levelBDesc"),
                  color: "bg-blue-500",
                  badgeClass: "sle-badge-b",
                },
                {
                  level: "C",
                  title: t("sle.levelC"),
                  description: t("sle.levelCDesc"),
                  color: "bg-emerald-500",
                  badgeClass: "sle-badge-c",
                },
              ].map((item) => (
                <Card key={item.level} className="coach-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center`}
                        aria-hidden="true"
                      >
                        <span className="text-2xl font-bold text-white">{item.level}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <Badge className={item.badgeClass}>{t("sle.skills")}</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section 
          className="py-20"
          aria-labelledby="how-title"
        >
          <div className="container">
            <div className="text-center mb-16">
              <h2 id="how-title" className="text-3xl font-bold mb-4">{t("how.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
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
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div 
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section 
          className="py-20 bg-muted/30"
          aria-labelledby="features-title"
        >
          <div className="container">
            <div className="text-center mb-16">
              <h2 id="features-title" className="text-3xl font-bold mb-4">{t("features.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("features.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card key={index} className="coach-card">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20" aria-labelledby="cta-title">
          <div className="container">
            <Card className="bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" aria-hidden="true" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                  <h2 id="cta-title" className="text-3xl md:text-4xl font-bold mb-4">
                    {t("cta.title")}
                  </h2>
                  <p className="text-primary-foreground/80 mb-8 text-lg">
                    {t("cta.description")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/coaches">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                        {t("cta.findCoach")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/become-a-coach">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                      >
                        {t("cta.becomeCoach")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

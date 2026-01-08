import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Globe,
  Star,
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function BecomeCoach() {
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    languages: "french" as "french" | "english" | "both",
    specializations: {
      oralA: false,
      oralB: false,
      oralC: false,
      writtenA: false,
      writtenB: false,
      writtenC: false,
      readingComprehension: false,
      examPrep: false,
      businessFrench: false,
      businessEnglish: false,
    },
    yearsExperience: 0,
    credentials: "",
    hourlyRate: 5000, // $50 in cents
    trialRate: 2500, // $25 in cents
    videoUrl: "",
  });

  const submitMutation = trpc.coach.submitApplication.useMutation();

  const labels = {
    en: {
      title: "Become a Lingueefy Coach",
      subtitle: "Help Canadian public servants achieve their language goals",
      whyJoin: "Why Join Lingueefy?",
      benefit1Title: "Flexible Schedule",
      benefit1Desc: "Set your own hours and work from anywhere",
      benefit2Title: "Competitive Earnings",
      benefit2Desc: "Earn $40-$100+ per hour with our commission structure",
      benefit3Title: "Targeted Audience",
      benefit3Desc: "Connect with motivated federal public servants",
      benefit4Title: "Support & Resources",
      benefit4Desc: "Access SLE-specific training materials and community",
      requirements: "Requirements",
      req1: "Fluent in French and/or English",
      req2: "Experience teaching or tutoring languages",
      req3: "Understanding of Canadian federal SLE requirements",
      req4: "Reliable internet and quiet workspace",
      req5: "Commitment to student success",
      applyNow: "Apply Now",
      loginToApply: "Sign in to apply",
      step1: "Basic Info",
      step2: "Expertise",
      step3: "Pricing",
      headline: "Professional Headline",
      headlinePlaceholder: "e.g., Certified French Coach | 10+ Years SLE Experience",
      bio: "About You",
      bioPlaceholder: "Tell learners about your background, teaching style, and what makes you a great coach...",
      teachingLanguage: "Teaching Language",
      french: "French",
      english: "English",
      both: "Both",
      specializations: "Specializations",
      oralA: "Oral Level A",
      oralB: "Oral Level B",
      oralC: "Oral Level C",
      writtenA: "Written Level A",
      writtenB: "Written Level B",
      writtenC: "Written Level C",
      readingComprehension: "Reading Comprehension",
      examPrep: "Exam Preparation",
      businessFrench: "Business French",
      businessEnglish: "Business English",
      yearsExperience: "Years of Teaching Experience",
      credentials: "Credentials & Certifications",
      credentialsPlaceholder: "List your relevant certifications, degrees, or qualifications...",
      hourlyRate: "Hourly Rate (CAD)",
      trialRate: "Trial Session Rate (CAD)",
      videoUrl: "Introduction Video URL (optional)",
      videoUrlPlaceholder: "https://youtube.com/watch?v=...",
      next: "Next",
      back: "Back",
      submit: "Submit Application",
      submitting: "Submitting...",
      successTitle: "Application Submitted!",
      successMessage: "We'll review your application and get back to you within 2-3 business days.",
    },
    fr: {
      title: "Devenez coach Lingueefy",
      subtitle: "Aidez les fonctionnaires canadiens à atteindre leurs objectifs linguistiques",
      whyJoin: "Pourquoi rejoindre Lingueefy?",
      benefit1Title: "Horaire flexible",
      benefit1Desc: "Définissez vos propres heures et travaillez de n'importe où",
      benefit2Title: "Revenus compétitifs",
      benefit2Desc: "Gagnez 40 à 100$+ par heure avec notre structure de commission",
      benefit3Title: "Public ciblé",
      benefit3Desc: "Connectez-vous avec des fonctionnaires fédéraux motivés",
      benefit4Title: "Soutien et ressources",
      benefit4Desc: "Accédez à des matériaux de formation spécifiques à l'ELS",
      requirements: "Exigences",
      req1: "Maîtrise du français et/ou de l'anglais",
      req2: "Expérience en enseignement ou tutorat de langues",
      req3: "Compréhension des exigences ELS fédérales canadiennes",
      req4: "Internet fiable et espace de travail calme",
      req5: "Engagement envers la réussite des étudiants",
      applyNow: "Postuler maintenant",
      loginToApply: "Connectez-vous pour postuler",
      step1: "Infos de base",
      step2: "Expertise",
      step3: "Tarification",
      headline: "Titre professionnel",
      headlinePlaceholder: "ex., Coach français certifié | 10+ ans d'expérience ELS",
      bio: "À propos de vous",
      bioPlaceholder: "Parlez aux apprenants de votre parcours, style d'enseignement et ce qui fait de vous un excellent coach...",
      teachingLanguage: "Langue d'enseignement",
      french: "Français",
      english: "Anglais",
      both: "Les deux",
      specializations: "Spécialisations",
      oralA: "Oral niveau A",
      oralB: "Oral niveau B",
      oralC: "Oral niveau C",
      writtenA: "Écrit niveau A",
      writtenB: "Écrit niveau B",
      writtenC: "Écrit niveau C",
      readingComprehension: "Compréhension écrite",
      examPrep: "Préparation aux examens",
      businessFrench: "Français des affaires",
      businessEnglish: "Anglais des affaires",
      yearsExperience: "Années d'expérience en enseignement",
      credentials: "Diplômes et certifications",
      credentialsPlaceholder: "Listez vos certifications, diplômes ou qualifications pertinents...",
      hourlyRate: "Tarif horaire (CAD)",
      trialRate: "Tarif session d'essai (CAD)",
      videoUrl: "URL vidéo d'introduction (optionnel)",
      videoUrlPlaceholder: "https://youtube.com/watch?v=...",
      next: "Suivant",
      back: "Retour",
      submit: "Soumettre la candidature",
      submitting: "Soumission...",
      successTitle: "Candidature soumise!",
      successMessage: "Nous examinerons votre candidature et vous répondrons dans 2-3 jours ouvrables.",
    },
  };

  const l = labels[language];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync({
        headline: formData.headline,
        bio: formData.bio,
        languages: formData.languages,
        specializations: formData.specializations,
        yearsExperience: formData.yearsExperience,
        credentials: formData.credentials,
        hourlyRate: formData.hourlyRate,
        trialRate: formData.trialRate,
        videoUrl: formData.videoUrl || undefined,
      });
      setStep(4); // Success state
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="pt-8 pb-8">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{l.successTitle}</h2>
              <p className="text-muted-foreground">{l.successMessage}</p>
            </CardContent>
          </Card>
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
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{l.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{l.subtitle}</p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">{l.whyJoin}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{l.benefit1Title}</h3>
                  <p className="text-sm text-muted-foreground">{l.benefit1Desc}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{l.benefit2Title}</h3>
                  <p className="text-sm text-muted-foreground">{l.benefit2Desc}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{l.benefit3Title}</h3>
                  <p className="text-sm text-muted-foreground">{l.benefit3Desc}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{l.benefit4Title}</h3>
                  <p className="text-sm text-muted-foreground">{l.benefit4Desc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">{l.requirements}</h2>
              <div className="space-y-3">
                {[l.req1, l.req2, l.req3, l.req4, l.req5].map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {!isAuthenticated ? (
                <Card>
                  <CardContent className="pt-8 pb-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">{l.applyNow}</h3>
                    <a href={getLoginUrl()}>
                      <Button size="lg" className="gap-2">
                        {l.loginToApply}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{l.applyNow}</CardTitle>
                    <CardDescription>
                      {language === "fr" ? `Étape ${step} sur 3` : `Step ${step} of 3`}
                    </CardDescription>
                    {/* Progress indicator */}
                    <div className="flex gap-2 mt-4">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`h-2 flex-1 rounded-full ${
                            s <= step ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {step === 1 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="headline">{l.headline}</Label>
                          <Input
                            id="headline"
                            value={formData.headline}
                            onChange={(e) =>
                              setFormData({ ...formData, headline: e.target.value })
                            }
                            placeholder={l.headlinePlaceholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">{l.bio}</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder={l.bioPlaceholder}
                            rows={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{l.teachingLanguage}</Label>
                          <Select
                            value={formData.languages}
                            onValueChange={(v) =>
                              setFormData({
                                ...formData,
                                languages: v as "french" | "english" | "both",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="french">{l.french}</SelectItem>
                              <SelectItem value="english">{l.english}</SelectItem>
                              <SelectItem value="both">{l.both}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="space-y-4">
                          <Label>{l.specializations}</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries({
                              oralA: l.oralA,
                              oralB: l.oralB,
                              oralC: l.oralC,
                              writtenA: l.writtenA,
                              writtenB: l.writtenB,
                              writtenC: l.writtenC,
                              readingComprehension: l.readingComprehension,
                              examPrep: l.examPrep,
                              businessFrench: l.businessFrench,
                              businessEnglish: l.businessEnglish,
                            }).map(([key, label]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={key}
                                  checked={
                                    formData.specializations[
                                      key as keyof typeof formData.specializations
                                    ]
                                  }
                                  onCheckedChange={(checked) =>
                                    setFormData({
                                      ...formData,
                                      specializations: {
                                        ...formData.specializations,
                                        [key]: checked,
                                      },
                                    })
                                  }
                                />
                                <label htmlFor={key} className="text-sm cursor-pointer">
                                  {label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">{l.yearsExperience}</Label>
                          <Input
                            id="experience"
                            type="number"
                            min="0"
                            max="50"
                            value={formData.yearsExperience}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                yearsExperience: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="credentials">{l.credentials}</Label>
                          <Textarea
                            id="credentials"
                            value={formData.credentials}
                            onChange={(e) =>
                              setFormData({ ...formData, credentials: e.target.value })
                            }
                            placeholder={l.credentialsPlaceholder}
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate">{l.hourlyRate}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              id="hourlyRate"
                              type="number"
                              min="20"
                              max="200"
                              className="pl-7"
                              value={formData.hourlyRate / 100}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  hourlyRate: (parseFloat(e.target.value) || 0) * 100,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trialRate">{l.trialRate}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              id="trialRate"
                              type="number"
                              min="0"
                              max="100"
                              className="pl-7"
                              value={formData.trialRate / 100}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  trialRate: (parseFloat(e.target.value) || 0) * 100,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="videoUrl">{l.videoUrl}</Label>
                          <Input
                            id="videoUrl"
                            type="url"
                            value={formData.videoUrl}
                            onChange={(e) =>
                              setFormData({ ...formData, videoUrl: e.target.value })
                            }
                            placeholder={l.videoUrlPlaceholder}
                          />
                        </div>
                      </>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                      {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                          {l.back}
                        </Button>
                      ) : (
                        <div />
                      )}
                      {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)}>
                          {l.next}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                          {isSubmitting ? l.submitting : l.submit}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

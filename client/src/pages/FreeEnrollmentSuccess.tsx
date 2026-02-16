import { Link, useRoute } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FreeEnrollmentSuccess() {
  const { language } = useLanguage();
  const [, params] = useRoute("/courses/:courseId/enrolled");
  const courseId = params?.courseId ? parseInt(params.courseId) : null;

  // Course info is passed via URL params; we show a generic success page
  const courseIdStr = params?.courseId || "";

  const l = language === "fr" ? {
    title: "Inscription r\u00e9ussie !",
    subtitle: "Vous \u00eates maintenant inscrit(e) \u00e0 ce cours",
    courseName: "Cours",
    startLearning: "Commencer l'apprentissage",
    viewDashboard: "Voir mon tableau de bord",
    whatNext: "Prochaines \u00e9tapes",
    step1: "Acc\u00e9dez au contenu du cours",
    step2: "Suivez votre progression",
    step3: "Obtenez votre certificat",
  } : {
    title: "Successfully Enrolled!",
    subtitle: "You are now enrolled in this course",
    courseName: "Course",
    startLearning: "Start Learning",
    viewDashboard: "View Dashboard",
    whatNext: "What's Next",
    step1: "Access course content",
    step2: "Track your progress",
    step3: "Earn your certificate",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-6">
          {/* Success Card */}
          <Card className="border-emerald-200 dark:border-emerald-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-slate-800 dark:bg-slate-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{l.title}</h1>
              <p className="text-white/90">{l.subtitle}</p>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <GraduationCap className="h-8 w-8 text-teal-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">{l.courseName}</p>
                  <p className="font-semibold">{language === "fr" ? "Votre cours est prêt" : "Your course is ready"}</p>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  {l.whatNext}
                </h3>
                <div className="space-y-3">
                  {[l.step1, l.step2, l.step3].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300">
                        {i + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={courseIdStr ? `/courses/${courseIdStr}` : "/curriculum"} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {l.startLearning}
                  </Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {l.viewDashboard}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

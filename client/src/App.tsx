import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { lazy, Suspense, useEffect } from "react";

// Critical pages - loaded immediately (Home/Landing)
import EcosystemLanding from "./pages/EcosystemLanding";
import HomeRedirect from "./pages/HomeRedirect";
import { LegacyRedirectHandler } from "./components/LegacyRedirects";
import { usePageTracking } from "./hooks/useAnalytics";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/70 text-sm">Loading...</p>
    </div>
  </div>
);

// Lazy-loaded pages - Non-critical routes
const Home = lazy(() => import("./pages/Home"));
const Coaches = lazy(() => import("./pages/Coaches"));
const LingueefyMarketplace = lazy(() => import("./pages/LingueefyMarketplace"));
const CoachProfile = lazy(() => import("./pages/CoachProfile"));
const ProfStevenAI = lazy(() => import("./pages/ProfStevenAI"));
const AICoach = lazy(() => import("./pages/AICoach"));
const AICoachEnhanced = lazy(() => import("./pages/AICoachEnhanced"));
const LearnerDashboard = lazy(() => import("./pages/LearnerDashboard"));
const LearnerDashboardEnhanced = lazy(() => import("./pages/LearnerDashboardEnhanced"));
const BarholexPortal = lazy(() => import("./pages/BarholexPortal"));
const CoachDashboard = lazy(() => import("./pages/CoachDashboard"));
const HRDashboard = lazy(() => import("./pages/HRDashboard"));
const DashboardRouter = lazy(() => import("./components/DashboardRouter"));
const BecomeCoach = lazy(() => import("./pages/BecomeCoach"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const CoachEarnings = lazy(() => import("./pages/CoachEarnings"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PricingEnhanced = lazy(() => import("./pages/PricingEnhanced"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const SLEDiagnostic = lazy(() => import("./pages/SLEDiagnostic"));
const LingueefyLanding = lazy(() => import("./pages/LingueefyLanding"));
const BarholexMediaLanding = lazy(() => import("./pages/BarholexMediaLanding"));
const RusingAcademyLanding = lazy(() => import("./pages/RusingAcademyLanding"));
const RusingAcademyHome = lazy(() => import("./pages/rusingacademy/RusingAcademyHome"));
const EdTechLanding = lazy(() => import("./pages/RusingAcademyEdTechServices"));
const CoachingLanding = lazy(() => import("./pages/LingueefyExecutiveCoaching"));
const MediaLanding = lazy(() => import("./pages/BarholexMediaProduction"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));

function Router() {
  usePageTracking();
  
  return (
    <>
      <LegacyRedirectHandler />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {/* Main ecosystem landing */}
          <Route path="/" component={EcosystemLanding} />
          
          {/* Home redirect for /home */}
          <Route path="/home" component={HomeRedirect} />
          
          {/* RusingAcademy brand routes */}
          <Route path="/rusingacademy" component={RusingAcademyLanding} />
          <Route path="/rusingacademy/home" component={RusingAcademyHome} />
          <Route path="/rusingacademy/courses" component={Courses} />
          <Route path="/rusingacademy/course/:id" component={CourseDetail} />
          <Route path="/rusingacademy/lesson/:courseId/:lessonId" component={LessonViewer} />
          
          {/* Lingueefy brand routes */}
          <Route path="/lingueefy" component={LingueefyLanding} />
          <Route path="/lingueefy/home" component={Home} />
          <Route path="/lingueefy/coaches" component={Coaches} />
          <Route path="/lingueefy/marketplace" component={LingueefyMarketplace} />
          <Route path="/lingueefy/coach/:id" component={CoachProfile} />
          <Route path="/lingueefy/pricing" component={PricingEnhanced} />
          <Route path="/lingueefy/how-it-works" component={HowItWorks} />
          <Route path="/lingueefy/become-coach" component={BecomeCoach} />
          <Route path="/lingueefy/sle-diagnostic" component={SLEDiagnostic} />
          
          {/* Barholex Media brand routes */}
          <Route path="/barholex" component={BarholexMediaLanding} />
          <Route path="/barholex/portal" component={BarholexPortal} />
          
          {/* AI Coach routes - canonical */}
          <Route path="/ai-coach">
            {() => {
              window.location.href = '/ai-coach/enhanced';
              return <PageLoader />;
            }}
          </Route>
          <Route path="/ai-coach/enhanced" component={AICoachEnhanced} />
          <Route path="/ai-coach/classic" component={AICoach} />
          
          {/* Legacy AI routes - redirect to canonical */}
          <Route path="/prof-steven-ai">
            {() => {
              window.location.href = '/ai-coach/enhanced';
              return <PageLoader />;
            }}
          </Route>
          <Route path="/prof-steven" component={ProfStevenAI} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" component={DashboardRouter} />
          <Route path="/dashboard/learner" component={LearnerDashboardEnhanced} />
          <Route path="/dashboard/learner/classic" component={LearnerDashboard} />
          <Route path="/dashboard/coach" component={CoachDashboard} />
          <Route path="/dashboard/hr" component={HRDashboard} />
          
          {/* Legacy routes - kept for backward compatibility */}
          <Route path="/coaches" component={Coaches} />
          <Route path="/coach/:id" component={CoachProfile} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/become-coach" component={BecomeCoach} />
          <Route path="/curriculum" component={Curriculum} />
          <Route path="/coach-earnings" component={CoachEarnings} />
          <Route path="/sle-diagnostic" component={SLEDiagnostic} />
          
          {/* Landing pages */}
          <Route path="/edtech" component={EdTechLanding} />
          <Route path="/coaching" component={CoachingLanding} />
          <Route path="/media" component={MediaLanding} />
          
          {/* Courses */}
          <Route path="/courses" component={Courses} />
          <Route path="/course/:id" component={CourseDetail} />
          <Route path="/lesson/:courseId/:lessonId" component={LessonViewer} />
          
          {/* Auth routes */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/verify-email" component={VerifyEmail} />
          
          {/* Static pages */}
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/verify-certificate" component={VerifyCertificate} />
          
          {/* Component showcase (dev only) */}
          <Route path="/components" component={ComponentShowcase} />
          
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  // Hide loading fallback when App mounts
  useEffect(() => {
    const loadingDiv = document.getElementById('loading-fallback');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Router />
              </TooltipProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

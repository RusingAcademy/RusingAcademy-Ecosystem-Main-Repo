import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { lazy, Suspense, useEffect, useState } from "react";

// Critical pages - loaded immediately (Home/Landing)
import EcosystemLanding from "./pages/EcosystemLanding";
import HomeRedirect from "./pages/HomeRedirect";
import { LegacyRedirectHandler } from "./components/LegacyRedirects";
import { usePageTracking } from "./hooks/useAnalytics";
import EcosystemLayout from "./components/EcosystemLayout";

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
          {/* Main ecosystem landing - NO header, full-screen immersive hero */}
          <Route path="/" component={EcosystemLanding} />
          
          {/* Home redirect for /home */}
          <Route path="/home" component={HomeRedirect} />
          
          {/* RusingAcademy brand routes - with EcosystemLayout */}
          <Route path="/rusingacademy">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Switch>
                    <Route path="/rusingacademy" component={RusingAcademyLanding} />
                    <Route path="/rusingacademy/home" component={RusingAcademyHome} />
                    <Route path="/rusingacademy/courses" component={Courses} />
                    <Route path="/rusingacademy/course/:id" component={CourseDetail} />
                    <Route path="/rusingacademy/lesson/:courseId/:lessonId" component={LessonViewer} />
                  </Switch>
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Lingueefy brand routes - with EcosystemLayout */}
          <Route path="/lingueefy">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Switch>
                    <Route path="/lingueefy" component={LingueefyLanding} />
                    <Route path="/lingueefy/home" component={Home} />
                    <Route path="/lingueefy/coaches" component={Coaches} />
                    <Route path="/lingueefy/marketplace" component={LingueefyMarketplace} />
                    <Route path="/lingueefy/coach/:id" component={CoachProfile} />
                    <Route path="/lingueefy/pricing" component={PricingEnhanced} />
                    <Route path="/lingueefy/how-it-works" component={HowItWorks} />
                    <Route path="/lingueefy/become-coach" component={BecomeCoach} />
                    <Route path="/lingueefy/sle-diagnostic" component={SLEDiagnostic} />
                  </Switch>
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Barholex Media brand routes - with EcosystemLayout */}
          <Route path="/barholex">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Switch>
                    <Route path="/barholex" component={BarholexMediaLanding} />
                    <Route path="/barholex/portal" component={BarholexPortal} />
                  </Switch>
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* AI Coach routes - with EcosystemLayout */}
          <Route path="/ai-coach">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Switch>
                    <Route path="/ai-coach" component={AICoachEnhanced} />
                    <Route path="/ai-coach/enhanced" component={AICoachEnhanced} />
                    <Route path="/ai-coach/classic" component={AICoach} />
                  </Switch>
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Legacy AI routes - redirect to canonical */}
          <Route path="/prof-steven-ai">
            {() => {
              window.location.href = '/ai-coach/enhanced';
              return <PageLoader />;
            }}
          </Route>
          <Route path="/prof-steven" component={ProfStevenAI} />
          
          {/* Dashboard routes - with EcosystemLayout */}
          <Route path="/dashboard">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Switch>
                    <Route path="/dashboard" component={DashboardRouter} />
                    <Route path="/dashboard/learner" component={LearnerDashboardEnhanced} />
                    <Route path="/dashboard/learner/classic" component={LearnerDashboard} />
                    <Route path="/dashboard/coach" component={CoachDashboard} />
                    <Route path="/dashboard/hr" component={HRDashboard} />
                  </Switch>
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Legacy routes - with EcosystemLayout for internal pages */}
          <Route path="/coaches">
            {() => (
              <EcosystemLayout>
                <Coaches />
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/coach/:id">
            {(params) => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <CoachProfile />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/pricing">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Pricing />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/how-it-works">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <HowItWorks />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/become-coach">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <BecomeCoach />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/curriculum">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Curriculum />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/coach-earnings">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <CoachEarnings />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/sle-diagnostic">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <SLEDiagnostic />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Landing pages - with EcosystemLayout */}
          <Route path="/edtech">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <EdTechLanding />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/coaching">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <CoachingLanding />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/media">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <MediaLanding />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Courses - with EcosystemLayout */}
          <Route path="/courses">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Courses />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/course/:id">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <CourseDetail />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/lesson/:courseId/:lessonId">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <LessonViewer />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
          {/* Auth routes - NO header (clean auth flow) */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/verify-email" component={VerifyEmail} />
          
          {/* Static pages - with EcosystemLayout */}
          <Route path="/about">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <About />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/contact">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/terms">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Terms />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/privacy">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <Privacy />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/privacy-policy">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicy />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          <Route path="/verify-certificate">
            {() => (
              <EcosystemLayout>
                <Suspense fallback={<PageLoader />}>
                  <VerifyCertificate />
                </Suspense>
              </EcosystemLayout>
            )}
          </Route>
          
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
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('[App] useEffect starting...');
    
    // Hide loading fallback
    const loadingDiv = document.getElementById('loading-fallback');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
      console.log('[App] Loading fallback hidden');
    }
  }, []);
  
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>Application Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }
  
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

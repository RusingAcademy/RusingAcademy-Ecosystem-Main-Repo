import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { lazy, Suspense } from "react";

// Critical pages - loaded immediately (Home/Landing)
// Sprint 3: EcosystemHome is the new premium landing page
import EcosystemHome from "./pages/EcosystemHome";
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
const AdminCommission = lazy(() => import("./pages/AdminCommission"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCoachApplications = lazy(() => import("./pages/AdminCoachApplications"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const Careers = lazy(() => import("./pages/Careers"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const ForDepartments = lazy(() => import("./pages/ForDepartments"));
const CoachEarningsHistory = lazy(() => import("./pages/CoachEarningsHistory"));
const CoachPayments = lazy(() => import("./pages/CoachPayments"));
const Messages = lazy(() => import("./pages/Messages"));
const VideoSession = lazy(() => import("./pages/VideoSession"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const BookingCancelled = lazy(() => import("./pages/BookingCancelled"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const CoachGuide = lazy(() => import("./pages/CoachGuide"));
const MySessions = lazy(() => import("./pages/MySessions"));
const LearnerSettings = lazy(() => import("./pages/LearnerSettings"));
const LearnerProgress = lazy(() => import("./pages/LearnerProgress"));
const LearnerPayments = lazy(() => import("./pages/LearnerPayments"));
const LearnerFavorites = lazy(() => import("./pages/LearnerFavorites"));
const LearnerLoyalty = lazy(() => import("./pages/LearnerLoyalty"));
const LearnerReferrals = lazy(() => import("./pages/LearnerReferrals"));
const Organizations = lazy(() => import("./pages/Organizations"));
const Community = lazy(() => import("./pages/Community"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const CertificateViewer = lazy(() => import("./pages/CertificateViewer"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));

// Ecosystem Pages - RusingAcademy
const RusingAcademyHome = lazy(() => import("./pages/rusingacademy/RusingAcademyHome"));
const RusingAcademyPrograms = lazy(() => import("./pages/rusingacademy/Programs"));
const RusingAcademyContact = lazy(() => import("./pages/rusingacademy/Contact"));

// Ecosystem Pages - Barholex Media
const BarholexHome = lazy(() => import("./pages/barholex/BarholexHome"));
const BarholexServices = lazy(() => import("./pages/barholex/Services"));
const BarholexPortfolio = lazy(() => import("./pages/barholex/Portfolio"));
const BarholexContact = lazy(() => import("./pages/barholex/Contact"));
const EcosystemHub = lazy(() => import("./pages/EcosystemHub"));
// EcosystemLanding removed - cleanup/assainissement-page13
// EcosystemLayout already imported above
const RusingAcademyLanding = lazy(() => import("./pages/RusingAcademyLanding"));
const BarholexMediaLanding = lazy(() => import("./pages/BarholexMediaLanding"));
const LingueefyLanding = lazy(() => import("./pages/LingueefyLanding"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const SLEDiagnostic = lazy(() => import("./pages/SLEDiagnostic"));
const BookingForm = lazy(() => import("./pages/BookingForm"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const Cookies = lazy(() => import("./pages/Cookies"));

// SEO Landing Pages - Phase 4A
const SLEBBBPreparation = lazy(() => import("./pages/SLEBBBPreparation"));
const SLECBCPreparation = lazy(() => import("./pages/SLECBCPreparation"));
const SLEOralCoaching = lazy(() => import("./pages/SLEOralCoaching"));
const SLEWrittenCoaching = lazy(() => import("./pages/SLEWrittenCoaching"));
const LingueefyExecutiveCoaching = lazy(() => import("./pages/LingueefyExecutiveCoaching"));
const RusingAcademyEdTechServices = lazy(() => import("./pages/RusingAcademyEdTechServices"));
const BarholexMediaProduction = lazy(() => import("./pages/BarholexMediaProduction"));
const AICoachSLEPreparation = lazy(() => import("./pages/AICoachSLEPreparation"));

// Auth Pages - Sprint 6: Clerk Integration
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ProtectedDashboard = lazy(() => import("./pages/ProtectedDashboard"));

// Sprint 6: Pillar Pages
const RusingAcademyPillar = lazy(() => import("./pages/RusingAcademyPillar"));
const LingueefyPillar = lazy(() => import("./pages/LingueefyPillar"));
const DiagnosticTunnel = lazy(() => import("./pages/DiagnosticTunnel"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

function Router() {
  // Track page views on route changes
  usePageTracking();

  return (
    <EcosystemLayout>
      {/* Handle legacy URL redirects (language-aware, no language redirects) */}
      <LegacyRedirectHandler />
      <Suspense fallback={<PageLoader />}>
        <Switch>
        {/* Auth Pages - Sprint 6: Clerk Integration */}
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-in/*" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/sign-up/*" component={SignUp} />
        <Route path="/en/sign-in" component={SignIn} />
        <Route path="/fr/connexion" component={SignIn} />
        <Route path="/en/sign-up" component={SignUp} />
        <Route path="/fr/inscription" component={SignUp} />
        <Route path="/set-password" component={SetPassword} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/verify-email" component={VerifyEmail} />
        
        {/* Ecosystem Home - Sprint 3 Premium Landing Page */}
        <Route path="/" component={EcosystemHome} />
        <Route path="/en" component={EcosystemHome} />
        <Route path="/fr" component={EcosystemHome} />
        <Route path="/en/" component={EcosystemHome} />
        <Route path="/fr/" component={EcosystemHome} />
        <Route path="/ecosystem" component={EcosystemHome} />
        <Route path="/en/ecosystem" component={EcosystemHome} />
        <Route path="/fr/ecosystem" component={EcosystemHome} />
        {/* Legacy Ecosystem Landing (preserved) */}
        {/* Route /ecosystem-legacy removed - cleanup/assainissement-page13 */}
        
        {/* Lingueefy Home */}
        <Route path="/lingueefy" component={Home} />
        <Route path="/en/lingueefy" component={Home} />
        <Route path="/fr/lingueefy" component={Home} />
        <Route path="/lingueefy/sle" component={LingueefyLanding} />
        <Route path="/en/lingueefy/sle" component={LingueefyLanding} />
        <Route path="/fr/lingueefy/sle" component={LingueefyLanding} />
        <Route path="/lingueefy/how-it-works" component={LingueefyLanding} />
        <Route path="/en/lingueefy/how-it-works" component={LingueefyLanding} />
        <Route path="/fr/lingueefy/how-it-works" component={LingueefyLanding} />
        {/* Legacy Routes - Language-aware redirects handled by LegacyRedirectHandler */}
        <Route path="/home" component={HomeRedirect} />
        <Route path="/en/home" component={HomeRedirect} />
        <Route path="/fr/home" component={HomeRedirect} />
        <Route path="/coaches" component={Coaches} />
        <Route path="/en/coaches" component={Coaches} />
        <Route path="/fr/coaches" component={Coaches} />
        <Route path="/en/marketplace" component={LingueefyMarketplace} />
        <Route path="/fr/marche" component={LingueefyMarketplace} />
        <Route path="/coaches/:slug" component={CoachProfile} />
        <Route path="/en/coaches/:slug" component={CoachProfile} />
        <Route path="/fr/coaches/:slug" component={CoachProfile} />
        <Route path="/coach/:slug" component={CoachProfile} />
        <Route path="/en/coach/:slug" component={CoachProfile} />
        <Route path="/fr/coach/:slug" component={CoachProfile} />
        {/* AI Coach - Canonical route is /ai-coach */}
        <Route path="/prof-steven-ai" component={AICoachEnhanced} />
        <Route path="/ai-coach" component={AICoachEnhanced} />
        <Route path="/messages" component={Messages} />
        <Route path="/session/:sessionId" component={VideoSession} />
        <Route path="/become-a-coach" component={BecomeCoach} />
        {/* Gate M - Bilingual Core Pages */}
        {/* About */}
        <Route path="/about" component={About} />
        <Route path="/en/about" component={About} />
        <Route path="/fr/a-propos" component={About} />
        
        {/* FAQ */}
        <Route path="/faq" component={FAQ} />
        <Route path="/en/faq" component={FAQ} />
        <Route path="/fr/faq" component={FAQ} />
        
        {/* Pricing */}
        <Route path="/pricing" component={Pricing} />
        <Route path="/en/pricing" component={Pricing} />
        <Route path="/fr/tarifs" component={Pricing} />
        <Route path="/en/pricing-enhanced" component={PricingEnhanced} />
        <Route path="/fr/tarifs-enhanced" component={PricingEnhanced} />
        
        {/* Contact */}
        <Route path="/contact" component={Contact} />
        <Route path="/en/contact" component={Contact} />
        <Route path="/fr/contact" component={Contact} />
        
        {/* How It Works */}
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/en/how-it-works" component={HowItWorks} />
        <Route path="/fr/comment-ca-marche" component={HowItWorks} />
        
        {/* Curriculum */}
        <Route path="/curriculum" component={Curriculum} />
        <Route path="/en/curriculum" component={Curriculum} />
        <Route path="/fr/programme" component={Curriculum} />
        
        {/* For Departments */}
        <Route path="/for-departments" component={ForDepartments} />
        <Route path="/en/for-departments" component={ForDepartments} />
        <Route path="/fr/pour-les-ministeres" component={ForDepartments} />
        
        {/* Community */}
        <Route path="/community" component={Community} />
        <Route path="/en/community" component={Community} />
        <Route path="/fr/communaute" component={Community} />
        
        {/* Courses */}
        <Route path="/courses" component={Courses} />
        <Route path="/en/courses" component={Courses} />
        <Route path="/fr/cours" component={Courses} />
        <Route path="/courses/:courseId" component={CourseDetail} />
        <Route path="/en/courses/:courseId" component={CourseDetail} />
        <Route path="/fr/cours/:courseId" component={CourseDetail} />
        <Route path="/courses/:courseId/lessons/:lessonId" component={LessonViewer} />
        <Route path="/en/courses/:courseId/lessons/:lessonId" component={LessonViewer} />
        <Route path="/fr/cours/:courseId/lecons/:lessonId" component={LessonViewer} />
        
        {/* SLE Diagnostic Page */}
        <Route path="/sle-diagnostic" component={SLEDiagnostic} />
        
        {/* Sprint 6: Diagnostic Tunnel */}
        <Route path="/diagnostic" component={DiagnosticTunnel} />
        <Route path="/en/diagnostic" component={DiagnosticTunnel} />
        <Route path="/fr/diagnostic" component={DiagnosticTunnel} />
        
        {/* Booking Pages */}
        <Route path="/booking" component={BookingForm} />
        <Route path="/booking/confirmation" component={BookingConfirmation} />
        <Route path="/booking/success" component={BookingSuccess} />
        <Route path="/booking/cancelled" component={BookingCancelled} />
        
        {/* Checkout Pages */}
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/checkout/cancel" component={CheckoutCancel} />
        
        {/* Barholex Portal */}
        <Route path="/barholex/portal" component={BarholexPortal} />
        <Route path="/en/barholex/portal" component={BarholexPortal} />
        <Route path="/fr/barholex/portail" component={BarholexPortal} />
        <Route path="/en/ai-coach" component={AICoachEnhanced} />
        <Route path="/fr/coach-ia" component={AICoachEnhanced} />
        
        {/* Learner Dashboard */}
        <Route path="/dashboard/learner" component={LearnerDashboard} />
        <Route path="/learner" component={LearnerDashboard} />
        <Route path="/my-learning" component={MyLearning} />
        <Route path="/certificates/:certificateNumber" component={CertificateViewer} />
        <Route path="/verify" component={VerifyCertificate} />
        <Route path="/verify/:certificateNumber" component={VerifyCertificate} />
        <Route path="/en/dashboard/learner" component={LearnerDashboardEnhanced} />
        <Route path="/fr/tableau-de-bord/apprenant" component={LearnerDashboardEnhanced} />
        <Route path="/learner/settings" component={LearnerSettings} />
        <Route path="/learner/progress" component={LearnerProgress} />
        <Route path="/learner/payments" component={LearnerPayments} />
        <Route path="/learner/favorites" component={LearnerFavorites} />
        <Route path="/learner/loyalty" component={LearnerLoyalty} />
        <Route path="/learner/referrals" component={LearnerReferrals} />
        <Route path="/learner/sessions" component={MySessions} />
        
        {/* Coach Dashboard */}
        <Route path="/dashboard/coach" component={CoachDashboard} />
        <Route path="/coach" component={CoachDashboard} />
        <Route path="/coach/earnings" component={CoachEarnings} />
        <Route path="/coach/earnings/history" component={CoachEarningsHistory} />
        <Route path="/coach/payments" component={CoachPayments} />
        <Route path="/coach/guide" component={CoachGuide} />
        <Route path="/coach/sessions" component={MySessions} />
        
        {/* HR Dashboard */}
        <Route path="/dashboard/hr" component={HRDashboard} />
        <Route path="/hr" component={HRDashboard} />
        <Route path="/organizations" component={Organizations} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/commission" component={AdminCommission} />
        <Route path="/admin/applications" component={AdminCoachApplications} />
        
        {/* Dashboard Router */}
        <Route path="/dashboard" component={DashboardRouter} />
        
        {/* Legal Pages */}
        <Route path="/terms" component={Terms} />
        <Route path="/en/terms" component={Terms} />
        <Route path="/fr/conditions" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/en/privacy" component={Privacy} />
        <Route path="/fr/confidentialite" component={Privacy} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/en/privacy-policy" component={PrivacyPolicy} />
        <Route path="/fr/politique-de-confidentialite" component={PrivacyPolicy} />
        <Route path="/cookies" component={Cookies} />
        <Route path="/en/cookies" component={Cookies} />
        <Route path="/fr/cookies" component={Cookies} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/en/cookie-policy" component={CookiePolicy} />
        <Route path="/fr/politique-cookies" component={CookiePolicy} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/en/accessibility" component={Accessibility} />
        <Route path="/fr/accessibilite" component={Accessibility} />
        
        {/* Other Pages */}
        <Route path="/blog" component={Blog} />
        <Route path="/en/blog" component={Blog} />
        <Route path="/fr/blogue" component={Blog} />
        <Route path="/careers" component={Careers} />
        <Route path="/en/careers" component={Careers} />
        <Route path="/fr/carrieres" component={Careers} />
        <Route path="/unsubscribe" component={Unsubscribe} />
        
        {/* Ecosystem Hub & Branch Pages */}
        <Route path="/hub" component={EcosystemHub} />
        <Route path="/en/hub" component={EcosystemHub} />
        <Route path="/fr/hub" component={EcosystemHub} />
        
        {/* Sprint 6: Pillar Pages */}
        <Route path="/academy" component={RusingAcademyPillar} />
        <Route path="/en/academy" component={RusingAcademyPillar} />
        <Route path="/fr/academie" component={RusingAcademyPillar} />
        <Route path="/coaching" component={LingueefyPillar} />
        <Route path="/en/coaching" component={LingueefyPillar} />
        <Route path="/fr/coaching" component={LingueefyPillar} />
        
        {/* Sprint 6: Protected Dashboard */}
        <Route path="/user-dashboard" component={ProtectedDashboard} />
        <Route path="/en/user-dashboard" component={ProtectedDashboard} />
        <Route path="/fr/tableau-de-bord-utilisateur" component={ProtectedDashboard} />
        
        {/* RusingAcademy Branch */}
        <Route path="/rusingacademy" component={RusingAcademyLanding} />
        <Route path="/en/rusingacademy" component={RusingAcademyLanding} />
        <Route path="/fr/rusingacademy" component={RusingAcademyLanding} />
        <Route path="/rusingacademy/home" component={RusingAcademyHome} />
        <Route path="/rusingacademy/programs" component={RusingAcademyPrograms} />
        <Route path="/rusingacademy/contact" component={RusingAcademyContact} />
        
        {/* Barholex Media Branch */}
        <Route path="/barholex-media" component={BarholexMediaLanding} />
        <Route path="/en/barholex-media" component={BarholexMediaLanding} />
        <Route path="/fr/barholex-media" component={BarholexMediaLanding} />
        <Route path="/barholex/home" component={BarholexHome} />
        <Route path="/barholex/services" component={BarholexServices} />
        <Route path="/barholex/portfolio" component={BarholexPortfolio} />
        <Route path="/barholex/contact" component={BarholexContact} />
        
        {/* SEO Landing Pages - Phase 4A */}
        <Route path="/en/sle-bbb-preparation" component={SLEBBBPreparation} />
        <Route path="/fr/preparation-els-bbb" component={SLEBBBPreparation} />
        <Route path="/en/sle-cbc-preparation" component={SLECBCPreparation} />
        <Route path="/fr/preparation-els-cbc" component={SLECBCPreparation} />
        <Route path="/en/sle-oral-coaching" component={SLEOralCoaching} />
        <Route path="/fr/coaching-oral-els" component={SLEOralCoaching} />
        <Route path="/en/sle-written-coaching" component={SLEWrittenCoaching} />
        <Route path="/fr/coaching-ecrit-els" component={SLEWrittenCoaching} />
        <Route path="/en/executive-coaching" component={LingueefyExecutiveCoaching} />
        <Route path="/fr/coaching-executif" component={LingueefyExecutiveCoaching} />
        <Route path="/en/edtech-services" component={RusingAcademyEdTechServices} />
        <Route path="/fr/services-edtech" component={RusingAcademyEdTechServices} />
        <Route path="/en/media-production" component={BarholexMediaProduction} />
        <Route path="/fr/production-media" component={BarholexMediaProduction} />
        <Route path="/en/ai-coach-sle-preparation" component={AICoachSLEPreparation} />
        <Route path="/fr/coach-ia-preparation-els" component={AICoachSLEPreparation} />
        
        {/* 404 Fallback */}
        <Route component={NotFound} />
        </Switch>
      </Suspense>
    </EcosystemLayout>
  );
}

function App() {
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

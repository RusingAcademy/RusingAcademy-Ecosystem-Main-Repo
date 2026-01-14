import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ClerkAuthProvider from "./contexts/ClerkProvider";
import Home from "./pages/Home";
import Coaches from "./pages/Coaches";
import LingueefyMarketplace from "./pages/LingueefyMarketplace";
import CoachProfile from "./pages/CoachProfile";
import ProfStevenAI from "./pages/ProfStevenAI";
import AICoach from "./pages/AICoach";
import AICoachEnhanced from "./pages/AICoachEnhanced";
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerDashboardEnhanced from "./pages/LearnerDashboardEnhanced";
import BarholexPortal from "./pages/BarholexPortal";
import CoachDashboard from "./pages/CoachDashboard";
import HRDashboard from "./pages/HRDashboard";
import DashboardRouter from "./components/DashboardRouter";
import BecomeCoach from "./pages/BecomeCoach";
import HowItWorks from "./pages/HowItWorks";
import Curriculum from "./pages/Curriculum";
import CoachEarnings from "./pages/CoachEarnings";
import Pricing from "./pages/Pricing";
import PricingEnhanced from "./pages/PricingEnhanced";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminCommission from "./pages/AdminCommission";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoachApplications from "./pages/AdminCoachApplications";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import CookiePolicy from "./pages/CookiePolicy";
import Accessibility from "./pages/Accessibility";
import ForDepartments from "./pages/ForDepartments";
import CoachEarningsHistory from "./pages/CoachEarningsHistory";
import CoachPayments from "./pages/CoachPayments";
import Messages from "./pages/Messages";
import VideoSession from "./pages/VideoSession";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancelled from "./pages/BookingCancelled";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import CoachGuide from "./pages/CoachGuide";
import MySessions from "./pages/MySessions";
import LearnerSettings from "./pages/LearnerSettings";
import LearnerProgress from "./pages/LearnerProgress";
import LearnerPayments from "./pages/LearnerPayments";
import LearnerFavorites from "./pages/LearnerFavorites";
import LearnerLoyalty from "./pages/LearnerLoyalty";
import LearnerReferrals from "./pages/LearnerReferrals";
import Organizations from "./pages/Organizations";
import Community from "./pages/Community";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer";
import MyLearning from "./pages/MyLearning";
import CertificateViewer from "./pages/CertificateViewer";
import VerifyCertificate from "./pages/VerifyCertificate";

// Ecosystem Pages - RusingAcademy
import RusingAcademyHome from "./pages/rusingacademy/RusingAcademyHome";
import RusingAcademyPrograms from "./pages/rusingacademy/Programs";
import RusingAcademyContact from "./pages/rusingacademy/Contact";

// Ecosystem Pages - Barholex Media
import BarholexHome from "./pages/barholex/BarholexHome";
import BarholexServices from "./pages/barholex/Services";
import BarholexPortfolio from "./pages/barholex/Portfolio";
import BarholexContact from "./pages/barholex/Contact";
import EcosystemHub from "./pages/EcosystemHub";
import EcosystemLayout from "./components/EcosystemLayout";
import EcosystemLanding from "./pages/EcosystemLanding";
import RusingAcademyLanding from "./pages/RusingAcademyLanding";
import BarholexMediaLanding from "./pages/BarholexMediaLanding";
import LingueefyLanding from "./pages/LingueefyLanding";
import HomeRedirect from "./pages/HomeRedirect";
import { LegacyRedirectHandler } from "./components/LegacyRedirects";
import Unsubscribe from "./pages/Unsubscribe";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SLEDiagnostic from "./pages/SLEDiagnostic";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import Cookies from "./pages/Cookies";

// SEO Landing Pages - Phase 4A
import SLEBBBPreparation from "./pages/SLEBBBPreparation";
import SLECBCPreparation from "./pages/SLECBCPreparation";
import SLEOralCoaching from "./pages/SLEOralCoaching";
import SLEWrittenCoaching from "./pages/SLEWrittenCoaching";
import LingueefyExecutiveCoaching from "./pages/LingueefyExecutiveCoaching";
import RusingAcademyEdTechServices from "./pages/RusingAcademyEdTechServices";
import BarholexMediaProduction from "./pages/BarholexMediaProduction";
import AICoachSLEPreparation from "./pages/AICoachSLEPreparation";

// Auth Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { usePageTracking } from "./hooks/useAnalytics";

function Router() {
  // Track page views on route changes
  usePageTracking();

  return (
    <>
      {/* Handle legacy URL redirects (language-aware, no language redirects) */}
      <LegacyRedirectHandler />
      <Switch>
      {/* Auth Pages */}
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/set-password" component={SetPassword} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Public Pages - Root and Ecosystem */}
      <Route path="/" component={EcosystemLanding} />
      <Route path="/en" component={EcosystemLanding} />
      <Route path="/fr" component={EcosystemLanding} />
      <Route path="/en/" component={EcosystemLanding} />
      <Route path="/fr/" component={EcosystemLanding} />
      <Route path="/ecosystem" component={EcosystemLanding} />
      <Route path="/en/ecosystem" component={EcosystemLanding} />
      <Route path="/fr/ecosystem" component={EcosystemLanding} />
      
      {/* Lingueefy Pages */}
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
      <Route path="/prof-steven-ai" component={ProfStevenAI} />
      <Route path="/ai-coach" component={AICoach} />
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
      <Route path="/en/pricing" component={PricingEnhanced} />
      <Route path="/fr/tarifs" component={PricingEnhanced} />
      
      {/* Courses */}
      <Route path="/courses" component={Courses} />
      <Route path="/en/courses" component={Courses} />
      <Route path="/fr/cours" component={Courses} />
      <Route path="/courses/:slug" component={CourseDetail} />
      <Route path="/en/courses/:slug" component={CourseDetail} />
      <Route path="/fr/cours/:slug" component={CourseDetail} />
      <Route path="/courses/:slug/lessons/:lessonId" component={LessonViewer} />
      
      {/* How It Works */}
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/en/how-it-works" component={HowItWorks} />
      <Route path="/fr/comment-ca-marche" component={HowItWorks} />
      
      {/* For Departments */}
      <Route path="/for-departments" component={ForDepartments} />
      <Route path="/en/for-departments" component={ForDepartments} />
      <Route path="/fr/pour-ministeres" component={ForDepartments} />
      
      {/* Community */}
      <Route path="/community" component={Community} />
      <Route path="/en/community" component={Community} />
      <Route path="/fr/communaute" component={Community} />
      
      {/* Contact */}
      <Route path="/contact" component={Contact} />
      <Route path="/en/contact" component={Contact} />
      <Route path="/fr/contact" component={Contact} />
      
      <Route path="/curriculum" component={Curriculum} />
      
      {/* Unsubscribe */}
      <Route path="/unsubscribe/:token" component={Unsubscribe} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/accessibility" component={Accessibility} />
      
      {/* Resource Pages */}
      <Route path="/blog" component={Blog} />
      <Route path="/careers" component={Careers} />
      <Route path="/organizations" component={Organizations} />
      
      {/* SLE Diagnostic Page */}
      <Route path="/sle-diagnostic" component={SLEDiagnostic} />
      
      {/* Booking Pages */}
      <Route path="/booking" component={BookingForm} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      <Route path="/booking/success" component={BookingSuccess} />
      <Route path="/booking/cancelled" component={BookingCancelled} />

      {/* Checkout Routes (Stripe) - Bilingual */}
      <Route path="/en/checkout/success" component={CheckoutSuccess} />
      <Route path="/fr/checkout/success" component={CheckoutSuccess} />
      <Route path="/en/checkout/cancel" component={CheckoutCancel} />
      <Route path="/fr/checkout/cancel" component={CheckoutCancel} />
      
      {/* Dashboard Router - RBAC-based routing */}
      <Route path="/dashboard" component={DashboardRouter} />
      <Route path="/en/dashboard" component={LearnerDashboardEnhanced} />
      <Route path="/fr/tableau-de-bord" component={LearnerDashboardEnhanced} />
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

      <Route path="/my-sessions" component={MySessions} />
      <Route path="/settings" component={LearnerSettings} />
      <Route path="/progress" component={LearnerProgress} />
      <Route path="/payments" component={LearnerPayments} />
      <Route path="/favorites" component={LearnerFavorites} />
      <Route path="/rewards" component={LearnerLoyalty} />
      <Route path="/referrals" component={LearnerReferrals} />
      
      {/* Coach Dashboard */}
      <Route path="/dashboard/coach" component={CoachDashboard} />
      <Route path="/coach" component={CoachDashboard} />
      <Route path="/coach/dashboard" component={CoachDashboard} />
      <Route path="/coach/earnings" component={CoachEarnings} />
      <Route path="/coach/earnings/history" component={CoachEarningsHistory} />
      <Route path="/coach/payments" component={CoachPayments} />
      <Route path="/coach/guide" component={CoachGuide} />
      
      {/* HR Dashboard */}
      <Route path="/dashboard/hr" component={HRDashboard} />
      <Route path="/dashboard/hr/overview" component={HRDashboard} />
      <Route path="/hr" component={HRDashboard} />
      <Route path="/hr/dashboard" component={HRDashboard} />
      
      {/* Admin Dashboard */}
      <Route path="/dashboard/admin" component={AdminDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/applications" component={AdminCoachApplications} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/commission" component={AdminCommission} />
      
      {/* Ecosystem - RusingAcademy */}
      <Route path="/rusingacademy" component={RusingAcademyLanding} />
      <Route path="/en/rusingacademy" component={RusingAcademyLanding} />
      <Route path="/fr/rusingacademy" component={RusingAcademyLanding} />
      <Route path="/rusingacademy/old" component={RusingAcademyHome} />
      <Route path="/rusingacademy/programs" component={RusingAcademyPrograms} />
      <Route path="/en/rusingacademy/programs" component={RusingAcademyPrograms} />
      <Route path="/fr/rusingacademy/programs" component={RusingAcademyPrograms} />
      <Route path="/rusingacademy/contact" component={RusingAcademyContact} />
      <Route path="/en/rusingacademy/contact" component={RusingAcademyContact} />
      <Route path="/fr/rusingacademy/contact" component={RusingAcademyContact} />
      
      {/* Ecosystem - Barholex Media */}
      <Route path="/barholex-media" component={BarholexMediaLanding} />
      <Route path="/en/barholex-media" component={BarholexMediaLanding} />
      <Route path="/fr/barholex-media" component={BarholexMediaLanding} />
      <Route path="/barholex" component={BarholexMediaLanding} />
      <Route path="/en/barholex" component={BarholexMediaLanding} />
      <Route path="/fr/barholex" component={BarholexMediaLanding} />
      <Route path="/barholex/old" component={BarholexHome} />
      <Route path="/barholex/services" component={BarholexServices} />
      <Route path="/en/barholex/services" component={BarholexServices} />
      <Route path="/fr/barholex/services" component={BarholexServices} />
      <Route path="/barholex/portfolio" component={BarholexPortfolio} />
      <Route path="/en/barholex/portfolio" component={BarholexPortfolio} />
      <Route path="/fr/barholex/portfolio" component={BarholexPortfolio} />
      <Route path="/barholex/contact" component={BarholexContact} />
      <Route path="/en/barholex/contact" component={BarholexContact} />
      <Route path="/fr/barholex/contact" component={BarholexContact} />
      
      {/* SEO Landing Pages - SLE Preparation */}
      <Route path="/en/sle-bbb-preparation" component={SLEBBBPreparation} />
      <Route path="/fr/preparation-els-bbb" component={SLEBBBPreparation} />
      <Route path="/en/sle-cbc-preparation" component={SLECBCPreparation} />
      <Route path="/fr/preparation-els-cbc" component={SLECBCPreparation} />
      <Route path="/en/sle-oral-coaching" component={SLEOralCoaching} />
      <Route path="/fr/coaching-oral-els" component={SLEOralCoaching} />
      <Route path="/en/sle-written-coaching" component={SLEWrittenCoaching} />
      <Route path="/fr/coaching-ecrit-els" component={SLEWrittenCoaching} />
      
      {/* SEO Landing Pages - Lingueefy Executive */}
      <Route path="/en/lingueefy/executive-coaching" component={LingueefyExecutiveCoaching} />
      <Route path="/fr/lingueefy/coaching-cadres" component={LingueefyExecutiveCoaching} />
      
      {/* SEO Landing Pages - RusingAcademy EdTech */}
      <Route path="/en/rusingacademy/edtech-services" component={RusingAcademyEdTechServices} />
      <Route path="/fr/rusingacademy/services-edtech" component={RusingAcademyEdTechServices} />
      
      {/* SEO Landing Pages - Barholex Media Production */}
      <Route path="/en/barholex/media-production" component={BarholexMediaProduction} />
      <Route path="/fr/barholex/production-media" component={BarholexMediaProduction} />
      
      {/* SEO Landing Pages - AI Coach SLE Preparation */}
      <Route path="/en/ai-coach-sle-preparation" component={AICoachSLEPreparation} />
      <Route path="/fr/coach-ia-preparation-els" component={AICoachSLEPreparation} />
      
      {/* Ecosystem Hub */}
      <Route path="/ecosystem" component={EcosystemHub} />
      
      {/* Error Pages */}
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <ClerkAuthProvider>
      <HelmetProvider>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light" switchable={true}>
            <LanguageProvider>
              <TooltipProvider>
                <NotificationProvider>
                  <Toaster />
                  <EcosystemLayout>
                    <Router />
                  </EcosystemLayout>
                </NotificationProvider>
              </TooltipProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </ClerkAuthProvider>
  );
}

export default App;
// Deploy trigger Mon Jan 12 11:15:25 EST 2026
// Deploy trigger Mon Jan 12 13:31:51 EST 2026

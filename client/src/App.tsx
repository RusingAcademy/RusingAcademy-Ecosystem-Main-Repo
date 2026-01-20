import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Home from "./pages/Home";
import Coaches from "./pages/Coaches";
import CoachProfile from "./pages/CoachProfile";
import ProfStevenAI from "./pages/ProfStevenAI";
import AICoach from "./pages/AICoach";
import LearnerDashboard from "./pages/LearnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import HRDashboard from "./pages/HRDashboard";
import DashboardRouter from "./components/DashboardRouter";
import BecomeCoach from "./pages/BecomeCoach";
import HowItWorks from "./pages/HowItWorks";
import Curriculum from "./pages/Curriculum";
import CoachEarnings from "./pages/CoachEarnings";
import Pricing from "./pages/Pricing";
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
import EcosystemHome from "./pages/EcosystemHome";
// EcosystemLanding removed - using EcosystemHome as main landing page
import RusingAcademyLanding from "./pages/RusingAcademyLanding";
import BarholexMediaLanding from "./pages/BarholexMediaLanding";
import LingueefyLanding from "./pages/LingueefyLanding";
import HomeRedirect from "./pages/HomeRedirect";
import Unsubscribe from "./pages/Unsubscribe";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SLEDiagnostic from "./pages/SLEDiagnostic";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import Cookies from "./pages/Cookies";

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
    <Switch>
      {/* Auth Pages */}
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/set-password" component={SetPassword} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Public Pages */}
      <Route path="/" component={EcosystemHome} />
      <Route path="/ecosystem" component={EcosystemHome} />
      <Route path="/lingueefy" component={Home} />
      <Route path="/lingueefy/sle" component={LingueefyLanding} />
      <Route path="/lingueefy/how-it-works" component={LingueefyLanding} />
      <Route path="/home" component={HomeRedirect} />
      <Route path="/coaches" component={Coaches} />
      <Route path="/coaches/:slug" component={CoachProfile} />
      <Route path="/coach/:slug" component={CoachProfile} />
      <Route path="/prof-steven-ai" component={ProfStevenAI} />
      <Route path="/ai-coach" component={AICoach} />
      <Route path="/messages" component={Messages} />
      <Route path="/session/:sessionId" component={VideoSession} />
      <Route path="/become-a-coach" component={BecomeCoach} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:slug" component={CourseDetail} />
      <Route path="/courses/:slug/lessons/:lessonId" component={LessonViewer} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Unsubscribe */}
      <Route path="/unsubscribe/:token" component={Unsubscribe} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/accessibility" component={Accessibility} />
      
      {/* Resource Pages */}
      <Route path="/faq" component={FAQ} />
      <Route path="/blog" component={Blog} />
      <Route path="/careers" component={Careers} />
      <Route path="/for-departments" component={ForDepartments} />
      <Route path="/organizations" component={Organizations} />
      <Route path="/community" component={Community} />
      
      {/* SLE Diagnostic Page */}
      <Route path="/sle-diagnostic" component={SLEDiagnostic} />
      
      {/* Booking Pages */}
      <Route path="/booking" component={BookingForm} />
      <Route path="/booking/confirmation" component={BookingConfirmation} />
      <Route path="/booking/success" component={BookingSuccess} />
      <Route path="/booking/cancelled" component={BookingCancelled} />
      
      {/* Dashboard Router - RBAC-based routing */}
      <Route path="/dashboard" component={DashboardRouter} />
      
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
      <Route path="/rusingacademy/old" component={RusingAcademyHome} />
      <Route path="/rusingacademy/programs" component={RusingAcademyPrograms} />
      <Route path="/rusingacademy/contact" component={RusingAcademyContact} />
      
      {/* Ecosystem - Barholex Media */}
      <Route path="/barholex-media" component={BarholexMediaLanding} />
      <Route path="/barholex" component={BarholexMediaLanding} />
      <Route path="/barholex/old" component={BarholexHome} />
      <Route path="/barholex/services" component={BarholexServices} />
      <Route path="/barholex/portfolio" component={BarholexPortfolio} />
      <Route path="/barholex/contact" component={BarholexContact} />
      
      {/* Ecosystem Hub - removed, using EcosystemHome at /ecosystem */}
      
      {/* Error Pages */}
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
// Deploy trigger Mon Jan 12 11:15:25 EST 2026
// Deploy trigger Mon Jan 12 13:31:51 EST 2026

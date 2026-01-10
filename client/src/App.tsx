import { Toaster } from "@/components/ui/sonner";
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
import LearnerDashboard from "./pages/LearnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
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

// Ecosystem Pages - RusingÂcademy
import RusingAcademyHome from "./pages/rusingacademy/RusingAcademyHome";
import RusingAcademyPrograms from "./pages/rusingacademy/Programs";
import RusingAcademyContact from "./pages/rusingacademy/Contact";

// Ecosystem Pages - Barholex Media
import BarholexHome from "./pages/barholex/BarholexHome";
import BarholexServices from "./pages/barholex/Services";
import BarholexPortfolio from "./pages/barholex/Portfolio";
import BarholexContact from "./pages/barholex/Contact";
import EcosystemHub from "./pages/EcosystemHub";
import EcosystemLanding from "./pages/EcosystemLanding";
import RusingAcademyLanding from "./pages/RusingAcademyLanding";
import BarholexMediaLanding from "./pages/BarholexMediaLanding";
import Unsubscribe from "./pages/Unsubscribe";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={EcosystemLanding} />
      <Route path="/ecosystem" component={EcosystemLanding} />
      <Route path="/home" component={Home} />
      <Route path="/lingueefy" component={Home} />
      <Route path="/coaches" component={Coaches} />
      <Route path="/coaches/:slug" component={CoachProfile} />
      <Route path="/coach/:slug" component={CoachProfile} />
      <Route path="/prof-steven-ai" component={ProfStevenAI} />
      <Route path="/messages" component={Messages} />
      <Route path="/session/:sessionId" component={VideoSession} />
      <Route path="/become-a-coach" component={BecomeCoach} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Unsubscribe */}
      <Route path="/unsubscribe/:token" component={Unsubscribe} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/accessibility" component={Accessibility} />
      
      {/* Resource Pages */}
      <Route path="/faq" component={FAQ} />
      <Route path="/blog" component={Blog} />
      <Route path="/careers" component={Careers} />
      <Route path="/for-departments" component={ForDepartments} />
      <Route path="/organizations" component={Organizations} />
      <Route path="/community" component={Community} />
      
      {/* Booking Pages */}
      <Route path="/booking/success" component={BookingSuccess} />
      <Route path="/booking/cancelled" component={BookingCancelled} />
      
      {/* Learner Dashboard */}
      <Route path="/dashboard" component={LearnerDashboard} />
      <Route path="/learner" component={LearnerDashboard} />
      <Route path="/my-sessions" component={MySessions} />
      <Route path="/settings" component={LearnerSettings} />
      <Route path="/progress" component={LearnerProgress} />
      <Route path="/payments" component={LearnerPayments} />
      <Route path="/favorites" component={LearnerFavorites} />
      <Route path="/rewards" component={LearnerLoyalty} />
      <Route path="/referrals" component={LearnerReferrals} />
      
      {/* Coach Dashboard */}
      <Route path="/coach" component={CoachDashboard} />
      <Route path="/coach/dashboard" component={CoachDashboard} />
      <Route path="/coach/earnings" component={CoachEarnings} />
      <Route path="/coach/earnings/history" component={CoachEarningsHistory} />
      <Route path="/coach/payments" component={CoachPayments} />
      <Route path="/coach/guide" component={CoachGuide} />
      
      {/* Admin Pages */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/applications" component={AdminCoachApplications} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/commission" component={AdminCommission} />
      
      {/* Ecosystem - RusingÂcademy */}
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
      
      {/* Ecosystem Hub */}
      <Route path="/ecosystem" component={EcosystemHub} />
      
      {/* Error Pages */}
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <LanguageProvider>
          <TooltipProvider>
            <NotificationProvider>
              <Toaster />
              <Router />
            </NotificationProvider>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

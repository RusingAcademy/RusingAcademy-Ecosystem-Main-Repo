import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Coaches from "./pages/Coaches";
import CoachProfile from "./pages/CoachProfile";
import ProfStevenAI from "./pages/ProfStevenAI";
import LearnerDashboard from "./pages/LearnerDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import BecomeCoach from "./pages/BecomeCoach";
import HowItWorks from "./pages/HowItWorks";
import CoachEarnings from "./pages/CoachEarnings";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminCommission from "./pages/AdminCommission";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import CookiePolicy from "./pages/CookiePolicy";
import Accessibility from "./pages/Accessibility";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/coaches" component={Coaches} />
      <Route path="/coaches/:slug" component={CoachProfile} />
      <Route path="/prof-steven-ai" component={ProfStevenAI} />
      <Route path="/become-a-coach" component={BecomeCoach} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Legal Pages */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/accessibility" component={Accessibility} />
      
      {/* Resource Pages */}
      <Route path="/faq" component={FAQ} />
      <Route path="/blog" component={Blog} />
      <Route path="/careers" component={Careers} />
      
      {/* Learner Dashboard */}
      <Route path="/dashboard" component={LearnerDashboard} />
      <Route path="/learner" component={LearnerDashboard} />
      
      {/* Coach Dashboard */}
      <Route path="/coach" component={CoachDashboard} />
      <Route path="/coach/dashboard" component={CoachDashboard} />
      <Route path="/coach/earnings" component={CoachEarnings} />
      
      {/* Admin Pages */}
      <Route path="/admin/commission" component={AdminCommission} />
      
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
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

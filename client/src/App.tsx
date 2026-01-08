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
      
      {/* Learner Dashboard */}
      <Route path="/dashboard" component={LearnerDashboard} />
      <Route path="/learner" component={LearnerDashboard} />
      
      {/* Coach Dashboard */}
      <Route path="/coach" component={CoachDashboard} />
      <Route path="/coach/dashboard" component={CoachDashboard} />
      
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

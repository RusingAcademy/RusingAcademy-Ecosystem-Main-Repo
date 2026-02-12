import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import SLEAICompanionMobileButton from "./components/SLEAICompanionMobileButton";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import EcosystemLayout from "./components/EcosystemLayout";
import NotificationPermission from "./components/NotificationPermission";
import OfflineIndicator from "./components/OfflineIndicator";
import { usePageTracking } from "./hooks/useAnalytics";

// ─── Loading Fallback ───────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// ─── Lazy-loaded Page Components ────────────────────────────────────
// Critical path (Hub) stays eager for fastest initial paint
import Hub from "./pages/Hub";

// Auth Pages
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const HomeRedirect = lazy(() => import("./pages/HomeRedirect"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CMSPage = lazy(() => import("./pages/CMSPage"));
const Coaches = lazy(() => import("./pages/Coaches"));
const CoachProfile = lazy(() => import("./pages/CoachProfile"));
const AICoach = lazy(() => import("./pages/AICoach"));
const BecomeCoach = lazy(() => import("./pages/BecomeCoachNew"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const CurriculumPathSeries = lazy(() => import("./pages/CurriculumPathSeries"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const Careers = lazy(() => import("./pages/Careers"));
const ForDepartments = lazy(() => import("./pages/ForDepartments"));
const ForBusiness = lazy(() => import("./pages/ForBusiness"));
const Organizations = lazy(() => import("./pages/Organizations"));
const Community = lazy(() => import("./pages/Community"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

// Courses & Learning
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const CourseSuccess = lazy(() => import("./pages/CourseSuccess"));
const Paths = lazy(() => import("./pages/Paths"));
const PathDetail = lazy(() => import("./pages/PathDetail"));
const PathEnrollmentSuccess = lazy(() => import("./pages/PathEnrollmentSuccess"));
const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const LearnCourse = lazy(() => import("./pages/LearnCourse"));
const LearnPortal = lazy(() => import("./pages/LearnPortal"));
const LearnLessonPage = lazy(() => import("./pages/LearnLessonPage"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const MyDownloads = lazy(() => import("./pages/MyDownloads"));
const CertificateViewer = lazy(() => import("./pages/CertificateViewer"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const BundlesAndPaths = lazy(() => import("./pages/BundlesAndPaths"));

// SLE & Practice
const SLEDiagnostic = lazy(() => import("./pages/SLEDiagnostic"));
const ConversationPractice = lazy(() => import("./pages/ConversationPractice"));
const Practice = lazy(() => import("./pages/Practice"));
const SLEPractice = lazy(() => import("./pages/SLEPractice"));
const SLEExamSimulation = lazy(() => import("./pages/SLEExamSimulation"));
const SLEProgressDashboard = lazy(() => import("./pages/SLEProgressDashboard"));
const DictationPractice = lazy(() => import("./pages/DictationPractice"));
const PracticeHistory = lazy(() => import("./pages/PracticeHistory"));

// Booking
const BookingForm = lazy(() => import("./pages/BookingForm"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const BookingCancelled = lazy(() => import("./pages/BookingCancelled"));
const CoachingPlanSuccess = lazy(() => import("./pages/CoachingPlanSuccess"));
const BookSession = lazy(() => import("./pages/BookSession"));

// Legal
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

// Learner Dashboard
const LearnerDashboard = lazy(() => import("./pages/LearnerDashboard"));
const LearnerCourses = lazy(() => import("./pages/LearnerCourses"));
const MySessions = lazy(() => import("./pages/MySessions"));
const LearnerSettings = lazy(() => import("./pages/LearnerSettings"));
const LearnerProgress = lazy(() => import("./pages/LearnerProgress"));
const ProgressReport = lazy(() => import("./pages/ProgressReport"));
const LearnerPayments = lazy(() => import("./pages/LearnerPayments"));
const LearnerFavorites = lazy(() => import("./pages/LearnerFavorites"));
const LearnerLoyalty = lazy(() => import("./pages/LearnerLoyalty"));
const BadgesCatalog = lazy(() => import("./pages/BadgesCatalog"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const LearnerReferrals = lazy(() => import("./pages/LearnerReferrals"));
const Messages = lazy(() => import("./pages/Messages"));
const VideoSession = lazy(() => import("./pages/VideoSession"));

// Coach Dashboard
const CoachDashboard = lazy(() => import("./pages/CoachDashboard"));
const CoachEarnings = lazy(() => import("./pages/CoachEarnings"));
const CoachEarningsHistory = lazy(() => import("./pages/CoachEarningsHistory"));
const CoachPayments = lazy(() => import("./pages/CoachPayments"));
const CoachGuide = lazy(() => import("./pages/CoachGuide"));
const CoachTerms = lazy(() => import("./pages/CoachTerms"));
const CoachInviteClaim = lazy(() => import("./pages/CoachInviteClaim"));
const AcceptInvitation = lazy(() => import("./pages/AcceptInvitation"));

// HR Dashboard
const HRDashboard = lazy(() => import("./pages/HRDashboard"));

// Admin
const AdminControlCenter = lazy(() => import("./pages/AdminControlCenter"));
const AdminCoachApplications = lazy(() => import("./pages/AdminCoachApplications"));
const AdminCommission = lazy(() => import("./pages/AdminCommission"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminReminders = lazy(() => import("./pages/AdminReminders"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminContentManagement = lazy(() => import("./pages/AdminContentManagement"));
const DashboardRouter = lazy(() => import("./components/DashboardRouter"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));

// Unified App Dashboard
const AppDashboard = lazy(() => import("./pages/AppDashboard"));

// Ecosystem Pages - RusingAcademy
const RusingAcademyLanding = lazy(() => import("./pages/RusingAcademyLanding"));
const RusingAcademyHome = lazy(() => import("./pages/rusingacademy/RusingAcademyHome"));
const RusingAcademyPrograms = lazy(() => import("./pages/rusingacademy/Programs"));
const RusingAcademyContact = lazy(() => import("./pages/rusingacademy/Contact"));
const RusingAcademyForBusiness = lazy(() => import("./pages/rusingacademy/ForBusiness"));
const RusingAcademyForGovernment = lazy(() => import("./pages/rusingacademy/ForGovernment"));

// Ecosystem Pages - Barholex Media
const BarholexMediaLanding = lazy(() => import("./pages/BarholexMediaLanding"));
const BarholexHome = lazy(() => import("./pages/barholex/BarholexHome"));
const BarholexServices = lazy(() => import("./pages/barholex/Services"));
const BarholexPortfolio = lazy(() => import("./pages/barholex/Portfolio"));
const BarholexContact = lazy(() => import("./pages/barholex/Contact"));

// Ecosystem Hub & Landing
const EcosystemHub = lazy(() => import("./pages/EcosystemHub"));
const EcosystemLanding = lazy(() => import("./pages/EcosystemLanding"));
const LingueefyLanding = lazy(() => import("./pages/LingueefyLanding"));

function Router() {
  // Track page views on route changes
  usePageTracking();

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Auth Pages */}
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/set-password" component={SetPassword} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/verify-email" component={VerifyEmail} />
        
        {/* Public Pages */}
        <Route path="/" component={Hub} />
        <Route path="/ecosystem" component={Hub} />
        <Route path="/ecosystem-old" component={EcosystemLanding} />
        <Route path="/lingueefy" component={Home} />
        <Route path="/lingueefy/success" component={CoachingPlanSuccess} />
        <Route path="/home" component={HomeRedirect} />
        <Route path="/coaches" component={Coaches} />
        <Route path="/coaches/:slug" component={CoachProfile} />
        <Route path="/coach-invite/:token" component={CoachInviteClaim} />
        <Route path="/invite/:token" component={AcceptInvitation} />
        <Route path="/messages" component={Messages} />
        <Route path="/session/:sessionId" component={VideoSession} />
        <Route path="/become-a-coach" component={BecomeCoach} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/curriculum" component={CurriculumPathSeries} />
        <Route path="/curriculum-old" component={Curriculum} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/courses-old" component={Courses} />
        <Route path="/courses/success" component={CourseSuccess} />
        <Route path="/courses/:slug" component={CourseDetail} />
        <Route path="/courses/:slug/lessons/:lessonId" component={LessonViewer} />
        <Route path="/learn/:slug" component={LearnPortal} />
        <Route path="/learn/:slug/lessons/:lessonId" component={LearnLessonPage} />
        <Route path="/paths" component={Paths} />
        <Route path="/paths/:slug" component={PathDetail} />
        <Route path="/paths/:slug/success" component={PathEnrollmentSuccess} />
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
        <Route path="/for-business" component={ForBusiness} />
        <Route path="/organizations" component={Organizations} />
        <Route path="/community" component={Community} />
        
        {/* SLE Diagnostic Page */}
        <Route path="/sle-diagnostic" component={SLEDiagnostic} />
        
        {/* AI Coach - Prof Steven */}
        <Route path="/prof-steven-ai" component={AICoach} />
        <Route path="/ai-coach" component={AICoach} />
        <Route path="/sle-ai-companion" component={AICoach} />
        
        {/* Booking Pages */}
        <Route path="/booking" component={BookingForm} />
        <Route path="/booking/confirmation" component={BookingConfirmation} />
        <Route path="/booking/success" component={BookingSuccess} />
        <Route path="/booking/cancelled" component={BookingCancelled} />
        
        {/* Dashboard Router - RBAC-based routing */}
        <Route path="/dashboard" component={DashboardRouter} />

        {/* ── Unified Dashboard (/app) ── role-based sidebar, modular sections */}
        <Route path="/app">{() => <AppDashboard section="overview" />}</Route>
        <Route path="/app/overview">{() => <AppDashboard section="overview" />}</Route>
        <Route path="/app/my-courses">{() => <AppDashboard section="my-courses" />}</Route>
        <Route path="/app/my-progress">{() => <AppDashboard section="my-progress" />}</Route>
        <Route path="/app/my-sessions">{() => <AppDashboard section="my-sessions" />}</Route>
        <Route path="/app/favorites">{() => <AppDashboard section="favorites" />}</Route>
        <Route path="/app/certificates">{() => <AppDashboard section="certificates" />}</Route>
        <Route path="/app/settings">{() => <AppDashboard section="settings" />}</Route>
        <Route path="/app/notifications">{() => <AppDashboard section="notifications" />}</Route>
        <Route path="/app/ai-practice">{() => <AppDashboard section="ai-practice" />}</Route>
        <Route path="/app/conversation">{() => <AppDashboard section="conversation" />}</Route>
        <Route path="/app/practice-history">{() => <AppDashboard section="practice-history" />}</Route>
        <Route path="/app/simulation">{() => <AppDashboard section="simulation" />}</Route>
        <Route path="/app/sle-exam">{() => <AppDashboard section="sle-exam" />}</Route>
        <Route path="/app/sle-progress">{() => <AppDashboard section="sle-progress" />}</Route>
        <Route path="/app/badges">{() => <AppDashboard section="badges" />}</Route>
        <Route path="/app/loyalty">{() => <AppDashboard section="loyalty" />}</Route>
        <Route path="/app/my-students">{() => <AppDashboard section="my-students" />}</Route>
        <Route path="/app/availability">{() => <AppDashboard section="availability" />}</Route>
        <Route path="/app/coach-profile">{() => <AppDashboard section="coach-profile" />}</Route>
        <Route path="/app/earnings">{() => <AppDashboard section="earnings" />}</Route>
        <Route path="/app/video-sessions">{() => <AppDashboard section="video-sessions" />}</Route>
        <Route path="/app/coach-guide">{() => <AppDashboard section="coach-guide" />}</Route>
        <Route path="/app/team">{() => <AppDashboard section="team" />}</Route>
        <Route path="/app/cohorts">{() => <AppDashboard section="cohorts" />}</Route>
        <Route path="/app/budget">{() => <AppDashboard section="budget" />}</Route>
        <Route path="/app/compliance">{() => <AppDashboard section="compliance" />}</Route>
        
        {/* Learner Dashboard */}
        <Route path="/dashboard/learner" component={LearnerDashboard} />
        <Route path="/learner" component={LearnerDashboard} />
        <Route path="/learner/courses" component={LearnerCourses} />
        <Route path="/learner/book-session" component={BookSession} />
        <Route path="/my-learning" component={MyLearning} />
        <Route path="/certificates/:certificateNumber" component={CertificateViewer} />
        <Route path="/verify" component={VerifyCertificate} />
        <Route path="/verify/:certificateNumber" component={VerifyCertificate} />

        <Route path="/my-sessions" component={MySessions} />
        <Route path="/settings" component={LearnerSettings} />
        <Route path="/progress" component={LearnerProgress} />
        <Route path="/progress/report" component={ProgressReport} />
        <Route path="/payments" component={LearnerPayments} />
        <Route path="/favorites" component={LearnerFavorites} />
        <Route path="/rewards" component={LearnerLoyalty} />
        <Route path="/badges" component={BadgesCatalog} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/profile/:userId" component={UserProfile} />
        <Route path="/referrals" component={LearnerReferrals} />
        <Route path="/affiliate" component={AffiliateDashboard} />
        <Route path="/bundles" component={BundlesAndPaths} />
        <Route path="/conversation-practice" component={ConversationPractice} />
        <Route path="/practice" component={Practice} />
        <Route path="/sle-practice" component={SLEPractice} />
        <Route path="/sle-exam-simulation" component={SLEExamSimulation} />
        <Route path="/sle-progress" component={SLEProgressDashboard} />
        <Route path="/dictation-practice" component={DictationPractice} />
        <Route path="/practice-history" component={PracticeHistory} />
        <Route path="/practice-history/:sessionId" component={PracticeHistory} />
        <Route path="/downloads" component={MyDownloads} />
        
        {/* Coach Dashboard */}
        <Route path="/dashboard/coach" component={CoachDashboard} />
        <Route path="/coach" component={CoachDashboard} />
        <Route path="/coach/dashboard" component={CoachDashboard} />
        <Route path="/coach/earnings" component={CoachEarnings} />
        <Route path="/coach/earnings/history" component={CoachEarningsHistory} />
        <Route path="/coach/payments" component={CoachPayments} />
        <Route path="/coach/guide" component={CoachGuide} />
        <Route path="/coach/terms" component={CoachTerms} />
        <Route path="/coach/:slug" component={CoachProfile} />
        
        {/* HR Dashboard */}
        <Route path="/dashboard/hr" component={HRDashboard} />
        <Route path="/dashboard/hr/overview" component={HRDashboard} />
        <Route path="/hr" component={HRDashboard} />
        <Route path="/hr/dashboard" component={HRDashboard} />
        
        {/* Admin Control Center - Kajabi-style sidebar layout */}
        <Route path="/admin">{() => <AdminControlCenter section="overview" />}</Route>
        <Route path="/admin/overview">{() => <AdminControlCenter section="overview" />}</Route>
        <Route path="/admin/users">{() => <AdminControlCenter section="users" />}</Route>
        <Route path="/admin/coaches">{() => <AdminControlCenter section="coaches" />}</Route>
        <Route path="/admin/coaching">{() => <AdminControlCenter section="coaches" />}</Route>
        <Route path="/admin/courses">{() => <AdminControlCenter section="courses" />}</Route>
        <Route path="/admin/pricing">{() => <AdminControlCenter section="pricing" />}</Route>
        <Route path="/admin/coupons">{() => <AdminControlCenter section="coupons" />}</Route>
        <Route path="/admin/crm">{() => <AdminControlCenter section="crm" />}</Route>
        <Route path="/admin/email">{() => <AdminControlCenter section="email" />}</Route>
        <Route path="/admin/analytics">{() => <AdminControlCenter section="analytics" />}</Route>
        <Route path="/admin/activity">{() => <AdminControlCenter section="activity" />}</Route>
        <Route path="/admin/preview">{() => <AdminControlCenter section="preview" />}</Route>
        <Route path="/admin/settings">{() => <AdminControlCenter section="settings" />}</Route>
        <Route path="/admin/funnels">{() => <AdminControlCenter section="funnels" />}</Route>
        <Route path="/admin/automations">{() => <AdminControlCenter section="automations" />}</Route>
        <Route path="/admin/pages">{() => <AdminControlCenter section="pages" />}</Route>
        <Route path="/admin/ai-companion">{() => <AdminControlCenter section="ai-companion" />}</Route>
        <Route path="/admin/sales-analytics">{() => <AdminControlCenter section="sales-analytics" />}</Route>
        <Route path="/admin/media-library">{() => <AdminControlCenter section="media-library" />}</Route>
        <Route path="/admin/permissions">{() => <AdminControlCenter section="permissions" />}</Route>
        <Route path="/admin/email-templates">{() => <AdminControlCenter section="email-templates" />}</Route>
        <Route path="/admin/notifications">{() => <AdminControlCenter section="notifications" />}</Route>
        <Route path="/admin/import-export">{() => <AdminControlCenter section="import-export" />}</Route>
        <Route path="/admin/preview-mode">{() => <AdminControlCenter section="preview-mode" />}</Route>
        <Route path="/admin/ai-predictive">{() => <AdminControlCenter section="ai-predictive" />}</Route>
        <Route path="/admin/stripe-testing">{() => <AdminControlCenter section="stripe-testing" />}</Route>
        <Route path="/admin/live-kpi">{() => <AdminControlCenter section="live-kpi" />}</Route>
        <Route path="/admin/onboarding">{() => <AdminControlCenter section="onboarding" />}</Route>
        <Route path="/admin/enterprise">{() => <AdminControlCenter section="enterprise" />}</Route>
        <Route path="/admin/sle-exam">{() => <AdminControlCenter section="sle-exam" />}</Route>
        <Route path="/admin/content-intelligence">{() => <AdminControlCenter section="content-intelligence" />}</Route>
        <Route path="/admin/drip-content">{() => <AdminControlCenter section="drip-content" />}</Route>
        <Route path="/admin/ab-testing">{() => <AdminControlCenter section="ab-testing" />}</Route>
        <Route path="/admin/org-billing">{() => <AdminControlCenter section="org-billing" />}</Route>
        <Route path="/admin/weekly-challenges">{() => <AdminControlCenter section="weekly-challenges" />}</Route>
        <Route path="/admin/enrollments">{() => <AdminControlCenter section="enrollments" />}</Route>
        <Route path="/admin/reviews">{() => <AdminControlCenter section="reviews" />}</Route>
        <Route path="/admin/certificates">{() => <AdminControlCenter section="certificates" />}</Route>
        <Route path="/admin/gamification">{() => <AdminControlCenter section="gamification" />}</Route>
        {/* Legacy admin routes */}
        <Route path="/dashboard/admin">{() => <AdminControlCenter section="overview" />}</Route>
        <Route path="/admin/applications" component={AdminCoachApplications} />
        <Route path="/admin/dashboard">{() => <AdminControlCenter section="overview" />}</Route>
        <Route path="/admin/commission" component={AdminCommission} />
        <Route path="/admin/reminders" component={AdminReminders} />
        <Route path="/admin/content" component={AdminContentManagement} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/dashboard/admin/leads" component={AdminLeads} />
        
        {/* Ecosystem - RusingAcademy */}
        <Route path="/rusingacademy" component={RusingAcademyLanding} />
        <Route path="/rusingacademy/old" component={RusingAcademyHome} />
        <Route path="/rusingacademy/programs" component={RusingAcademyPrograms} />
        <Route path="/rusingacademy/contact" component={RusingAcademyContact} />
        <Route path="/rusingacademy/for-business" component={RusingAcademyForBusiness} />
        <Route path="/rusingacademy/for-government" component={RusingAcademyForGovernment} />
        
        {/* Ecosystem - Barholex Media */}
        <Route path="/barholex-media" component={BarholexMediaLanding} />
        <Route path="/barholex" component={BarholexMediaLanding} />
        <Route path="/barholex/old" component={BarholexHome} />
        <Route path="/barholex/services" component={BarholexServices} />
        <Route path="/barholex/portfolio" component={BarholexPortfolio} />
        <Route path="/barholex/contact" component={BarholexContact} />
        
        {/* Ecosystem Hub */}
        <Route path="/ecosystem" component={EcosystemHub} />
        
        {/* CMS Dynamic Pages */}
        <Route path="/p/:slug" component={CMSPage} />

        {/* Error Pages */}
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// Handle post-login redirect from localStorage + messageCoachAfterLogin from sessionStorage
function PostLoginRedirect() {
  useEffect(() => {
    // 1. Check for general post-login redirect
    const redirect = localStorage.getItem("postLoginRedirect");
    if (redirect) {
      localStorage.removeItem("postLoginRedirect");
      setTimeout(() => {
        window.location.href = redirect;
      }, 100);
      return;
    }

    // 2. Check for "Message Coach" post-login flow
    const coachUserId = sessionStorage.getItem("messageCoachAfterLogin");
    if (coachUserId) {
      sessionStorage.removeItem("messageCoachAfterLogin");
      // Redirect to messages with autostart flag — the Messages page will
      // call startConversation and auto-select the conversation
      setTimeout(() => {
        window.location.href = `/messages?coachUserId=${coachUserId}&autostart=1`;
      }, 200);
    }
  }, []);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light" switchable={true}>
          <LanguageProvider>
            <TooltipProvider>
              <NotificationProvider>
                <GamificationProvider>
                  <Toaster />
                  <PostLoginRedirect />
                  {/* Skip link for keyboard navigation accessibility */}
                  <a href="#main-content" className="skip-link">
                    Skip to main content
                  </a>
                  <EcosystemLayout>
                    <Router />
                  </EcosystemLayout>
                  <SLEAICompanionMobileButton />
                  <NotificationPermission />
                  <OfflineIndicator />
                </GamificationProvider>
              </NotificationProvider>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;

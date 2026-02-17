import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import SLEAICompanionMobileButton from "./components/SLEAICompanionMobileButton";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { usePageTracking } from "./hooks/useAnalytics";
import NotificationPermission from "./components/NotificationPermission";
import OfflineIndicator from "./components/OfflineIndicator";
import PWAInstallBanner from "./components/PWAInstallBanner";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { SkipToContent } from "./components/SkipToContent";

// ─── Shared Loading Skeleton ───────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-white/70 text-sm">Loading...</p>
      </div>
    </div>
  );
}

/** Suspense wrapper with route-level error boundary (Sprint J5) */
function L({ children, section }: { children: React.ReactNode; section?: string }) {
  return (
    <RouteErrorBoundary section={section}>
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </RouteErrorBoundary>
  );
}

// ─── ALL Page Imports — Lazy-loaded for code splitting ─────────────────────
// Core layout components (kept static for instant shell rendering)
import DashboardRouter from "./components/DashboardRouter";
import EcosystemLayout from "./components/EcosystemLayout";

// Auth Pages
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const CoachInviteClaim = lazy(() => import("./pages/CoachInviteClaim"));
const AcceptInvitation = lazy(() => import("./pages/AcceptInvitation"));

// Public Pages
const NotFound = lazy(() => import("./pages/NotFound"));
const CMSPage = lazy(() => import("./pages/CMSPage"));
const Home = lazy(() => import("./pages/Home"));
const Hub = lazy(() => import("./pages/Hub"));
const Coaches = lazy(() => import("./pages/Coaches"));
const CoachProfile = lazy(() => import("./pages/CoachProfile"));
const AICoach = lazy(() => import("./pages/AICoach"));
const BecomeCoach = lazy(() => import("./pages/BecomeCoachNew"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const CurriculumPathSeries = lazy(() => import("./pages/CurriculumPathSeries"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Paths = lazy(() => import("./pages/Paths"));
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
const CategoryThreads = lazy(() => import("./pages/CategoryThreads"));
const ThreadDetail = lazy(() => import("./pages/ThreadDetail"));
const SLEDiagnostic = lazy(() => import("./pages/SLEDiagnostic"));

// Legal Pages
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const CoachTerms = lazy(() => import("./pages/CoachTerms"));

// Booking & Payment Pages
const BookingForm = lazy(() => import("./pages/BookingForm"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const BookingCancelled = lazy(() => import("./pages/BookingCancelled"));
const CoachingPlanSuccess = lazy(() => import("./pages/CoachingPlanSuccess"));
const CourseSuccess = lazy(() => import("./pages/CourseSuccess"));
const FreeEnrollmentSuccess = lazy(() => import("./pages/FreeEnrollmentSuccess"));
const PaymentError = lazy(() => import("./pages/PaymentError"));
const PathEnrollmentSuccess = lazy(() => import("./pages/PathEnrollmentSuccess"));

// Learner Dashboard & Portal Pages
const LearnerDashboard = lazy(() => import("./pages/LearnerDashboard"));
const LearnerCourses = lazy(() => import("./pages/LearnerCourses"));
const LearnerSettings = lazy(() => import("./pages/LearnerSettings"));
const LearnerProgress = lazy(() => import("./pages/LearnerProgress"));
const LearnerPayments = lazy(() => import("./pages/LearnerPayments"));
const LearnerFavorites = lazy(() => import("./pages/LearnerFavorites"));
const LearnerLoyalty = lazy(() => import("./pages/LearnerLoyalty"));
const LearnerReferrals = lazy(() => import("./pages/LearnerReferrals"));
const BadgesCatalog = lazy(() => import("./pages/BadgesCatalog"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const BookSession = lazy(() => import("./pages/BookSession"));
const Messages = lazy(() => import("./pages/Messages"));
const VideoSession = lazy(() => import("./pages/VideoSession"));
const MySessions = lazy(() => import("./pages/MySessions"));
const ProgressReport = lazy(() => import("./pages/ProgressReport"));
const MyLearning = lazy(() => import("./pages/MyLearning"));
const MyDownloads = lazy(() => import("./pages/MyDownloads"));
const CertificateViewer = lazy(() => import("./pages/CertificateViewer"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const LearnCourse = lazy(() => import("./pages/LearnCourse"));
const LearnPortal = lazy(() => import("./pages/LearnPortal"));
const LearnLessonPage = lazy(() => import("./pages/LearnLessonPage"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const BundlesAndPaths = lazy(() => import("./pages/BundlesAndPaths"));
const ConversationPractice = lazy(() => import("./pages/ConversationPractice"));
const Practice = lazy(() => import("./pages/Practice"));
const SLEPractice = lazy(() => import("./pages/SLEPractice"));
const SLEExamSimulation = lazy(() => import("./pages/SLEExamSimulation"));
const SLEProgressDashboard = lazy(() => import("./pages/SLEProgressDashboard"));
const DictationPractice = lazy(() => import("./pages/DictationPractice"));
const PracticeHistory = lazy(() => import("./pages/PracticeHistory"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const HomeRedirect = lazy(() => import("./pages/HomeRedirect"));

// Coach Pages
const CoachDashboard = lazy(() => import("./pages/CoachDashboard"));
const CoachEarnings = lazy(() => import("./pages/CoachEarnings"));
const CoachEarningsHistory = lazy(() => import("./pages/CoachEarningsHistory"));
const CoachPayments = lazy(() => import("./pages/CoachPayments"));
const CoachGuide = lazy(() => import("./pages/CoachGuide"));

// HR Dashboard
const HRDashboard = lazy(() => import("./pages/HRDashboard"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCommission = lazy(() => import("./pages/AdminCommission"));
const AdminCoachApplications = lazy(() => import("./pages/AdminCoachApplications"));
const AdminReminders = lazy(() => import("./pages/AdminReminders"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminContentManagement = lazy(() => import("./pages/AdminContentManagement"));
const AdminControlCenter = lazy(() => import("./pages/AdminControlCenter"));
const AppDashboard = lazy(() => import("./pages/AppDashboard"));

// Ecosystem Pages - RusingAcademy
const RusingAcademyHome = lazy(() => import("./pages/rusingacademy/RusingAcademyHome"));
const RusingAcademyPrograms = lazy(() => import("./pages/rusingacademy/Programs"));
const RusingAcademyContact = lazy(() => import("./pages/rusingacademy/Contact"));
const RusingAcademyForBusiness = lazy(() => import("./pages/rusingacademy/ForBusiness"));
const RusingAcademyForGovernment = lazy(() => import("./pages/rusingacademy/ForGovernment"));
const RusingAcademyLanding = lazy(() => import("./pages/RusingAcademyLanding"));

// Ecosystem Pages - Barholex Media
const BarholexHome = lazy(() => import("./pages/barholex/BarholexHome"));
const BarholexServices = lazy(() => import("./pages/barholex/Services"));
const BarholexPortfolio = lazy(() => import("./pages/barholex/Portfolio"));
const BarholexContact = lazy(() => import("./pages/barholex/Contact"));
const BarholexMediaLanding = lazy(() => import("./pages/BarholexMediaLanding"));

// Ecosystem Hub & Landing Pages
const EcosystemHub = lazy(() => import("./pages/EcosystemHub"));
const EcosystemLanding = lazy(() => import("./pages/EcosystemLanding"));
const LingueefyLanding = lazy(() => import("./pages/LingueefyLanding"));

// === Learner Portal Pages (Wave 2) ===
const QuizPage = lazy(() => import("./pages/QuizPage"));
const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const PathDetail = lazy(() => import("./pages/PathDetail"));
const PathList = lazy(() => import("./pages/PathList"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Achievements = lazy(() => import("./pages/Achievements"));
const AdminCoachHub = lazy(() => import("./pages/AdminCoachHub"));
const AdminContentPipeline = lazy(() => import("./pages/AdminContentPipeline"));
const AdminExecutiveSummary = lazy(() => import("./pages/AdminExecutiveSummary"));
const Authorizations = lazy(() => import("./pages/Authorizations"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const CalendarPage = lazy(() => import("./pages/Calendar"));
const CoachDashboardHome = lazy(() => import("./pages/coach/CoachDashboardHome"));
const CoachPerformance = lazy(() => import("./pages/coach/CoachPerformance"));
const CoachRevenue = lazy(() => import("./pages/coach/CoachRevenue"));
const CoachSessions = lazy(() => import("./pages/coach/CoachSessions"));
const CoachStudents = lazy(() => import("./pages/coach/CoachStudents"));
const CommunityForum = lazy(() => import("./pages/CommunityForum"));
const CulturalImmersion = lazy(() => import("./pages/CulturalImmersion"));
const DailyReview = lazy(() => import("./pages/DailyReview"));
const DictationExercises = lazy(() => import("./pages/DictationExercises"));
const DiscussionBoards = lazy(() => import("./pages/DiscussionBoards"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const GlobalSearch = lazy(() => import("./pages/GlobalSearch"));
const GrammarDrills = lazy(() => import("./pages/GrammarDrills"));
const HRBudget = lazy(() => import("./pages/hr/HRBudget"));
const HRCohorts = lazy(() => import("./pages/hr/HRCohorts"));
const HRCompliance = lazy(() => import("./pages/hr/HRCompliance"));
const HRDashboardHome = lazy(() => import("./pages/hr/HRDashboardHome"));
const HRTeam = lazy(() => import("./pages/hr/HRTeam"));
const HRReports = lazy(() => import("./pages/hr/HRReports"));
const HRCalendar = lazy(() => import("./pages/hr/HRCalendar"));
const HRNotifications = lazy(() => import("./pages/hr/HRNotifications"));
const HROrganization = lazy(() => import("./pages/hr/HROrganization"));
const HRSettings = lazy(() => import("./pages/hr/HRSettings"));
const HRHelp = lazy(() => import("./pages/hr/HRHelp"));
const Help = lazy(() => import("./pages/Help"));
const LearningMaterials = lazy(() => import("./pages/LearningMaterials"));
const ListeningLab = lazy(() => import("./pages/ListeningLab"));
const MockSLEExam = lazy(() => import("./pages/MockSLEExam"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const MySettings = lazy(() => import("./pages/MySettings"));
const Notes = lazy(() => import("./pages/Notes"));
const Notifications = lazy(() => import("./pages/Notifications"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const PeerReview = lazy(() => import("./pages/PeerReview"));
const PortalComingSoon = lazy(() => import("./pages/PortalComingSoon"));
const ProgramSelect = lazy(() => import("./pages/ProgramSelect"));
const Progress = lazy(() => import("./pages/Progress"));
const ProgressAnalytics = lazy(() => import("./pages/ProgressAnalytics"));
const PronunciationLab = lazy(() => import("./pages/PronunciationLab"));
const ReadingLab = lazy(() => import("./pages/ReadingLab"));
const Reports = lazy(() => import("./pages/Reports"));
const Results = lazy(() => import("./pages/Results"));
const StudyGroups = lazy(() => import("./pages/StudyGroups"));
const StudyPlanner = lazy(() => import("./pages/StudyPlanner"));
const TutoringSessions = lazy(() => import("./pages/TutoringSessions"));
const Vocabulary = lazy(() => import("./pages/Vocabulary"));
const WeeklyChallenges = lazy(() => import("./pages/WeeklyChallenges"));
const WritingPortfolio = lazy(() => import("./pages/WritingPortfolio"));

// === Community Pages (Wave 3) ===
const Certificates = lazy(() => import("./pages/Certificates"));
const Channels = lazy(() => import("./pages/Channels"));
const CourseBuilder = lazy(() => import("./pages/CourseBuilder"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const CoursePlayer = lazy(() => import("./pages/CoursePlayer"));
const EmailBroadcasts = lazy(() => import("./pages/EmailBroadcasts"));
const Membership = lazy(() => import("./pages/Membership"));
const Moderation = lazy(() => import("./pages/Moderation"));
const RevenueDashboard = lazy(() => import("./pages/RevenueDashboard"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const AcctAccountRegister = lazy(() => import("./pages/accounting/AccountRegister"));
const AcctAgingReport = lazy(() => import("./pages/accounting/AgingReport"));
const AcctAuditLog = lazy(() => import("./pages/accounting/AuditLog"));
const AcctAuditTrail = lazy(() => import("./pages/accounting/AuditTrail"));
const AcctBalanceSheetReport = lazy(() => import("./pages/accounting/BalanceSheetReport"));
const AcctBankRules = lazy(() => import("./pages/accounting/BankRules"));
const AcctBankTransactions = lazy(() => import("./pages/accounting/BankTransactions"));
const AcctBills = lazy(() => import("./pages/accounting/Bills"));
const AcctChartOfAccounts = lazy(() => import("./pages/accounting/ChartOfAccounts"));
const AcctCustomerDetail = lazy(() => import("./pages/accounting/CustomerDetail"));
const AcctCustomers = lazy(() => import("./pages/accounting/Customers"));
const AcctDeposits = lazy(() => import("./pages/accounting/Deposits"));
const AcctEmailTemplates = lazy(() => import("./pages/accounting/EmailTemplates"));
const AcctEstimates = lazy(() => import("./pages/accounting/Estimates"));
const AcctExchangeRates = lazy(() => import("./pages/accounting/ExchangeRates"));
const AcctExpenseDetail = lazy(() => import("./pages/accounting/ExpenseDetail"));
const AcctExpenses = lazy(() => import("./pages/accounting/Expenses"));
const AcctGeneralLedgerReport = lazy(() => import("./pages/accounting/GeneralLedgerReport"));
const AcctInvoiceDetail = lazy(() => import("./pages/accounting/InvoiceDetail"));
const AcctInvoicePdf = lazy(() => import("./pages/accounting/InvoicePdf"));
const AcctInvoices = lazy(() => import("./pages/accounting/Invoices"));
const AcctJournalEntries = lazy(() => import("./pages/accounting/JournalEntries"));
const AcctProductDetail = lazy(() => import("./pages/accounting/ProductDetail"));
const AcctProductsServices = lazy(() => import("./pages/accounting/ProductsServices"));
const AcctProfitLossReport = lazy(() => import("./pages/accounting/ProfitLossReport"));
const AcctReconciliation = lazy(() => import("./pages/accounting/Reconciliation"));
const AcctReconciliationWorkspace = lazy(() => import("./pages/accounting/ReconciliationWorkspace"));
const AcctRecurringTransactions = lazy(() => import("./pages/accounting/RecurringTransactions"));
const AcctReports = lazy(() => import("./pages/accounting/Reports"));
const AcctSalesTax = lazy(() => import("./pages/accounting/SalesTax"));
const AcctSettings = lazy(() => import("./pages/accounting/Settings"));
const AcctSupplierDetail = lazy(() => import("./pages/accounting/SupplierDetail"));
const AcctSuppliers = lazy(() => import("./pages/accounting/Suppliers"));
const AcctTrialBalanceReport = lazy(() => import("./pages/accounting/TrialBalanceReport"));
const LibraryPage = lazy(() => import("./pages/Library"));
const BookLandingPage = lazy(() => import("./pages/BookLandingPage"));

// ─── Router ────────────────────────────────────────────────────────────────
function Router() {
  // Track page views on route changes
  usePageTracking();

  return (
    <Switch>
      {/* Auth Pages */}
      <Route path="/sign-in">{() => <L><SignIn /></L>}</Route>
      <Route path="/sign-up">{() => <L><SignUp /></L>}</Route>
      <Route path="/signup">{() => <L><Signup /></L>}</Route>
      <Route path="/login">{() => <L><Login /></L>}</Route>
      <Route path="/set-password">{() => <L><SetPassword /></L>}</Route>
      <Route path="/forgot-password">{() => <L><ForgotPassword /></L>}</Route>
      <Route path="/reset-password">{() => <L><ResetPassword /></L>}</Route>
      <Route path="/verify-email">{() => <L><VerifyEmail /></L>}</Route>
      
      {/* Public Pages */}
      <Route path="/">{() => <L><Hub /></L>}</Route>
      <Route path="/ecosystem">{() => <L><Hub /></L>}</Route>
      <Route path="/ecosystem-old">{() => <L><EcosystemLanding /></L>}</Route>
      <Route path="/lingueefy">{() => <L><Home /></L>}</Route>
      <Route path="/lingueefy/success">{() => <L><CoachingPlanSuccess /></L>}</Route>
      <Route path="/home">{() => <L><HomeRedirect /></L>}</Route>
      <Route path="/coaches">{() => <L><Coaches /></L>}</Route>
      <Route path="/coaches/:slug">{() => <L><CoachProfile /></L>}</Route>
      <Route path="/coach-invite/:token">{() => <L><CoachInviteClaim /></L>}</Route>
      <Route path="/invite/:token">{() => <L><AcceptInvitation /></L>}</Route>
      <Route path="/messages">{() => <L><Messages /></L>}</Route>
      <Route path="/session/:sessionId">{() => <L><VideoSession /></L>}</Route>
      <Route path="/become-a-coach">{() => <L><BecomeCoach /></L>}</Route>
      <Route path="/how-it-works">{() => <L><HowItWorks /></L>}</Route>
      <Route path="/curriculum">{() => <L><CurriculumPathSeries /></L>}</Route>
      <Route path="/curriculum-old">{() => <L><Curriculum /></L>}</Route>
      <Route path="/courses">{() => <L><CoursesPage /></L>}</Route>
      <Route path="/courses-old">{() => <L><Courses /></L>}</Route>
      <Route path="/courses/success">{() => <L><CourseSuccess /></L>}</Route>
      <Route path="/courses/:courseId/enrolled">{() => <L><FreeEnrollmentSuccess /></L>}</Route>
      <Route path="/payment/error">{() => <L><PaymentError /></L>}</Route>
      <Route path="/payment/cancelled">{() => <L><PaymentError /></L>}</Route>
      <Route path="/courses/:slug">{() => <L><CourseDetail /></L>}</Route>
      <Route path="/courses/:slug/lessons/:lessonId">{() => <L><LessonViewer /></L>}</Route>
      <Route path="/learn/:slug">{() => <L><LearnPortal /></L>}</Route>
      <Route path="/learn/:slug/lessons/:lessonId">{() => <L><LearnLessonPage /></L>}</Route>
      <Route path="/paths">{() => <L><Paths /></L>}</Route>
      <Route path="/paths/:slug">{() => <L><PathDetail /></L>}</Route>
      <Route path="/paths/:slug/success">{() => <L><PathEnrollmentSuccess /></L>}</Route>
      <Route path="/pricing">{() => <L><Pricing /></L>}</Route>
      <Route path="/about">{() => <L><About /></L>}</Route>
      <Route path="/contact">{() => <L><Contact /></L>}</Route>
      
      {/* Unsubscribe */}
      <Route path="/unsubscribe/:token">{() => <L><Unsubscribe /></L>}</Route>
      
      {/* Legal Pages */}
      <Route path="/terms">{() => <L><Terms /></L>}</Route>
      <Route path="/privacy">{() => <L><Privacy /></L>}</Route>
      <Route path="/privacy-policy">{() => <L><PrivacyPolicy /></L>}</Route>
      <Route path="/cookies">{() => <L><Cookies /></L>}</Route>
      <Route path="/accessibility">{() => <L><Accessibility /></L>}</Route>
      
      {/* Resource Pages */}
      <Route path="/faq">{() => <L><FAQ /></L>}</Route>
      <Route path="/blog">{() => <L><Blog /></L>}</Route>
      <Route path="/careers">{() => <L><Careers /></L>}</Route>
      <Route path="/for-departments">{() => <L><ForDepartments /></L>}</Route>
      <Route path="/for-business">{() => <L><ForBusiness /></L>}</Route>
      <Route path="/organizations">{() => <L><Organizations /></L>}</Route>
      <Route path="/community">{() => <L><Community /></L>}</Route>
      <Route path="/community/category/:id">{() => <L><CategoryThreads /></L>}</Route>
      <Route path="/community/thread/:id">{() => <L><ThreadDetail /></L>}</Route>
      
      {/* SLE Diagnostic Page */}
      <Route path="/sle-diagnostic">{() => <L><SLEDiagnostic /></L>}</Route>
      
      {/* AI Coach - Prof Steven */}
      <Route path="/prof-steven-ai">{() => <L><AICoach /></L>}</Route>
      <Route path="/ai-coach">{() => <L><AICoach /></L>}</Route>
      <Route path="/sle-ai-companion">{() => <L><AICoach /></L>}</Route>
      
      {/* Booking Pages */}
      <Route path="/booking">{() => <L><BookingForm /></L>}</Route>
      <Route path="/booking/confirmation">{() => <L><BookingConfirmation /></L>}</Route>
      <Route path="/booking/success">{() => <L><BookingSuccess /></L>}</Route>
      <Route path="/booking/cancelled">{() => <L><BookingCancelled /></L>}</Route>
      
      {/* Dashboard Router - RBAC-based routing */}
      <Route path="/dashboard" component={DashboardRouter} />

      {/* ── Unified Dashboard (/app) ── role-based sidebar, modular sections */}
      <Route path="/app">{() => <L><AppDashboard section="overview" /></L>}</Route>
      <Route path="/app/overview">{() => <L><AppDashboard section="overview" /></L>}</Route>
      <Route path="/app/my-courses">{() => <L><AppDashboard section="my-courses" /></L>}</Route>
      <Route path="/app/my-progress">{() => <L><AppDashboard section="my-progress" /></L>}</Route>
      <Route path="/app/my-sessions">{() => <L><AppDashboard section="my-sessions" /></L>}</Route>
      <Route path="/app/my-payments">{() => <L><AppDashboard section="my-payments" /></L>}</Route>
      <Route path="/app/favorites">{() => <L><AppDashboard section="favorites" /></L>}</Route>
      <Route path="/app/certificates">{() => <L><AppDashboard section="certificates" /></L>}</Route>
      <Route path="/app/settings">{() => <L><AppDashboard section="settings" /></L>}</Route>
      <Route path="/app/notifications">{() => <L><AppDashboard section="notifications" /></L>}</Route>
      <Route path="/app/ai-practice">{() => <L><AppDashboard section="ai-practice" /></L>}</Route>
      <Route path="/app/conversation">{() => <L><AppDashboard section="conversation" /></L>}</Route>
      <Route path="/app/practice-history">{() => <L><AppDashboard section="practice-history" /></L>}</Route>
      <Route path="/app/simulation">{() => <L><AppDashboard section="simulation" /></L>}</Route>
      <Route path="/app/sle-exam">{() => <L><AppDashboard section="sle-exam" /></L>}</Route>
      <Route path="/app/sle-progress">{() => <L><AppDashboard section="sle-progress" /></L>}</Route>
      <Route path="/app/badges">{() => <L><AppDashboard section="badges" /></L>}</Route>
      <Route path="/app/loyalty">{() => <L><AppDashboard section="loyalty" /></L>}</Route>
      <Route path="/app/my-students">{() => <L><AppDashboard section="my-students" /></L>}</Route>
      <Route path="/app/availability">{() => <L><AppDashboard section="availability" /></L>}</Route>
      <Route path="/app/coach-profile">{() => <L><AppDashboard section="coach-profile" /></L>}</Route>
      <Route path="/app/earnings">{() => <L><AppDashboard section="earnings" /></L>}</Route>
      <Route path="/app/video-sessions">{() => <L><AppDashboard section="video-sessions" /></L>}</Route>
      <Route path="/app/coach-guide">{() => <L><AppDashboard section="coach-guide" /></L>}</Route>
      <Route path="/app/team">{() => <L><AppDashboard section="team" /></L>}</Route>
      <Route path="/app/cohorts">{() => <L><AppDashboard section="cohorts" /></L>}</Route>
      <Route path="/app/budget">{() => <L><AppDashboard section="budget" /></L>}</Route>
      <Route path="/app/compliance">{() => <L><AppDashboard section="compliance" /></L>}</Route>
      
      {/* Learner Dashboard */}
      <Route path="/dashboard/learner">{() => <L><LearnerDashboard /></L>}</Route>
      <Route path="/learner">{() => <L><LearnerDashboard /></L>}</Route>
      <Route path="/learner/courses">{() => <L><LearnerCourses /></L>}</Route>
      <Route path="/learner/book-session">{() => <L><BookSession /></L>}</Route>
      <Route path="/my-learning">{() => <L><MyLearning /></L>}</Route>
      <Route path="/certificates/:certificateNumber">{() => <L><CertificateViewer /></L>}</Route>
      <Route path="/verify">{() => <L><VerifyCertificate /></L>}</Route>
      <Route path="/verify/:certificateNumber">{() => <L><VerifyCertificate /></L>}</Route>

      <Route path="/my-sessions">{() => <L><MySessions /></L>}</Route>
      <Route path="/settings">{() => <L><LearnerSettings /></L>}</Route>
      <Route path="/progress">{() => <L><LearnerProgress /></L>}</Route>
      <Route path="/progress/report">{() => <L><ProgressReport /></L>}</Route>
      <Route path="/payments">{() => <L><LearnerPayments /></L>}</Route>
      <Route path="/favorites">{() => <L><LearnerFavorites /></L>}</Route>
      <Route path="/rewards">{() => <L><LearnerLoyalty /></L>}</Route>
      <Route path="/badges">{() => <L><BadgesCatalog /></L>}</Route>
      <Route path="/leaderboard">{() => <L><Leaderboard /></L>}</Route>
      <Route path="/profile/:userId">{() => <L><UserProfile /></L>}</Route>
      <Route path="/referrals">{() => <L><LearnerReferrals /></L>}</Route>
      <Route path="/affiliate">{() => <L><AffiliateDashboard /></L>}</Route>
      <Route path="/bundles">{() => <L><BundlesAndPaths /></L>}</Route>
      <Route path="/conversation-practice">{() => <L><ConversationPractice /></L>}</Route>
      <Route path="/practice">{() => <L><Practice /></L>}</Route>
      <Route path="/sle-practice">{() => <L><SLEPractice /></L>}</Route>
      <Route path="/sle-exam-simulation">{() => <L><SLEExamSimulation /></L>}</Route>
      <Route path="/sle-progress">{() => <L><SLEProgressDashboard /></L>}</Route>
      <Route path="/dictation-practice">{() => <L><DictationPractice /></L>}</Route>
      <Route path="/practice-history">{() => <L><PracticeHistory /></L>}</Route>
      <Route path="/practice-history/:sessionId">{() => <L><PracticeHistory /></L>}</Route>
      <Route path="/downloads">{() => <L><MyDownloads /></L>}</Route>
      
      {/* Coach Dashboard */}
      <Route path="/dashboard/coach">{() => <L><CoachDashboard /></L>}</Route>
      <Route path="/coach">{() => <L><CoachDashboard /></L>}</Route>
      <Route path="/coach/dashboard">{() => <L><CoachDashboard /></L>}</Route>
      <Route path="/coach/earnings">{() => <L><CoachEarnings /></L>}</Route>
      <Route path="/coach/earnings/history">{() => <L><CoachEarningsHistory /></L>}</Route>
      <Route path="/coach/payments">{() => <L><CoachPayments /></L>}</Route>
      <Route path="/coach/guide">{() => <L><CoachGuide /></L>}</Route>
      <Route path="/coach/terms">{() => <L><CoachTerms /></L>}</Route>
      <Route path="/coach/:slug">{() => <L><CoachProfile /></L>}</Route>
      
      {/* HR Dashboard */}
      <Route path="/dashboard/hr">{() => <L><HRDashboard /></L>}</Route>
      <Route path="/dashboard/hr/overview">{() => <L><HRDashboard /></L>}</Route>
      <Route path="/hr">{() => <L><HRDashboard /></L>}</Route>
      <Route path="/hr/dashboard">{() => <L><HRDashboard /></L>}</Route>
      
      {/* Admin Control Center - Kajabi-style sidebar layout */}
      <Route path="/admin">{() => <L><AdminControlCenter section="overview" /></L>}</Route>
      <Route path="/admin/overview">{() => <L><AdminControlCenter section="overview" /></L>}</Route>
      <Route path="/admin/users">{() => <L><AdminControlCenter section="users" /></L>}</Route>
      <Route path="/admin/coaches">{() => <L><AdminControlCenter section="coaches" /></L>}</Route>
      <Route path="/admin/coaching">{() => <L><AdminControlCenter section="coaches" /></L>}</Route>
      <Route path="/admin/courses">{() => <L><AdminControlCenter section="courses" /></L>}</Route>
      <Route path="/admin/products">{() => <L><AdminControlCenter section="all-products" /></L>}</Route>
      <Route path="/admin/pricing">{() => <L><AdminControlCenter section="pricing" /></L>}</Route>
      <Route path="/admin/coupons">{() => <L><AdminControlCenter section="coupons" /></L>}</Route>
      <Route path="/admin/crm">{() => <L><AdminControlCenter section="crm" /></L>}</Route>
      <Route path="/admin/email">{() => <L><AdminControlCenter section="email" /></L>}</Route>
      <Route path="/admin/analytics">{() => <L><AdminControlCenter section="analytics" /></L>}</Route>
      <Route path="/admin/activity">{() => <L><AdminControlCenter section="activity" /></L>}</Route>
      <Route path="/admin/preview">{() => <L><AdminControlCenter section="preview" /></L>}</Route>
      <Route path="/admin/settings">{() => <L><AdminControlCenter section="settings" /></L>}</Route>
      <Route path="/admin/funnels">{() => <L><AdminControlCenter section="funnels" /></L>}</Route>
      <Route path="/admin/automations">{() => <L><AdminControlCenter section="automations" /></L>}</Route>
      <Route path="/admin/pages">{() => <L><AdminControlCenter section="pages" /></L>}</Route>
      <Route path="/admin/ai-companion">{() => <L><AdminControlCenter section="ai-companion" /></L>}</Route>
      <Route path="/admin/sales-analytics">{() => <L><AdminControlCenter section="sales-analytics" /></L>}</Route>
      <Route path="/admin/media-library">{() => <L><AdminControlCenter section="media-library" /></L>}</Route>
      <Route path="/admin/permissions">{() => <L><AdminControlCenter section="permissions" /></L>}</Route>
      <Route path="/admin/email-templates">{() => <L><AdminControlCenter section="email-templates" /></L>}</Route>
      <Route path="/admin/notifications">{() => <L><AdminControlCenter section="notifications" /></L>}</Route>
      <Route path="/admin/import-export">{() => <L><AdminControlCenter section="import-export" /></L>}</Route>
      <Route path="/admin/preview-mode">{() => <L><AdminControlCenter section="preview-mode" /></L>}</Route>
      <Route path="/admin/ai-predictive">{() => <L><AdminControlCenter section="ai-predictive" /></L>}</Route>
      <Route path="/admin/stripe-testing">{() => <L><AdminControlCenter section="stripe-testing" /></L>}</Route>
      <Route path="/admin/live-kpi">{() => <L><AdminControlCenter section="live-kpi" /></L>}</Route>
      <Route path="/admin/onboarding">{() => <L><AdminControlCenter section="onboarding" /></L>}</Route>
      <Route path="/admin/enterprise">{() => <L><AdminControlCenter section="enterprise" /></L>}</Route>
      <Route path="/admin/sle-exam">{() => <L><AdminControlCenter section="sle-exam" /></L>}</Route>
      <Route path="/admin/content-intelligence">{() => <L><AdminControlCenter section="content-intelligence" /></L>}</Route>
      <Route path="/admin/drip-content">{() => <L><AdminControlCenter section="drip-content" /></L>}</Route>
      <Route path="/admin/ab-testing">{() => <L><AdminControlCenter section="ab-testing" /></L>}</Route>
      <Route path="/admin/org-billing">{() => <L><AdminControlCenter section="org-billing" /></L>}</Route>
      <Route path="/admin/weekly-challenges">{() => <L><AdminControlCenter section="weekly-challenges" /></L>}</Route>
      <Route path="/admin/enrollments">{() => <L><AdminControlCenter section="enrollments" /></L>}</Route>
      <Route path="/admin/reviews">{() => <L><AdminControlCenter section="reviews" /></L>}</Route>
      <Route path="/admin/certificates">{() => <L><AdminControlCenter section="certificates" /></L>}</Route>
      <Route path="/admin/gamification">{() => <L><AdminControlCenter section="gamification" /></L>}</Route>

      {/* ═══ Kajabi Integration — New Admin Routes ═══ */}
      {/* Products */}
      <Route path="/admin/all-products">{() => <L><AdminControlCenter section="all-products" /></L>}</Route>
      <Route path="/admin/podcasts">{() => <L><AdminControlCenter section="podcasts" /></L>}</Route>
      <Route path="/admin/newsletters">{() => <L><AdminControlCenter section="newsletters" /></L>}</Route>
      <Route path="/admin/downloads">{() => <L><AdminControlCenter section="downloads" /></L>}</Route>
      <Route path="/admin/community">{() => <L><AdminControlCenter section="community" /></L>}</Route>
      {/* Sales */}
      <Route path="/admin/payments">{() => <L><AdminControlCenter section="payments" /></L>}</Route>
      <Route path="/admin/offers">{() => <L><AdminControlCenter section="offers" /></L>}</Route>
      <Route path="/admin/cart">{() => <L><AdminControlCenter section="cart" /></L>}</Route>
      <Route path="/admin/invoices">{() => <L><AdminControlCenter section="invoices" /></L>}</Route>
      <Route path="/admin/affiliates">{() => <L><AdminControlCenter section="affiliates" /></L>}</Route>
      {/* Website */}
      <Route path="/admin/design">{() => <L><AdminControlCenter section="design" /></L>}</Route>
      <Route path="/admin/navigation">{() => <L><AdminControlCenter section="navigation" /></L>}</Route>
      <Route path="/admin/blog">{() => <L><AdminControlCenter section="blog" /></L>}</Route>
      {/* Marketing */}
      <Route path="/admin/marketing">{() => <L><AdminControlCenter section="marketing" /></L>}</Route>
      <Route path="/admin/inbox">{() => <L><AdminControlCenter section="inbox" /></L>}</Route>
      <Route path="/admin/forms">{() => <L><AdminControlCenter section="forms" /></L>}</Route>
      <Route path="/admin/events">{() => <L><AdminControlCenter section="events" /></L>}</Route>
      {/* Contacts */}
      <Route path="/admin/contacts">{() => <L><AdminControlCenter section="contacts" /></L>}</Route>
      <Route path="/admin/contact-insights">{() => <L><AdminControlCenter section="contact-insights" /></L>}</Route>
      <Route path="/admin/assessments">{() => <L><AdminControlCenter section="assessments" /></L>}</Route>
      {/* Analytics */}
      <Route path="/admin/reports">{() => <L><AdminControlCenter section="reports" /></L>}</Route>

      {/* Legacy admin routes */}
      <Route path="/dashboard/admin">{() => <L><AdminControlCenter section="overview" /></L>}</Route>
      <Route path="/admin/applications">{() => <L><AdminCoachApplications /></L>}</Route>
      <Route path="/admin/dashboard">{() => <L><AdminControlCenter section="overview" /></L>}</Route>
      <Route path="/admin/commission">{() => <L><AdminCommission /></L>}</Route>
      <Route path="/admin/reminders">{() => <L><AdminReminders /></L>}</Route>
      <Route path="/admin/content">{() => <L><AdminContentManagement /></L>}</Route>
      <Route path="/admin/leads">{() => <L><AdminLeads /></L>}</Route>
      <Route path="/dashboard/admin/leads">{() => <L><AdminLeads /></L>}</Route>
      
      {/* Ecosystem - RusingAcademy */}
      <Route path="/rusingacademy">{() => <L><RusingAcademyLanding /></L>}</Route>
      <Route path="/rusingacademy/old">{() => <L><RusingAcademyHome /></L>}</Route>
      <Route path="/rusingacademy/programs">{() => <L><RusingAcademyPrograms /></L>}</Route>
      <Route path="/rusingacademy/contact">{() => <L><RusingAcademyContact /></L>}</Route>
      <Route path="/rusingacademy/for-business">{() => <L><RusingAcademyForBusiness /></L>}</Route>
      <Route path="/rusingacademy/for-government">{() => <L><RusingAcademyForGovernment /></L>}</Route>
      
      {/* Ecosystem - Barholex Media */}
      <Route path="/barholex-media">{() => <L><BarholexMediaLanding /></L>}</Route>
      <Route path="/barholex">{() => <L><BarholexMediaLanding /></L>}</Route>
      <Route path="/barholex/old">{() => <L><BarholexHome /></L>}</Route>
      <Route path="/barholex/services">{() => <L><BarholexServices /></L>}</Route>
      <Route path="/barholex/portfolio">{() => <L><BarholexPortfolio /></L>}</Route>
      <Route path="/barholex/contact">{() => <L><BarholexContact /></L>}</Route>
      
      {/* Ecosystem Hub */}
      <Route path="/ecosystem">{() => <L><EcosystemHub /></L>}</Route>
      
      {/* CMS Dynamic Pages */}
      <Route path="/p/:slug">{() => <L><CMSPage /></L>}</Route>

      {/* === Community Routes (Wave 3) === */}
      <Route path="/channels">{() => <L><Channels /></L>}</Route>
      <Route path="/certificates">{() => <L><Certificates /></L>}</Route>
      <Route path="/email-broadcasts">{() => <L><EmailBroadcasts /></L>}</Route>
      <Route path="/revenue">{() => <L><RevenueDashboard /></L>}</Route>
      <Route path="/membership">{() => <L><Membership /></L>}</Route>
      <Route path="/moderation">{() => <L><Moderation /></L>}</Route>
      <Route path="/courses/:id">{() => <L><CoursePlayer /></L>}</Route>
      <Route path="/admin/courses/new">{() => <L><CourseBuilder /></L>}</Route>
      <Route path="/admin/courses/:id/edit">{() => <L><CourseBuilder /></L>}</Route>
      {/* === Learner Portal Routes (Wave 2) === */}
      <Route path="/achievements">{() => <L><Achievements /></L>}</Route>
      <Route path="/ai-assistant">{() => <L><AIAssistant /></L>}</Route>
      <Route path="/authorizations">{() => <L><Authorizations /></L>}</Route>
      <Route path="/bookmarks">{() => <L><Bookmarks /></L>}</Route>
      <Route path="/calendar">{() => <L><CalendarPage /></L>}</Route>
      <Route path="/community-forum">{() => <L><CommunityForum /></L>}</Route>
      <Route path="/cultural-immersion">{() => <L><CulturalImmersion /></L>}</Route>
      <Route path="/daily-review">{() => <L><DailyReview /></L>}</Route>
      <Route path="/dictation">{() => <L><DictationExercises /></L>}</Route>
      <Route path="/discussions">{() => <L><DiscussionBoards /></L>}</Route>
      <Route path="/flashcards">{() => <L><Flashcards /></L>}</Route>
      <Route path="/grammar-drills">{() => <L><GrammarDrills /></L>}</Route>
      <Route path="/help">{() => <L><Help /></L>}</Route>
      <Route path="/learning-materials">{() => <L><LearningMaterials /></L>}</Route>
      <Route path="/listening-lab">{() => <L><ListeningLab /></L>}</Route>
      <Route path="/mock-sle">{() => <L><MockSLEExam /></L>}</Route>
      <Route path="/notes">{() => <L><Notes /></L>}</Route>
      <Route path="/notifications">{() => <L><Notifications /></L>}</Route>
      <Route path="/onboarding">{() => <L><OnboardingWizard /></L>}</Route>
      <Route path="/peer-review">{() => <L><PeerReview /></L>}</Route>
      <Route path="/profile">{() => <L><MyProfile /></L>}</Route>
      <Route path="/programs">{() => <L><ProgramSelect /></L>}</Route>
      <Route path="/pronunciation-lab">{() => <L><PronunciationLab /></L>}</Route>
      <Route path="/reading-lab">{() => <L><ReadingLab /></L>}</Route>
      <Route path="/reports">{() => <L><Reports /></L>}</Route>
      <Route path="/results">{() => <L><Results /></L>}</Route>
      <Route path="/search">{() => <L><GlobalSearch /></L>}</Route>
      <Route path="/study-groups">{() => <L><StudyGroups /></L>}</Route>
      <Route path="/study-planner">{() => <L><StudyPlanner /></L>}</Route>
      <Route path="/tutoring-sessions">{() => <L><TutoringSessions /></L>}</Route>
      <Route path="/vocabulary">{() => <L><Vocabulary /></L>}</Route>
      <Route path="/writing-portfolio">{() => <L><WritingPortfolio /></L>}</Route>
      <Route path="/analytics">{() => <L><ProgressAnalytics /></L>}</Route>
      <Route path="/challenges">{() => <L><WeeklyChallenges /></L>}</Route>
      <Route path="/coach/portal">{() => <L><CoachDashboardHome /></L>}</Route>
      <Route path="/coach/students">{() => <L><CoachStudents /></L>}</Route>
      <Route path="/coach/sessions">{() => <L><CoachSessions /></L>}</Route>
      <Route path="/coach/revenue">{() => <L><CoachRevenue /></L>}</Route>
      <Route path="/coach/performance">{() => <L><CoachPerformance /></L>}</Route>
      <Route path="/hr/portal">{() => <L><HRDashboardHome /></L>}</Route>
      <Route path="/hr/portal/dashboard">{() => <L><HRDashboardHome /></L>}</Route>
      <Route path="/hr/portal/team">{() => <L><HRTeam /></L>}</Route>
      <Route path="/hr/portal/cohorts">{() => <L><HRCohorts /></L>}</Route>
      <Route path="/hr/portal/budget">{() => <L><HRBudget /></L>}</Route>
      <Route path="/hr/portal/compliance">{() => <L><HRCompliance /></L>}</Route>
      <Route path="/hr/portal/reports">{() => <L><HRReports /></L>}</Route>
      <Route path="/hr/portal/calendar">{() => <L><HRCalendar /></L>}</Route>
      <Route path="/hr/portal/notifications">{() => <L><HRNotifications /></L>}</Route>
      <Route path="/hr/portal/organization">{() => <L><HROrganization /></L>}</Route>
      <Route path="/hr/portal/settings">{() => <L><HRSettings /></L>}</Route>
      <Route path="/hr/portal/help">{() => <L><HRHelp /></L>}</Route>
      <Route path="/hr/team">{() => <L><HRTeam /></L>}</Route>
      <Route path="/hr/cohorts">{() => <L><HRCohorts /></L>}</Route>
      <Route path="/admin/content-pipeline">{() => <L><AdminControlCenter section="content-pipeline" /></L>}</Route>
      <Route path="/admin/quiz-management">{() => <L><AdminControlCenter section="quiz-management" /></L>}</Route>
      <Route path="/admin/gov-reporting">{() => <L><AdminControlCenter section="gov-reporting" /></L>}</Route>
      <Route path="/admin/webhook-health">{() => <L><AdminControlCenter section="webhook-health" /></L>}</Route>
      <Route path="/admin/learning-paths">{() => <L><AdminControlCenter section="learning-paths" /></L>}</Route>
      <Route path="/admin/content-workflow">{() => <L><AdminControlCenter section="content-workflow" /></L>}</Route>
      <Route path="/programs/:programId">{() => <L><PathList /></L>}</Route>
      <Route path="/programs/:programId/:pathId">{() => <L><PathDetail /></L>}</Route>
      <Route path="/programs/:programId/:pathId/quiz/:quizId">{() => <L><QuizPage /></L>}</Route>
      <Route path="/programs/:programId/:pathId/:lessonId">{() => <L><LessonViewer /></L>}</Route>
      <Route path="/accounting">{() => <L><AcctInvoices /></L>}</Route>
      <Route path="/accounting/accounts/:id/register">{() => <L><AcctAccountRegister /></L>}</Route>
      <Route path="/accounting/reports/aging">{() => <L><AcctAgingReport /></L>}</Route>
      <Route path="/accounting/audit-log">{() => <L><AcctAuditLog /></L>}</Route>
      <Route path="/accounting/audit-trail">{() => <L><AcctAuditTrail /></L>}</Route>
      <Route path="/accounting/reports/balance-sheet">{() => <L><AcctBalanceSheetReport /></L>}</Route>
      <Route path="/accounting/bank-rules">{() => <L><AcctBankRules /></L>}</Route>
      <Route path="/accounting/bank-transactions">{() => <L><AcctBankTransactions /></L>}</Route>
      <Route path="/accounting/bills">{() => <L><AcctBills /></L>}</Route>
      <Route path="/accounting/chart-of-accounts">{() => <L><AcctChartOfAccounts /></L>}</Route>
      <Route path="/accounting/customers/:id">{() => <L><AcctCustomerDetail /></L>}</Route>
      <Route path="/accounting/customers">{() => <L><AcctCustomers /></L>}</Route>
      <Route path="/accounting/deposits">{() => <L><AcctDeposits /></L>}</Route>
      <Route path="/accounting/email-templates">{() => <L><AcctEmailTemplates /></L>}</Route>
      <Route path="/accounting/estimates">{() => <L><AcctEstimates /></L>}</Route>
      <Route path="/accounting/exchange-rates">{() => <L><AcctExchangeRates /></L>}</Route>
      <Route path="/accounting/expenses/:id">{() => <L><AcctExpenseDetail /></L>}</Route>
      <Route path="/accounting/expenses">{() => <L><AcctExpenses /></L>}</Route>
      <Route path="/accounting/reports/general-ledger">{() => <L><AcctGeneralLedgerReport /></L>}</Route>
      <Route path="/accounting/invoices/:id">{() => <L><AcctInvoiceDetail /></L>}</Route>
      <Route path="/accounting/invoices/:id/pdf">{() => <L><AcctInvoicePdf /></L>}</Route>
      <Route path="/accounting/invoices">{() => <L><AcctInvoices /></L>}</Route>
      <Route path="/accounting/journal-entries">{() => <L><AcctJournalEntries /></L>}</Route>
      <Route path="/accounting/products/:id">{() => <L><AcctProductDetail /></L>}</Route>
      <Route path="/accounting/products-services">{() => <L><AcctProductsServices /></L>}</Route>
      <Route path="/accounting/reports/profit-and-loss">{() => <L><AcctProfitLossReport /></L>}</Route>
      <Route path="/accounting/reconciliation">{() => <L><AcctReconciliation /></L>}</Route>
      <Route path="/accounting/reconciliation/workspace">{() => <L><AcctReconciliationWorkspace /></L>}</Route>
      <Route path="/accounting/recurring">{() => <L><AcctRecurringTransactions /></L>}</Route>
      <Route path="/accounting/reports">{() => <L><AcctReports /></L>}</Route>
      <Route path="/accounting/sales-tax">{() => <L><AcctSalesTax /></L>}</Route>
      <Route path="/accounting/settings">{() => <L><AcctSettings /></L>}</Route>
      <Route path="/accounting/suppliers/:id">{() => <L><AcctSupplierDetail /></L>}</Route>
      <Route path="/accounting/suppliers">{() => <L><AcctSuppliers /></L>}</Route>
      <Route path="/accounting/reports/trial-balance">{() => <L><AcctTrialBalanceReport /></L>}</Route>
      <Route path="/library">{() => <L><LibraryPage /></L>}</Route>
      <Route path="/library/books/:slug">{() => <L><BookLandingPage /></L>}</Route>
      <Route path="/404">{() => <L><NotFound /></L>}</Route>
      {/* Final fallback route */}
      <Route>{() => <L><NotFound /></L>}</Route>
    </Switch>
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

// Wave 7: Canonical URL Hook for SEO
function useCanonicalUrl() {
  const [location] = useLocation();
  const baseUrl = 'https://www.rusingacademy.com';

  useEffect(() => {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Create new canonical link
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${baseUrl}${location}`;
    document.head.appendChild(canonical);

    return () => {
      const link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.remove();
      }
    };
  }, [location]);
}

function App() {
  useCanonicalUrl(); // Wave 7: Dynamic canonical URLs

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
                  <SkipToContent />
                  <PWAInstallBanner />
                  <ScrollToTopButton />
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

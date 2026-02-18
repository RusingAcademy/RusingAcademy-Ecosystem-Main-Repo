/**
 * QA Utilities — Month 6 Polish, Scale & Launch
 * Barrel export for all QA components and hooks
 */
export {
  VisualRegressionDashboard,
  useVisualRegression,
  comparePixels,
  DEFAULT_VIEWPORT_CONFIGS,
  type ScreenshotConfig,
  type ComparisonResult,
  type VisualTestSuite,
} from "./VisualRegressionTesting";

export {
  ResponsiveBreakpointTester,
  useBreakpointTester,
  STANDARD_BREAKPOINTS,
  type Breakpoint,
  type BreakpointTestResult,
} from "./ResponsiveBreakpointTester";

export {
  PerformanceTestingDashboard,
  usePerformanceMetrics,
  useRenderProfiler,
  useLoadTest,
  type PerformanceMetric,
  type LoadTestConfig,
  type LoadTestResult,
  type RenderProfile,
} from "./PerformanceTesting";

export {
  BugTrackingForm,
  detectEnvironment,
  type BugReport,
  type BugSeverity,
  type BugStatus,
  type BugCategory,
} from "./BugTrackingTemplate";

export {
  QAChecklist,
  DEFAULT_QA_CHECKLIST,
  type ChecklistItem,
  type ChecklistCategory,
} from "./QAChecklist";

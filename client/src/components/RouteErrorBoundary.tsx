/**
 * Route-level Error Boundary
 * 
 * Sprint J5: Wraps route groups to isolate errors per section.
 * If a route crashes, only that section shows the error UI — the rest
 * of the app (nav, sidebar, other routes) stays functional.
 */
import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home, ArrowLeft } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Human-readable section name for the error message */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[RouteErrorBoundary:${this.props.section || "unknown"}] Caught error:`,
      error.message,
      errorInfo.componentStack,
    );
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes("Loading chunk") ||
        this.state.error?.message?.includes("dynamically imported module") ||
        this.state.error?.message?.includes("Failed to fetch");

      return (
        <div className="flex items-center justify-center min-h-[50vh] p-8">
          <div className="flex flex-col items-center w-full max-w-md text-center">
            <div className="p-3 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle size={24} className="text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {isChunkError ? "Update Available" : "Section Error"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isChunkError
                ? "A new version is available. Please reload."
                : `An error occurred in the ${this.props.section || "current"} section. The rest of the app is unaffected.`}
            </p>
            {this.state.error && !isChunkError && (
              <details className="w-full mb-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer">
                  Details
                </summary>
                <pre className="mt-1 p-2 rounded bg-muted text-xs overflow-auto max-h-24">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex items-center gap-2">
              {this.state.retryCount < 3 && (
                <button
                  onClick={isChunkError ? () => window.location.reload() : this.handleRetry}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  {isChunkError ? "Reload" : "Retry"}
                </button>
              )}
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent cursor-pointer"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent cursor-pointer"
              >
                <Home size={14} />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;

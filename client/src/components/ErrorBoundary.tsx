import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home, ArrowLeft } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary] Caught error:", error.message);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError =
        this.state.error?.message?.includes("Loading chunk") ||
        this.state.error?.message?.includes("dynamically imported module") ||
        this.state.error?.message?.includes("Failed to fetch");

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-lg text-center">
            <div className="p-4 rounded-full bg-destructive/10 mb-6">
              <AlertTriangle size={32} className="text-destructive" />
            </div>

            <h2 className="text-xl font-semibold mb-2">
              {isChunkError
                ? "A new version is available"
                : "Something went wrong"}
            </h2>

            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              {isChunkError
                ? "The application has been updated. Please reload the page to get the latest version."
                : "An unexpected error occurred. You can try again, go back, or return to the home page."}
            </p>

            {!isChunkError && this.state.error && (
              <details className="w-full mb-6 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Technical details
                </summary>
                <div className="mt-2 p-3 rounded-lg bg-muted overflow-auto max-h-40">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                    {this.state.error.message}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex items-center gap-3">
              {this.state.retryCount < 3 && (
                <button
                  onClick={isChunkError ? () => window.location.reload() : this.handleRetry}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                    "bg-primary text-primary-foreground",
                    "hover:opacity-90 cursor-pointer transition-opacity"
                  )}
                >
                  <RotateCcw size={16} />
                  {isChunkError ? "Reload Page" : "Try Again"}
                </button>
              )}

              {!isChunkError && (
                <>
                  <button aria-label="Action"
                    onClick={this.handleGoBack}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                      "border border-border bg-background text-foreground",
                      "hover:bg-accent cursor-pointer transition-colors"
                    )}
                  >
                    <ArrowLeft size={16} />
                    Go Back
                  </button>

                  <button aria-label="Action"
                    onClick={this.handleGoHome}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                      "border border-border bg-background text-foreground",
                      "hover:bg-accent cursor-pointer transition-colors"
                    )}
                  >
                    <Home size={16} />
                    Home
                  </button>
                </>
              )}
            </div>

            {this.state.retryCount >= 3 && (
              <p className="text-xs text-muted-foreground mt-4">
                If the problem persists, please try clearing your browser cache or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

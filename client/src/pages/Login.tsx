import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Check if OAuth is enabled (Manus OAuth or other OAuth provider)
const OAUTH_ENABLED = import.meta.env.VITE_OAUTH_ENABLED === "true";

// Debug mode - always show auth debug panel for troubleshooting
// Debug panel disabled in production - set to true only for local debugging
const DEBUG_AUTH = import.meta.env.DEV || false;

interface DebugInfo {
  stage: string;
  apiResponse: unknown;
  apiError: unknown;
  hasSessionToken: boolean;
  sessionTokenValue: string | null;
  timestamp: string;
  mutationState: string;
}

export default function Login() {
  const searchString = useSearch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    stage: "initial",
    apiResponse: null,
    apiError: null,
    hasSessionToken: !!localStorage.getItem("sessionToken"),
    sessionTokenValue: null,
    timestamp: new Date().toISOString(),
    mutationState: "idle",
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(searchString);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Check for existing session on mount - use window.location for hard redirect
  useEffect(() => {
    const existingToken = localStorage.getItem("sessionToken");
    if (existingToken) {
      console.log("[Login] Existing session token found, redirecting to dashboard");
      setDebugInfo(prev => ({ ...prev, stage: "existing_session_redirect", hasSessionToken: true }));
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  const loginMutation = trpc.customAuth.login.useMutation({
    onMutate: () => {
      console.log("[Login] onMutate - mutation starting");
      setDebugInfo(prev => ({ 
        ...prev, 
        stage: "mutation_started",
        mutationState: "pending",
        timestamp: new Date().toISOString(),
      }));
    },
    onSuccess: (data) => {
      console.log("[Login] onSuccess called with data:", data);
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        stage: "success",
        apiResponse: data,
        apiError: null,
        hasSessionToken: !!data.sessionToken,
        sessionTokenValue: data.sessionToken ? `${data.sessionToken.substring(0, 20)}...` : null,
        timestamp: new Date().toISOString(),
        mutationState: "success",
      }));
      
      // Store session token
      if (data.sessionToken) {
        localStorage.setItem("sessionToken", data.sessionToken);
        console.log("[Login] Session token stored in localStorage");
        setLoginSuccess(true);
        setError(null);
        
        // Use window.location.href for hard redirect to ensure full page load
        setTimeout(() => {
          console.log("[Login] Hard redirecting to:", redirectTo);
          window.location.href = redirectTo;
        }, 800);
      } else {
        console.error("[Login] No session token in response");
        setError("Login succeeded but no session token was returned");
        setIsSubmitting(false);
      }
    },
    onError: (err) => {
      console.error("[Login] onError called with:", err);
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        stage: "error",
        apiResponse: null,
        apiError: {
          message: err.message,
          code: (err as any).data?.code,
          shape: (err as any).shape,
        },
        hasSessionToken: false,
        sessionTokenValue: null,
        timestamp: new Date().toISOString(),
        mutationState: "error",
      }));
      
      setError(err.message);
      setIsSubmitting(false);
    },
    onSettled: () => {
      console.log("[Login] onSettled called - mutation completed");
      setDebugInfo(prev => ({ 
        ...prev, 
        stage: prev.stage === "mutation_started" ? "settled_without_callback" : prev.stage,
        mutationState: "settled",
      }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("[Login] Form submitted with email:", formData.email);
    setError(null);
    setLoginSuccess(false);
    setIsSubmitting(true);
    
    setDebugInfo(prev => ({
      ...prev,
      stage: "form_submitted",
      timestamp: new Date().toISOString(),
      mutationState: "starting",
    }));
    
    // Validate form data before submitting
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setIsSubmitting(false);
      setDebugInfo(prev => ({ ...prev, stage: "validation_failed" }));
      return;
    }
    
    try {
      console.log("[Login] Calling loginMutation.mutate");
      loginMutation.mutate({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
    } catch (err) {
      console.error("[Login] Unexpected error during mutation:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
      setDebugInfo(prev => ({
        ...prev,
        stage: "unexpected_error",
        apiError: err,
        timestamp: new Date().toISOString(),
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPending = loginMutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              src="/images/logos/rusingacademy-official.png"
              alt="RusingÂcademy"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your RusingAcademy account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {loginSuccess && (
              <Alert className="bg-green-900/50 border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  Login successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isPending || loginSuccess}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-400 hover:text-teal-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending || loginSuccess}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
              disabled={isPending || loginSuccess}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Success!
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Auth Debug Panel - Always shown when DEBUG_AUTH is true */}
          {DEBUG_AUTH && (
            <div className="mt-4 p-3 bg-slate-900/80 border border-slate-700 rounded-lg text-xs font-mono">
              <div className="text-teal-400 font-bold mb-2">🔧 Auth Debug Panel</div>
              <div className="space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-500">Stage:</span>{" "}
                  <span className="text-yellow-400">{debugInfo.stage}</span>
                </div>
                <div>
                  <span className="text-slate-500">Mutation State:</span>{" "}
                  <span className="text-blue-400">{debugInfo.mutationState}</span>
                </div>
                <div>
                  <span className="text-slate-500">Timestamp:</span> {debugInfo.timestamp}
                </div>
                <div>
                  <span className="text-slate-500">Has Token:</span>{" "}
                  <span className={debugInfo.hasSessionToken ? "text-green-400" : "text-red-400"}>
                    {debugInfo.hasSessionToken ? "YES" : "NO"}
                  </span>
                </div>
                {debugInfo.sessionTokenValue && (
                  <div>
                    <span className="text-slate-500">Token:</span> {debugInfo.sessionTokenValue}
                  </div>
                )}
                {debugInfo.apiResponse && (
                  <div>
                    <span className="text-slate-500">API Response:</span>
                    <pre className="mt-1 p-2 bg-slate-800 rounded overflow-x-auto text-green-300 max-h-32 overflow-y-auto">
                      {JSON.stringify(debugInfo.apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
                {debugInfo.apiError && (
                  <div>
                    <span className="text-slate-500">API Error:</span>
                    <pre className="mt-1 p-2 bg-slate-800 rounded overflow-x-auto text-red-300 max-h-32 overflow-y-auto">
                      {JSON.stringify(debugInfo.apiError, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">localStorage Token:</span>{" "}
                  {localStorage.getItem("sessionToken") ? (
                    <span className="text-green-400">Present ({localStorage.getItem("sessionToken")?.substring(0, 10)}...)</span>
                  ) : (
                    <span className="text-red-400">Missing</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300">
              Create one
            </Link>
          </p>
          <p className="text-center text-xs text-slate-500">
            Powered by Rusinga International Consulting Ltd. ( RusingAcademy )
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

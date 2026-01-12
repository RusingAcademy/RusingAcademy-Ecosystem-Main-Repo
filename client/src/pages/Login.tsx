import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Check if OAuth is enabled (Manus OAuth or other OAuth provider)
const OAUTH_ENABLED = import.meta.env.VITE_OAUTH_ENABLED === "true";

// Debug mode - show auth debug panel
const DEBUG_AUTH = true;

interface DebugInfo {
  apiResponse: unknown;
  apiError: unknown;
  hasSessionToken: boolean;
  sessionTokenValue: string | null;
  timestamp: string;
}

export default function Login() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(searchString);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Check for existing session on mount
  useEffect(() => {
    const existingToken = localStorage.getItem("sessionToken");
    if (existingToken) {
      console.log("[Login] Existing session token found, redirecting to dashboard");
      setLocation(redirectTo);
    }
  }, [setLocation, redirectTo]);

  const loginMutation = trpc.customAuth.login.useMutation({
    onSuccess: (data) => {
      console.log("[Login] onSuccess called with data:", data);
      
      // Update debug info
      setDebugInfo({
        apiResponse: data,
        apiError: null,
        hasSessionToken: !!data.sessionToken,
        sessionTokenValue: data.sessionToken ? `${data.sessionToken.substring(0, 20)}...` : null,
        timestamp: new Date().toISOString(),
      });
      
      // Store session token
      if (data.sessionToken) {
        localStorage.setItem("sessionToken", data.sessionToken);
        console.log("[Login] Session token stored in localStorage");
        setLoginSuccess(true);
        
        // Small delay to show success state before redirect
        setTimeout(() => {
          console.log("[Login] Redirecting to:", redirectTo);
          setLocation(redirectTo);
        }, 500);
      } else {
        console.error("[Login] No session token in response");
        setError("Login succeeded but no session token was returned");
      }
    },
    onError: (err) => {
      console.error("[Login] onError called with:", err);
      
      // Update debug info
      setDebugInfo({
        apiResponse: null,
        apiError: {
          message: err.message,
          code: (err as any).data?.code,
          shape: (err as any).shape,
        },
        hasSessionToken: false,
        sessionTokenValue: null,
        timestamp: new Date().toISOString(),
      });
      
      setError(err.message);
    },
    onSettled: () => {
      console.log("[Login] onSettled called - mutation completed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Login] Form submitted with email:", formData.email);
    setError(null);
    setDebugInfo(null);
    setLoginSuccess(false);
    
    // Validate form data before submitting
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    
    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
            Sign in to your RusingÂcademy account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={loginMutation.isPending || loginSuccess}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
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
                  disabled={loginMutation.isPending || loginSuccess}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
              disabled={loginMutation.isPending || loginSuccess}
            >
              {loginMutation.isPending ? (
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

          {/* Auth Debug Panel - Only shown when DEBUG_AUTH is true */}
          {DEBUG_AUTH && debugInfo && (
            <div className="mt-4 p-3 bg-slate-900/80 border border-slate-700 rounded-lg text-xs font-mono">
              <div className="text-teal-400 font-bold mb-2">🔧 Auth Debug Panel</div>
              <div className="space-y-1 text-slate-300">
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
                    <pre className="mt-1 p-2 bg-slate-800 rounded overflow-x-auto text-green-300">
                      {JSON.stringify(debugInfo.apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
                {debugInfo.apiError && (
                  <div>
                    <span className="text-slate-500">API Error:</span>
                    <pre className="mt-1 p-2 bg-slate-800 rounded overflow-x-auto text-red-300">
                      {JSON.stringify(debugInfo.apiError, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">localStorage Token:</span>{" "}
                  {localStorage.getItem("sessionToken") ? (
                    <span className="text-green-400">Present</span>
                  ) : (
                    <span className="text-red-400">Missing</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social login buttons - only shown when OAuth is enabled */}
          {OAUTH_ENABLED && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  onClick={() => window.location.href = "/api/oauth/google"}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  onClick={() => window.location.href = "/api/oauth/microsoft"}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z" />
                    <path fill="#00a4ef" d="M1 13h10v10H1z" />
                    <path fill="#7fba00" d="M13 1h10v10H13z" />
                    <path fill="#ffb900" d="M13 13h10v10H13z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  onClick={() => window.location.href = "/api/oauth/apple"}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
              Create one
            </Link>
          </div>
          <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-700">
            Powered by Rusinga International Consulting Ltd. ( RusingÂcademy )
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const verifyMutation = trpc.customAuth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus("success");
      setMessage("Your email has been verified successfully!");
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    },
    onError: (err) => {
      setStatus("error");
      setMessage(err.message || "Failed to verify email. The link may have expired.");
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    } else {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#062b2b] via-[#0a4040] to-[#062b2b] p-4">
      <Card className="w-full max-w-md bg-foundation/50 border-[#0a6969]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              loading="lazy" src="https://rusingacademy-cdn.b-cdn.net/images/logos/rusingacademy-official.png"
              alt="RusingAcademy"
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 text-teal-500 mx-auto animate-spin" />
                <p className="text-white/90">Verifying your email...</p>
              </>
            )}
            
            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-xl font-semibold text-white">Email Verified!</h2>
                <p className="text-white/90">{message}</p>
                <p className="text-sm text-[#67E8F9]">Redirecting to login...</p>
              </>
            )}
            
            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h2 className="text-xl font-semibold text-white">Verification Failed</h2>
                <p className="text-white/90">{message}</p>
                <div className="pt-4 space-y-2">
                  <Button
                    asChild
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    <Link to="/login">Go to Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-slate-600 text-white/90 hover:bg-foundation-2"
                  >
                    <Link to="/signup">Create New Account</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

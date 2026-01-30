import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Loader2, UserCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CoachInviteClaim() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [claiming, setClaiming] = useState(false);

  // Fetch invitation details
  const { data: invitation, isLoading, error } = trpc.coachInvitation.getByToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  // Claim mutation
  const claimMutation = trpc.coachInvitation.claim.useMutation({
    onSuccess: (data) => {
      toast.success("Profile Claimed Successfully!", {
        description: "You now have access to your coach dashboard.",
      });
      // Redirect to coach dashboard
      setLocation(`/coach/dashboard`);
    },
    onError: (error) => {
      toast.error("Failed to Claim Profile", {
        description: error.message,
      });
      setClaiming(false);
    },
  });

  const handleClaim = async () => {
    if (!token) return;
    setClaiming(true);
    claimMutation.mutate({ token });
  };

  const handleLogin = () => {
    // Store the current URL to redirect back after login
    const currentUrl = window.location.pathname;
    localStorage.setItem("postLoginRedirect", currentUrl);
    window.location.href = getLoginUrl();
  };

  // Loading state
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Invitation Not Found</CardTitle>
            <CardDescription>
              This invitation link is invalid or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setLocation("/")} variant="outline">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expired state
  if (invitation.isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Invitation Expired</CardTitle>
            <CardDescription>
              This invitation has expired. Please contact the administrator for a new invitation link.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-500">
              Expired on: {new Date(invitation.expiresAt).toLocaleDateString()}
            </p>
            <Button onClick={() => setLocation("/")} variant="outline">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already claimed state
  if (invitation.isClaimed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Already Claimed</CardTitle>
            <CardDescription>
              This coach profile has already been claimed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {isAuthenticated ? (
              <Button onClick={() => setLocation("/coach/dashboard")}>
                Go to Coach Dashboard
              </Button>
            ) : (
              <Button onClick={handleLogin}>
                Login to Your Account
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid invitation - show claim form
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Claim Your Coach Profile</CardTitle>
          <CardDescription className="text-base">
            You've been invited to take control of your coach profile on RusingAcademy
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Coach Profile Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
              {invitation.coachName}
            </h3>
            {invitation.coachHeadline && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {invitation.coachHeadline}
              </p>
            )}
          </div>

          {/* What you'll get */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-800 dark:text-slate-200">
              By claiming this profile, you'll be able to:
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Manage your coach profile and availability</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Accept bookings and conduct sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Track your earnings and performance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Communicate with learners</span>
              </li>
            </ul>
          </div>

          {/* Expiration notice */}
          <p className="text-xs text-slate-500 text-center">
            This invitation expires on {new Date(invitation.expiresAt).toLocaleDateString()}
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            {isAuthenticated ? (
              <Button 
                onClick={handleClaim} 
                className="w-full" 
                size="lg"
                disabled={claiming}
              >
                {claiming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Claiming Profile...
                  </>
                ) : (
                  <>
                    Claim This Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleLogin} 
                  className="w-full" 
                  size="lg"
                >
                  Login to Claim Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  You'll need to login or create an account to claim this profile
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

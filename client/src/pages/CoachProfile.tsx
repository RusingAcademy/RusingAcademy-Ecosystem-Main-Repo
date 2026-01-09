import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Star,
  Clock,
  Users,
  Award,
  MessageSquare,
  Calendar as CalendarIcon,
  Play,
  CheckCircle2,
  Globe,
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { LearnerOnboardingModal } from "@/components/LearnerOnboardingModal";
import { ReviewModal } from "@/components/ReviewModal";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";

const specializationLabels: Record<string, string> = {
  oral_a: "Oral A",
  oral_b: "Oral B",
  oral_c: "Oral C",
  oralA: "Oral A",
  oralB: "Oral B",
  oralC: "Oral C",
  written_a: "Written A",
  written_b: "Written B",
  written_c: "Written C",
  writtenA: "Written A",
  writtenB: "Written B",
  writtenC: "Written C",
  reading: "Reading",
  readingComprehension: "Reading Comprehension",
  anxiety_coaching: "Anxiety Coaching",
  examPrep: "Exam Preparation",
  businessFrench: "Business French",
  businessEnglish: "Business English",
};

const defaultTimeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "6:00 PM"];

export default function CoachProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const isEn = language === "en";
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<"trial" | "single">("trial");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Check if user has learner profile
  const { data: learnerProfile, refetch: refetchLearnerProfile } = trpc.learner.myProfile.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch coach data from database
  const { data: coach, isLoading, error } = trpc.coach.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Fetch coach reviews
  const { data: reviews, refetch: refetchReviews } = trpc.coach.reviews.useQuery(
    { coachId: coach?.id || 0, limit: 10 },
    { enabled: !!coach?.id }
  );

  // Check if user can review this coach
  const { data: canReviewData } = trpc.coach.canReview.useQuery(
    { coachId: coach?.id || 0 },
    { enabled: !!coach?.id && isAuthenticated }
  );

  // Get user's existing review for this coach
  const { data: myReview } = trpc.coach.myReview.useQuery(
    { coachId: coach?.id || 0 },
    { enabled: !!coach?.id && isAuthenticated }
  );

  // Fetch available time slots for selected date
  const { data: availableSlots, isLoading: slotsLoading } = trpc.coach.availableSlots.useQuery(
    { coachId: coach?.id || 0, date: selectedDate?.toISOString() || "" },
    { enabled: !!coach?.id && !!selectedDate }
  );

  // Use fetched slots or default if none configured
  const availableTimeSlots = availableSlots && availableSlots.length > 0 ? availableSlots : defaultTimeSlots;

  // Stripe checkout mutation
  const checkoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
      setIsBooking(false);
    },
  });

  const handleBookSession = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    if (!coach) {
      toast.error("Coach information not available");
      return;
    }

    // Check if user has learner profile - if not, show onboarding
    if (!learnerProfile) {
      setPendingBooking(true);
      setShowOnboarding(true);
      return;
    }

    setIsBooking(true);
    
    try {
      await checkoutMutation.mutateAsync({
        coachId: coach.userId, // Use userId for the checkout
        sessionType,
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  // Handle successful onboarding - proceed with booking
  const handleOnboardingSuccess = async () => {
    await refetchLearnerProfile();
    if (pendingBooking) {
      setPendingBooking(false);
      // Small delay to ensure profile is available
      setTimeout(() => {
        setIsBooking(true);
        checkoutMutation.mutate({
          coachId: coach?.userId || 0,
          sessionType,
        });
      }, 500);
    }
  };

  const resetBookingDialog = () => {
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSessionType("trial");
    setIsBooking(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !coach) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-2">Coach Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The coach profile you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/coaches">
                <Button>Browse All Coaches</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse specializations from JSON if needed
  const specializations = typeof coach.specializations === 'object' && coach.specializations !== null
    ? Object.entries(coach.specializations as Record<string, boolean>)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    : [];

  const languageLabel = coach.languages === "french" ? "French" : 
                        coach.languages === "english" ? "English" : "French & English";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <Breadcrumb 
          items={[
            { label: "Find a Coach", labelFr: "Trouver un coach", href: "/coaches" },
            { label: coach?.name || "Coach Profile", labelFr: coach?.name || "Profil du coach" }
          ]} 
        />

        {/* Coach Profile Content */}
        <div className="container pt-2">
          <Link href="/coaches" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            {isEn ? "Back to coaches" : "Retour aux coachs"}
          </Link>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={coach.photoUrl || coach.avatarUrl || undefined} />
                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                          {(coach.name || "C").split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h1 className="text-2xl font-bold mb-1">{coach.name}</h1>
                          <p className="text-muted-foreground">{coach.headline}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsFavorite(!isFavorite)}
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{coach.averageRating || "New"}</span>
                          {reviews && reviews.length > 0 && (
                            <span className="text-muted-foreground">
                              ({reviews.length} reviews)
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {coach.totalStudents || 0} students
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {coach.totalSessions || 0} sessions
                        </span>
                        {coach.successRate && coach.successRate > 0 && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Award className="h-4 w-4" />
                            {coach.successRate}% success rate
                          </span>
                        )}
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          {languageLabel}
                        </Badge>
                        {specializations.map((spec) => (
                          <Badge key={spec} variant="outline">
                            {specializationLabels[spec] || spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Introduction */}
              {coach.videoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Video Introduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {coach.videoUrl.includes("youtube.com") || coach.videoUrl.includes("youtu.be") ? (
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={coach.videoUrl.replace("watch?v=", "embed/")}
                          title="Coach Introduction Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <a href={coach.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className="gap-2">
                            <Play className="h-5 w-5" />
                            Watch Introduction
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tabs - Custom Implementation */}
              <div className="w-full">
                <div className="bg-muted inline-flex h-9 items-center justify-start rounded-lg p-[3px] mb-6">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all ${
                      activeTab === "about"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all ${
                      activeTab === "reviews"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Reviews {reviews && reviews.length > 0 ? `(${reviews.length})` : ""}
                  </button>
                </div>

                {activeTab === "about" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {coach.bio?.split("\n\n").map((paragraph, i) => (
                          <p key={i} className="text-muted-foreground mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="border-t pt-6 mt-6">
                        <h4 className="font-semibold mb-4">Credentials & Experience</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Experience</p>
                              <p className="text-sm text-muted-foreground">
                                {coach.yearsExperience} years teaching SLE preparation
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Credentials</p>
                              <p className="text-sm text-muted-foreground">
                                {coach.credentials}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Response Time</p>
                              <p className="text-sm text-muted-foreground">
                                Usually responds within {coach.responseTimeHours || 24} hours
                              </p>
                            </div>
                          </div>
                          {coach.successRate && coach.successRate > 0 && (
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium">Success Rate</p>
                                <p className="text-sm text-muted-foreground">
                                  {coach.successRate}% of students achieved their SLE goal
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Write Review Button */}
                  {isAuthenticated && (canReviewData?.canReview || myReview) && (
                    <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-teal-200 dark:border-teal-800">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-teal-800 dark:text-teal-200">
                              {myReview ? "You've reviewed this coach" : "Share your experience"}
                            </p>
                            <p className="text-sm text-teal-600 dark:text-teal-400">
                              {myReview 
                                ? "Update your review anytime"
                                : "Help other learners by leaving a review"}
                            </p>
                          </div>
                          <Button 
                            onClick={() => setShowReviewModal(true)}
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            {myReview ? "Edit Review" : "Write Review"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {reviews && reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {review.learnerName?.charAt(0) || "L"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.learnerName || "Anonymous"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString("en-CA", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{review.comment}</p>
                          {review.sleAchievement && (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                              <Award className="h-3 w-3 mr-1" />
                              Achieved: {review.sleAchievement}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>No reviews yet. Be the first to leave a review!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                )}
              </div>
            </div>

            {/* Sidebar - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Pricing Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Book a Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div 
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          sessionType === "trial" ? "bg-primary/5 border-primary" : "bg-muted/30 hover:bg-muted/50"
                        }`}
                        onClick={() => setSessionType("trial")}
                      >
                        <div>
                          <p className="font-medium">Trial Session</p>
                          <p className="text-sm text-muted-foreground">30 minutes</p>
                        </div>
                        <p className="text-xl font-bold">
                          ${((coach.trialRate || 2500) / 100).toFixed(0)}
                        </p>
                      </div>
                      <div 
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          sessionType === "single" ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSessionType("single")}
                      >
                        <div>
                          <p className="font-medium">Regular Session</p>
                          <p className="text-sm text-muted-foreground">60 minutes</p>
                        </div>
                        <p className="text-xl font-bold">
                          ${((coach.hourlyRate || 5500) / 100).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    {/* Calendly or Internal Booking */}
                    {coach.calendarType === "calendly" && coach.calendlyUrl ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => window.open(coach.calendlyUrl || '', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Book via Calendly
                      </Button>
                    ) : (
                    <Dialog 
                      open={bookingDialogOpen} 
                      onOpenChange={(open) => {
                        setBookingDialogOpen(open);
                        if (!open) resetBookingDialog();
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Book {sessionType === "trial" ? "Trial" : "Regular"} Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <div className="max-h-[70vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Select Date & Time</DialogTitle>
                          <DialogDescription>
                            Choose a date and time for your {sessionType === "trial" ? "trial" : "regular"} session with {coach.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex justify-center py-4">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setSelectedTime(null); // Reset time when date changes
                            }}
                            disabled={(date) => date < new Date() || date.getDay() === 0}
                            className="rounded-md border"
                          />
                        </div>
                        
                        {selectedDate && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium">Available times:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {availableTimeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedTime(time)}
                                  className={selectedTime === time ? "ring-2 ring-primary ring-offset-2" : ""}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedDate && selectedTime && (
                          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Booking Summary</h4>
                            <div className="text-sm space-y-1 text-muted-foreground">
                              <p><strong>Coach:</strong> {coach.name}</p>
                              <p><strong>Date:</strong> {selectedDate.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                              <p><strong>Time:</strong> {selectedTime}</p>
                              <p><strong>Session:</strong> {sessionType === "trial" ? "Trial (30 min)" : "Regular (60 min)"}</p>
                              <p className="text-lg font-bold text-foreground mt-2">
                                Total: ${((sessionType === "trial" ? (coach.trialRate || 2500) : (coach.hourlyRate || 5500)) / 100).toFixed(2)} CAD
                              </p>
                            </div>
                          </div>
                        )}
                        </div>

                        <DialogFooter className="mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => setBookingDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleBookSession}
                            disabled={!selectedDate || !selectedTime || isBooking}
                            className="gap-2"
                          >
                            {isBooking ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4" />
                                Proceed to Payment
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    )}

                    <Button variant="outline" className="w-full" size="lg">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Response time</span>
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {coach.responseTimeHours || 24}h
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total sessions</span>
                        <span className="font-medium">{coach.totalSessions || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Students helped</span>
                        <span className="font-medium">{coach.totalStudents || 0}</span>
                      </div>
                      {coach.successRate && coach.successRate > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">SLE success rate</span>
                          <span className="font-medium text-emerald-600">
                            {coach.successRate}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Learner Onboarding Modal */}
      <LearnerOnboardingModal
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onSuccess={handleOnboardingSuccess}
      />

      {/* Review Modal */}
      {coach && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          coachId={coach.id}
          coachName={coach.name || "Coach"}
          existingReview={myReview}
          onSuccess={() => refetchReviews()}
        />
      )}
    </div>
  );
}

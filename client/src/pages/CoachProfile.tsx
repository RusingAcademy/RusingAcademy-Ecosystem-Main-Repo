import { useState } from "react";
import Header from "@/components/Header";
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
} from "@/components/ui/dialog";
import {
  GraduationCap,
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
} from "lucide-react";
import { Link, useParams } from "wouter";


// Mock coach data (will be replaced with tRPC query)
const mockCoach = {
  id: 1,
  slug: "marie-leblanc",
  name: "Marie Leblanc",
  headline: "Oral C Specialist | 10+ Years SLE Experience",
  bio: `I'm a passionate language coach with over 10 years of experience helping Canadian federal public servants achieve their SLE goals. As a former Public Service Commission evaluator, I understand exactly what it takes to succeed in the oral interaction exam.

My approach is personalized and encouraging. I believe that with the right guidance and practice, anyone can reach their target level. I specialize in helping learners overcome test anxiety and build confidence in their speaking abilities.

Whether you're aiming for your first B level or pushing for that challenging C, I'm here to support your journey. Let's work together to unlock your potential!`,
  languages: "french",
  specializations: ["oral_c", "oral_b", "anxiety_coaching", "written_b"],
  yearsExperience: 12,
  credentials: "TESL Certified, Former PSC Evaluator, MA in Applied Linguistics",
  hourlyRate: 5500,
  trialRate: 2500,
  averageRating: 4.9,
  totalReviews: 127,
  totalSessions: 850,
  totalStudents: 215,
  successRate: 94,
  responseTimeHours: 2,
  avatarUrl: null,
  videoUrl: "https://example.com/video",
};

const mockReviews = [
  {
    id: 1,
    learnerName: "Jean-Pierre D.",
    rating: 5,
    comment: "Marie helped me go from B to C in just 3 months! Her understanding of the SLE format is incredible. She knew exactly what the evaluators were looking for and helped me practice scenarios that came up in my actual exam.",
    sleAchievement: "Oral C",
    createdAt: "2025-12-15",
  },
  {
    id: 2,
    learnerName: "Sarah M.",
    rating: 5,
    comment: "I was so anxious about my oral exam, but Marie's calm and encouraging approach made all the difference. She taught me techniques to manage my nerves and stay focused during the evaluation.",
    sleAchievement: "Oral B",
    createdAt: "2025-11-28",
  },
  {
    id: 3,
    learnerName: "Michael T.",
    rating: 4,
    comment: "Very knowledgeable coach. Sessions are well-structured and she provides excellent feedback. The only reason for 4 stars is that sometimes sessions ran a bit over time, but that's because she's so thorough!",
    sleAchievement: null,
    createdAt: "2025-11-10",
  },
];

const specializationLabels: Record<string, string> = {
  oral_a: "Oral A",
  oral_b: "Oral B",
  oral_c: "Oral C",
  written_a: "Written A",
  written_b: "Written B",
  written_c: "Written C",
  reading: "Reading",
  anxiety_coaching: "Anxiety Coaching",
};

export default function CoachProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // In real implementation, fetch coach by slug
  const coach = mockCoach;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Back Link */}
        <div className="container pt-6">
          <Link href="/coaches" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to coaches
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
                        <AvatarImage src={coach.avatarUrl || undefined} />
                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                          {coach.name.split(" ").map((n) => n[0]).join("")}
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
                          <span className="font-semibold">{coach.averageRating}</span>
                          <span className="text-muted-foreground">
                            ({coach.totalReviews} reviews)
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {coach.totalStudents} students
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {coach.totalSessions} sessions
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Award className="h-4 w-4" />
                          {coach.successRate}% success rate
                        </span>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          French
                        </Badge>
                        {coach.specializations.map((spec) => (
                          <Badge key={spec} variant="outline">
                            {specializationLabels[spec]}
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
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Button size="lg" className="gap-2">
                        <Play className="h-5 w-5" />
                        Watch Introduction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs */}
              <Tabs defaultValue="about">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({coach.totalReviews})</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {coach.bio.split("\n\n").map((paragraph, i) => (
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
                              <p className="text-sm text-muted-foreground">{coach.credentials}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Response Time</p>
                              <p className="text-sm text-muted-foreground">
                                Usually responds within {coach.responseTimeHours} hours
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">Success Rate</p>
                              <p className="text-sm text-muted-foreground">
                                {coach.successRate}% of students achieved their SLE goal
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {mockReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {review.learnerName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.learnerName}</p>
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
                  ))}
                </TabsContent>
              </Tabs>
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
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium">Trial Session</p>
                          <p className="text-sm text-muted-foreground">30 minutes</p>
                        </div>
                        <p className="text-xl font-bold">
                          ${(coach.trialRate / 100).toFixed(0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">Regular Session</p>
                          <p className="text-sm text-muted-foreground">60 minutes</p>
                        </div>
                        <p className="text-xl font-bold">
                          ${(coach.hourlyRate / 100).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Book Trial Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Select a Date</DialogTitle>
                          <DialogDescription>
                            Choose a date to see available time slots with {coach.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                          />
                        </div>
                        {selectedDate && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Available times:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "6:00 PM"].map(
                                (time) => (
                                  <Button key={time} variant="outline" size="sm">
                                    {time}
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

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
                          {coach.responseTimeHours}h
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total sessions</span>
                        <span className="font-medium">{coach.totalSessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Students helped</span>
                        <span className="font-medium">{coach.totalStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">SLE success rate</span>
                        <span className="font-medium text-emerald-600">
                          {coach.successRate}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

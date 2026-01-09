import { useState } from "react";
import { useAuth } from "../_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Languages,
  DollarSign,
  Video,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";

interface ApplicationFilters {
  status: string;
  search: string;
  sortBy: string;
}

export default function AdminCoachApplications() {
  const { user } = useAuth();
  const authLoading = false;
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: "all",
    search: "",
    sortBy: "newest",
  });
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);

  // Fetch applications
  const { data: applications, isLoading, refetch } = trpc.admin.getCoachApplications.useQuery({
    status: filters.status === "all" ? undefined : filters.status,
    search: filters.search || undefined,
  });

  // Mutations
  const approveApplication = trpc.admin.approveCoachApplication.useMutation({
    onSuccess: () => {
      refetch();
      setShowReviewModal(false);
      setSelectedApplication(null);
      setReviewNotes("");
    },
  });

  const rejectApplication = trpc.admin.rejectCoachApplication.useMutation({
    onSuccess: () => {
      refetch();
      setShowReviewModal(false);
      setSelectedApplication(null);
      setReviewNotes("");
    },
  });

  // Check admin access
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You must be an admin to access this page.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      submitted: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", icon: <Clock className="w-3 h-3" /> },
      under_review: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", icon: <Eye className="w-3 h-3" /> },
      approved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", icon: <XCircle className="w-3 h-3" /> },
    };
    const badge = badges[status] || badges.submitted;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
      </span>
    );
  };

  const handleReview = (applicationId: number, action: "approve" | "reject") => {
    setSelectedApplication(applicationId);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (!selectedApplication || !reviewAction) return;

    if (reviewAction === "approve") {
      approveApplication.mutate({
        applicationId: selectedApplication,
        notes: reviewNotes,
      });
    } else {
      rejectApplication.mutate({
        applicationId: selectedApplication,
        reason: reviewNotes,
      });
    }
  };

  // Statistics
  const stats = {
    total: applications?.length || 0,
    submitted: applications?.filter((a: any) => a.status === "submitted").length || 0,
    underReview: applications?.filter((a: any) => a.status === "under_review").length || 0,
    approved: applications?.filter((a: any) => a.status === "approved").length || 0,
    rejected: applications?.filter((a: any) => a.status === "rejected").length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Coach Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage coach application submissions
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">New</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600">{stats.underReview}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">In Review</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Approved</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">New Submissions</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No applications found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filters.search || filters.status !== "all"
                ? "Try adjusting your filters"
                : "New coach applications will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onApprove={() => handleReview(app.id, "approve")}
                onReject={() => handleReview(app.id, "reject")}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {reviewAction === "approve" ? "Approve Application" : "Reject Application"}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {reviewAction === "approve"
                ? "This will create a coach profile and send a welcome email to the applicant."
                : "Please provide a reason for rejection. This will be sent to the applicant."}
            </p>

            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={reviewAction === "approve" ? "Optional notes..." : "Reason for rejection (required)..."}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
              required={reviewAction === "reject"}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewNotes("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={reviewAction === "reject" && !reviewNotes.trim()}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  reviewAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {reviewAction === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Application Card Component
function ApplicationCard({
  application,
  onApprove,
  onReject,
  getStatusBadge,
}: {
  application: any;
  onApprove: () => void;
  onReject: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
            {application.firstName?.[0]}{application.lastName?.[0]}
          </div>
          
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {application.firstName} {application.lastName}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {application.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {application.city}, {application.country}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(application.status)}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Personal Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="text-gray-900 dark:text-white">{application.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Timezone</span>
                  <span className="text-gray-900 dark:text-white">{application.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Applied</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(application.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Professional Background
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Education</span>
                  <span className="text-gray-900 dark:text-white">{application.education}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Experience</span>
                  <span className="text-gray-900 dark:text-white">{application.yearsTeaching} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Certifications</span>
                  <span className="text-gray-900 dark:text-white">{application.certifications || "None listed"}</span>
                </div>
              </div>
            </div>

            {/* Language Qualifications */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-teal-600" />
                Language Qualifications
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Native Language</span>
                  <span className="text-gray-900 dark:text-white capitalize">{application.nativeLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Teaching Language</span>
                  <span className="text-gray-900 dark:text-white capitalize">{application.teachingLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">SLE Experience</span>
                  <span className="text-gray-900 dark:text-white">{application.hasSleExperience ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600" />
                Pricing & Availability
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Hourly Rate</span>
                  <span className="text-gray-900 dark:text-white">${application.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Trial Rate</span>
                  <span className="text-gray-900 dark:text-white">${application.trialRate}/session</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Weekly Hours</span>
                  <span className="text-gray-900 dark:text-white">{application.weeklyHours} hrs/week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Motivation */}
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                {application.bio || "No bio provided"}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Why Lingueefy?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                {application.whyLingueefy || "No motivation provided"}
              </p>
            </div>
          </div>

          {/* Media */}
          {(application.photoUrl || application.introVideoUrl) && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-600" />
                Media
              </h4>
              <div className="flex gap-4">
                {application.photoUrl && (
                  <a
                    href={application.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Photo
                  </a>
                )}
                {application.introVideoUrl && (
                  <a
                    href={application.introVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    View Video
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Review Notes (if already reviewed) */}
          {application.reviewNotes && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Review Notes</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">{application.reviewNotes}</p>
              {application.reviewedAt && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  Reviewed on {formatDate(application.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {(application.status === "submitted" || application.status === "under_review") && (
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onReject}
                className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

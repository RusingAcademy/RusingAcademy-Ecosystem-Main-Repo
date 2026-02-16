import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Clock, CheckCircle2, AlertCircle, Loader, RefreshCw } from 'lucide-react';

interface ApplicationStatus {
  id: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  fullName: string;
  email: string;
  resubmissionCount?: number | null;
}

interface TimelineEvent {
  id: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  timestamp: Date;
  message: string;
  icon: string;
}

interface ApplicationStatusTrackerProps {
  onResubmit?: () => void;
}

export function ApplicationStatusTracker({ onResubmit }: ApplicationStatusTrackerProps) {
  const { language } = useLanguage();
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { data: applicationStatus, isLoading: statusLoading, refetch: refetchStatus } = trpc.coach.getApplicationStatus.useQuery();
  const { data: timeline, isLoading: timelineLoading, refetch: refetchTimeline } = trpc.coach.getApplicationTimeline.useQuery();

  // Auto-refresh every 30 seconds if application is not yet approved
  useEffect(() => {
    if (!autoRefresh || !applicationStatus || applicationStatus.status === 'approved') {
      setAutoRefresh(false);
      return;
    }

    const interval = setInterval(() => {
      refetchStatus();
      refetchTimeline();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, applicationStatus, refetchStatus, refetchTimeline]);

  if (!applicationStatus) {
    return null;
  }

  const status = applicationStatus.status as 'submitted' | 'under_review' | 'approved' | 'rejected';

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-50 border-blue-200',
    under_review: 'bg-yellow-50 border-yellow-200',
    approved: 'bg-green-50 border-green-200',
    rejected: 'bg-red-50 border-red-200',
  };

  const statusTextColors: Record<string, string> = {
    submitted: 'text-blue-900',
    under_review: 'text-yellow-900',
    approved: 'text-green-900',
    rejected: 'text-red-900',
  };

  const statusBadgeColors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-5 h-5" />;
      case 'under_review':
        return <Loader className="w-5 h-5 animate-spin" />;
      case 'approved':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    const labels: Record<string, Record<string, string>> = {
      en: {
        submitted: 'Submitted',
        under_review: 'Under Review',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      fr: {
        submitted: 'Soumis',
        under_review: 'En examen',
        approved: 'Approuvé',
        rejected: 'Rejeté',
      },
    };
    return (status && labels[language] && labels[language][status]) || status || '';
  };

  const getStatusDescription = (status: string | null) => {
    const descriptions: Record<string, Record<string, string>> = {
      en: {
        submitted: 'Your application has been received. Our team will review it shortly.',
        under_review: 'Your application is being reviewed by our team. This usually takes 2-3 business days.',
        approved: 'Congratulations! Your application has been approved. You can now start setting up your profile.',
        rejected: 'Unfortunately, your application was not approved at this time.',
      },
      fr: {
        submitted: 'Votre candidature a été reçue. Notre équipe l\'examinera bientôt.',
        under_review: 'Votre candidature est en cours d\'examen par notre équipe. Cela prend généralement 2 à 3 jours ouvrables.',
        approved: 'Félicitations! Votre candidature a été approuvée. Vous pouvez maintenant commencer à configurer votre profil.',
        rejected: 'Malheureusement, votre candidature n\'a pas été approuvée cette fois-ci.',
      },
    };
    return (status && descriptions[language] && descriptions[language][status]) || '';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Summary Card */}
      <div className={`border-2 rounded-lg p-6 ${statusColors[status]}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="text-2xl mt-1">
              {getStatusIcon(status)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-xl font-bold ${statusTextColors[status]}`}>
                  {getStatusLabel(status)}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColors[status]}`}>
                  {language === 'fr' ? 'Statut' : 'Status'}
                </span>
                {applicationStatus.resubmissionCount && applicationStatus.resubmissionCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {language === 'fr' ? `Tentative #${applicationStatus.resubmissionCount + 1}` : `Attempt #${applicationStatus.resubmissionCount + 1}`}
                  </span>
                )}
              </div>
              <p className={`${statusTextColors[status]} opacity-90`}>
                {getStatusDescription(applicationStatus.status)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-2 text-sm">
          <div>
            <span className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}:</span> {applicationStatus?.fullName || 'N/A'}
          </div>
          <div>
            <span className="font-medium">{language === 'fr' ? 'Email' : 'Email'}:</span> {applicationStatus?.email || 'N/A'}
          </div>
          <div>
            {/* @ts-ignore - TS2345: auto-suppressed during TS cleanup */}
            <span className="font-medium">{language === 'fr' ? 'Soumis le' : 'Submitted'}:</span> {formatDate(applicationStatus.createdAt)}
          </div>
          {applicationStatus.reviewedAt && (
            <div>
              {/* @ts-ignore - TS2345: auto-suppressed during TS cleanup */}
              <span className="font-medium">{language === 'fr' ? 'Examiné le' : 'Reviewed'}:</span> {formatDate(applicationStatus.reviewedAt)}
            </div>
          )}
          {applicationStatus.reviewNotes && (
            <div className="mt-2 p-3 rounded bg-white/50 dark:bg-black/20">
              <span className="font-medium block mb-1">{language === 'fr' ? 'Commentaires de l\'évaluateur' : 'Reviewer Feedback'}:</span>
              <p className="text-sm italic">{applicationStatus.reviewNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <div className="bg-white dark:bg-obsidian rounded-lg border border-slate-200 dark:border-[#0a6969] p-6">
          <h3 className="text-lg font-bold mb-6 text-black dark:text-white">
            {language === 'fr' ? 'Historique de candidature' : 'Application Timeline'}
          </h3>
          
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-teal-300" />

            {/* Timeline events */}
            {timeline.map((event, index) => (
              <div key={event.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-12 h-12 bg-white dark:bg-obsidian border-4 border-teal-500 rounded-full flex items-center justify-center">
                  <div className="text-teal-600 dark:text-teal-400">
                    {event.icon === 'check' && <CheckCircle2 className="w-5 h-5" />}
                    {event.icon === 'clock' && <Clock className="w-5 h-5 animate-spin" />}
                    {event.icon === 'checkCircle' && <CheckCircle2 className="w-5 h-5" />}
                    {event.icon === 'x' && <AlertCircle className="w-5 h-5" />}
                  </div>
                </div>

                {/* Event content */}
                <div className="bg-white dark:bg-foundation rounded-lg p-4 border border-slate-200 dark:border-[#0a6969]">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-black dark:text-white">
                      {event.message}
                    </h4>
                    <span className="text-xs text-black dark:text-[#67E8F9] whitespace-nowrap ml-2">
                      {formatDate(new Date(event.timestamp))}
                    </span>
                  </div>
                  <p className="text-sm text-black dark:text-white/90">
                    {language === 'fr' ? 'Étape ' : 'Step '} {index + 1} {language === 'fr' ? 'de' : 'of'} {timeline.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      {autoRefresh && applicationStatus.status !== 'approved' && (
        <div className="text-center text-sm text-black dark:text-[#67E8F9]">
          <Loader className="w-4 h-4 inline animate-spin mr-2" />
          {language === 'fr' ? 'Mise à jour automatique toutes les 30 secondes' : 'Auto-refreshing every 30 seconds'}
        </div>
      )}

      {/* Next Steps - Approved */}
      {applicationStatus.status === 'approved' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="font-bold text-green-900 dark:text-green-100 mb-3">
            {language === 'fr' ? 'Prochaines étapes' : 'Next Steps'}
          </h3>
          <ul className="space-y-2 text-green-800 dark:text-green-200 text-sm">
            <li>✓ {language === 'fr' ? 'Complétez votre profil' : 'Complete your profile'}</li>
            <li>✓ {language === 'fr' ? 'Définissez votre disponibilité' : 'Set your availability'}</li>
            <li>✓ {language === 'fr' ? 'Connectez votre compte Stripe' : 'Connect your Stripe account'}</li>
            <li>✓ {language === 'fr' ? 'Commencez à accepter des réservations' : 'Start accepting bookings'}</li>
          </ul>
        </div>
      )}

      {/* Next Steps - Rejected with Resubmit */}
      {applicationStatus.status === 'rejected' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="font-bold text-red-900 dark:text-red-100 mb-3">
            {language === 'fr' ? 'Que faire ensuite?' : 'What to do next?'}
          </h3>
          <p className="text-red-800 dark:text-red-200 text-sm mb-4">
            {language === 'fr' 
              ? 'Vous pouvez soumettre une nouvelle candidature après avoir examiné les commentaires ci-dessus. Vos données précédentes seront pré-remplies pour faciliter le processus.' 
              : 'You can submit a revised application after reviewing the feedback above. Your previous data will be pre-filled to make the process easier.'}
          </p>
          <button 
            onClick={onResubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'fr' ? 'Réviser et resoumettre' : 'Revise & Resubmit'}
          </button>
        </div>
      )}
    </div>
  );
}

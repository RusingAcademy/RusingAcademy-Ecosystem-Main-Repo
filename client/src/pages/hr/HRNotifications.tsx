/**
 * HRNotifications — Notification Center for Client Portal
 * Shows training updates, compliance alerts, and system notifications.
 */
import HRLayout from "@/components/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

type NotifFilter = "all" | "training" | "compliance" | "system";

export default function HRNotifications() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [filter, setFilter] = useState<NotifFilter>("all");

  const ui = {
    title: isEn ? "Notifications" : "Notifications",
    subtitle: isEn ? "Stay informed about training progress and compliance updates" : "Restez informé des progrès de formation et des mises à jour de conformité",
    all: isEn ? "All" : "Tout",
    training: isEn ? "Training" : "Formation",
    compliance: isEn ? "Compliance" : "Conformité",
    system: isEn ? "System" : "Système",
    markAllRead: isEn ? "Mark all as read" : "Tout marquer comme lu",
    noNotifications: isEn ? "No notifications yet" : "Aucune notification pour le moment",
    noNotificationsSub: isEn
      ? "You'll receive notifications about participant progress, compliance deadlines, and important training updates here."
      : "Vous recevrez ici des notifications sur la progression des participants, les échéances de conformité et les mises à jour importantes de formation.",
    preferences: isEn ? "Notification Preferences" : "Préférences de notification",
    emailAlerts: isEn ? "Email Alerts" : "Alertes par courriel",
    emailAlertsSub: isEn ? "Receive email notifications for critical updates" : "Recevoir des notifications par courriel pour les mises à jour critiques",
    weeklyDigest: isEn ? "Weekly Digest" : "Résumé hebdomadaire",
    weeklyDigestSub: isEn ? "Get a weekly summary of training progress" : "Recevez un résumé hebdomadaire de la progression de formation",
    complianceAlerts: isEn ? "Compliance Alerts" : "Alertes de conformité",
    complianceAlertsSub: isEn ? "Be notified when compliance deadlines approach" : "Soyez notifié lorsque les échéances de conformité approchent",
  };

  const filters: { key: NotifFilter; label: string; icon: string }[] = [
    { key: "all", label: ui.all, icon: "notifications" },
    { key: "training", label: ui.training, icon: "school" },
    { key: "compliance", label: ui.compliance, icon: "verified" },
    { key: "system", label: ui.system, icon: "settings" },
  ];

  return (
    <HRLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{ui.subtitle}</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-[var(--color-blue-700, #1d4ed8)] font-medium transition-colors">
            {ui.markAllRead}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="material-icons text-lg">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-3xl text-blue-600">notifications_none</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{ui.noNotifications}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">{ui.noNotificationsSub}</p>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="material-icons text-blue-600">tune</span>
            {ui.preferences}
          </h3>
          <div className="space-y-4">
            {[
              { label: ui.emailAlerts, sub: ui.emailAlertsSub, icon: "email" },
              { label: ui.weeklyDigest, sub: ui.weeklyDigestSub, icon: "summarize" },
              { label: ui.complianceAlerts, sub: ui.complianceAlertsSub, icon: "warning" },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <span className="material-icons text-blue-600">{pref.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                    <p className="text-xs text-gray-500">{pref.sub}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}

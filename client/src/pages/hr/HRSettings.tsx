/**
 * HRSettings — Settings for Client Portal
 * Manage portal preferences, team access, and integrations.
 */
import HRLayout from "@/components/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function HRSettings() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const ui = {
    title: isEn ? "Settings" : "Paramètres",
    subtitle: isEn ? "Manage your portal preferences and team access" : "Gérez vos préférences de portail et l'accès de l'équipe",
    portalPreferences: isEn ? "Portal Preferences" : "Préférences du portail",
    language: isEn ? "Language" : "Langue",
    languageSub: isEn ? "Set the default language for your portal" : "Définir la langue par défaut de votre portail",
    timezone: isEn ? "Timezone" : "Fuseau horaire",
    timezoneSub: isEn ? "Set the timezone for scheduling and reports" : "Définir le fuseau horaire pour la planification et les rapports",
    teamAccess: isEn ? "Team Access" : "Accès de l'équipe",
    teamAccessSub: isEn ? "Manage who can access the HR portal" : "Gérer qui peut accéder au portail RH",
    inviteMember: isEn ? "Invite Team Member" : "Inviter un membre de l'équipe",
    integrations: isEn ? "Integrations" : "Intégrations",
    integrationsSub: isEn ? "Connect external tools and services" : "Connecter des outils et services externes",
    lms: isEn ? "LMS Integration" : "Intégration LMS",
    lmsSub: isEn ? "Connect your organization's Learning Management System" : "Connecter le système de gestion de l'apprentissage de votre organisation",
    sso: isEn ? "Single Sign-On (SSO)" : "Authentification unique (SSO)",
    ssoSub: isEn ? "Enable SSO for seamless authentication" : "Activer l'authentification unique pour une connexion transparente",
    comingSoon: isEn ? "Coming soon" : "Bientôt disponible",
    save: isEn ? "Save Changes" : "Enregistrer les modifications",
    dataExport: isEn ? "Data Export" : "Exportation de données",
    dataExportSub: isEn ? "Export all your organization's training data" : "Exporter toutes les données de formation de votre organisation",
    requestExport: isEn ? "Request Export" : "Demander l'exportation",
  };

  return (
    <HRLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{ui.subtitle}</p>
        </div>

        {/* Portal Preferences */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-icons text-[#2563eb]">tune</span>
            {ui.portalPreferences}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{ui.language}</p>
                <p className="text-xs text-gray-500">{ui.languageSub}</p>
              </div>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]">
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{ui.timezone}</p>
                <p className="text-xs text-gray-500">{ui.timezoneSub}</p>
              </div>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]">
                <option value="America/Toronto">Eastern Time (ET)</option>
                <option value="America/Winnipeg">Central Time (CT)</option>
                <option value="America/Edmonton">Mountain Time (MT)</option>
                <option value="America/Vancouver">Pacific Time (PT)</option>
                <option value="America/Halifax">Atlantic Time (AT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Access */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="material-icons text-[#2563eb]">group</span>
              {ui.teamAccess}
            </h3>
            <button
              onClick={() => toast.info(isEn ? "Team invitation coming soon" : "Invitation d'équipe bientôt disponible")}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#2563eb] bg-[#2563eb]/10 rounded-lg hover:bg-[#2563eb]/20 transition-colors"
            >
              <span className="material-icons text-sm">person_add</span>
              {ui.inviteMember}
            </button>
          </div>
          <p className="text-sm text-gray-500">{ui.teamAccessSub}</p>
          <div className="mt-4 p-8 text-center border border-dashed border-gray-200 rounded-lg">
            <span className="material-icons text-3xl text-gray-300 mb-2">group_add</span>
            <p className="text-sm text-gray-400">{ui.comingSoon}</p>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-icons text-[#2563eb]">extension</span>
            {ui.integrations}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{ui.integrationsSub}</p>
          <div className="space-y-3">
            {[
              { label: ui.lms, sub: ui.lmsSub, icon: "school" },
              { label: ui.sso, sub: ui.ssoSub, icon: "vpn_key" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="material-icons text-gray-500">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{ui.comingSoon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span className="material-icons text-[#2563eb]">cloud_download</span>
            {ui.dataExport}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{ui.dataExportSub}</p>
          <button
            onClick={() => toast.info(isEn ? "Data export request submitted" : "Demande d'exportation de données soumise")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="material-icons text-sm">download</span>
            {ui.requestExport}
          </button>
        </div>
      </div>
    </HRLayout>
  );
}

/**
 * HRHelp — Support & Help Center for Client Portal
 * Provides FAQ, contact support, and resource links.
 */
import HRLayout from "@/components/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function HRHelp() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ui = {
    title: isEn ? "Help & Support" : "Aide et support",
    subtitle: isEn ? "Find answers, resources, and contact our support team" : "Trouvez des réponses, des ressources et contactez notre équipe de support",
    faq: isEn ? "Frequently Asked Questions" : "Questions fréquemment posées",
    contactSupport: isEn ? "Contact Support" : "Contacter le support",
    contactSub: isEn ? "Our team is available Monday to Friday, 9 AM to 5 PM ET" : "Notre équipe est disponible du lundi au vendredi, de 9h à 17h HE",
    email: isEn ? "Email Support" : "Support par courriel",
    phone: isEn ? "Phone Support" : "Support téléphonique",
    resources: isEn ? "Resources" : "Ressources",
    trainingGuide: isEn ? "Training Manager Guide" : "Guide du gestionnaire de formation",
    trainingGuideSub: isEn ? "Complete guide to managing your organization's training programs" : "Guide complet pour gérer les programmes de formation de votre organisation",
    complianceGuide: isEn ? "SLE Compliance Guide" : "Guide de conformité ELS",
    complianceGuideSub: isEn ? "Understanding SLE requirements and compliance tracking" : "Comprendre les exigences ELS et le suivi de la conformité",
    apiDocs: isEn ? "API Documentation" : "Documentation API",
    apiDocsSub: isEn ? "Technical documentation for integrations" : "Documentation technique pour les intégrations",
    viewGuide: isEn ? "View Guide" : "Voir le guide",
    comingSoon: isEn ? "Coming soon" : "Bientôt disponible",
  };

  const faqs = isEn ? [
    { q: "How do I add participants to my organization?", a: "Navigate to the Participants page and click 'Invite Participant'. You can invite by email or import a CSV file of participants." },
    { q: "How do I create a training cohort?", a: "Go to Training Cohorts, click 'Create Cohort', and assign participants. You can set start/end dates and assign specific courses." },
    { q: "How do I track SLE compliance?", a: "The SLE Compliance page shows real-time compliance status for all participants. You can filter by level (A, B, C) and skill (Oral, Written, Reading)." },
    { q: "How do I export reports?", a: "Visit the Reports & Analytics page and use the Export CSV or Export PDF buttons. You can customize the date range and report type." },
    { q: "How do I manage billing?", a: "The Billing & Budget page shows your current contract, invoices, and usage. Contact your account manager for contract changes." },
  ] : [
    { q: "Comment ajouter des participants à mon organisation ?", a: "Accédez à la page Participants et cliquez sur « Inviter un participant ». Vous pouvez inviter par courriel ou importer un fichier CSV de participants." },
    { q: "Comment créer une cohorte de formation ?", a: "Allez dans Cohortes de formation, cliquez sur « Créer une cohorte » et assignez des participants. Vous pouvez définir des dates de début/fin et assigner des cours spécifiques." },
    { q: "Comment suivre la conformité ELS ?", a: "La page Conformité ELS affiche l'état de conformité en temps réel pour tous les participants. Vous pouvez filtrer par niveau (A, B, C) et compétence (Oral, Écrit, Lecture)." },
    { q: "Comment exporter des rapports ?", a: "Visitez la page Rapports et analyses et utilisez les boutons Exporter CSV ou Exporter PDF. Vous pouvez personnaliser la période et le type de rapport." },
    { q: "Comment gérer la facturation ?", a: "La page Facturation et budget affiche votre contrat actuel, vos factures et votre utilisation. Contactez votre gestionnaire de compte pour les modifications de contrat." },
  ];

  return (
    <HRLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{ui.subtitle}</p>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/15 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
            <span className="material-icons text-blue-600">help_outline</span>
            {ui.faq}
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 dark:border-white/15 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                  <span className={`material-icons text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 dark:border-white/15 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/15 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2 flex items-center gap-2">
            <span className="material-icons text-blue-600">support_agent</span>
            {ui.contactSupport}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{ui.contactSub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="mailto:support@rusingacademy.com" className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 dark:border-white/15 hover:bg-blue-600/5 hover:border-blue-600/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <span className="material-icons text-blue-600">email</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{ui.email}</p>
                <p className="text-xs text-blue-600">support@rusingacademy.com</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 flex items-center justify-center">
                <span className="material-icons text-gray-500">phone</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{ui.phone}</p>
                <p className="text-xs text-gray-400">{ui.comingSoon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/15 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
            <span className="material-icons text-blue-600">menu_book</span>
            {ui.resources}
          </h3>
          <div className="space-y-3">
            {[
              { label: ui.trainingGuide, sub: ui.trainingGuideSub, icon: "school" },
              { label: ui.complianceGuide, sub: ui.complianceGuideSub, icon: "verified" },
              { label: ui.apiDocs, sub: ui.apiDocsSub, icon: "code" },
            ].map((res, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-white/15 hover:bg-gray-50 dark:bg-white/[0.08] dark:backdrop-blur-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                    <span className="material-icons text-blue-600">{res.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{res.label}</p>
                    <p className="text-xs text-gray-500">{res.sub}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-white/[0.08] dark:backdrop-blur-md dark:border-white/15 px-2 py-1 rounded-full">{ui.comingSoon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRLayout>
  );
}

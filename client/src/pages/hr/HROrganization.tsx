/**
 * HROrganization — Organization Profile for Client Portal
 * Shows department info, contract details, and admin contacts.
 */
import HRLayout from "@/components/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function HROrganization() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const { data: org, isLoading } = trpc.hr.getMyOrganization.useQuery();

  const ui = {
    title: isEn ? "Organization Profile" : "Profil de l'organisation",
    subtitle: isEn ? "Manage your department information and training contract" : "Gérez les informations de votre département et votre contrat de formation",
    departmentInfo: isEn ? "Department Information" : "Informations du département",
    orgName: isEn ? "Organization Name" : "Nom de l'organisation",
    domain: isEn ? "Domain" : "Domaine",
    sector: isEn ? "Sector" : "Secteur",
    publicService: isEn ? "Federal Public Service" : "Fonction publique fédérale",
    contractDetails: isEn ? "Contract Details" : "Détails du contrat",
    contractStatus: isEn ? "Contract Status" : "Statut du contrat",
    active: isEn ? "Active" : "Actif",
    startDate: isEn ? "Start Date" : "Date de début",
    renewalDate: isEn ? "Renewal Date" : "Date de renouvellement",
    seatsIncluded: isEn ? "Seats Included" : "Places incluses",
    adminContacts: isEn ? "Administrative Contacts" : "Contacts administratifs",
    primaryContact: isEn ? "Primary Contact" : "Contact principal",
    billingContact: isEn ? "Billing Contact" : "Contact de facturation",
    editProfile: isEn ? "Edit Profile" : "Modifier le profil",
    noOrg: isEn ? "No organization found" : "Aucune organisation trouvée",
    noOrgSub: isEn ? "Your organization profile will be set up by your RusingÂcademy account manager." : "Le profil de votre organisation sera configuré par votre gestionnaire de compte RusingÂcademy.",
    contactSupport: isEn ? "Contact Support" : "Contacter le support",
  };

  if (isLoading) {
    return (
      <HRLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-100 rounded-xl w-1/3" />
            <div className="h-64 bg-gray-100 rounded-xl" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ui.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{ui.subtitle}</p>
          </div>
          <button
            onClick={() => toast.info(isEn ? "Opening profile editor..." : "Ouverture de l'éditeur de profil...")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="material-icons text-sm">edit</span>
            {ui.editProfile}
          </button>
        </div>

        {org ? (
          <>
            {/* Department Information */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-icons text-blue-600">business</span>
                {ui.departmentInfo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">{ui.orgName}</p>
                  <p className="text-sm font-semibold text-gray-900">{org.name || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">{ui.domain}</p>
                  <p className="text-sm font-semibold text-gray-900">{org.domain || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">{ui.sector}</p>
                  <p className="text-sm font-semibold text-gray-900">{ui.publicService}</p>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-icons text-blue-600">description</span>
                {ui.contractDetails}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-xs text-gray-500 mb-1">{ui.contractStatus}</p>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-green-600 text-lg">check_circle</span>
                    <p className="text-sm font-semibold text-green-700">{ui.active}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">{ui.seatsIncluded}</p>
                  <p className="text-sm font-semibold text-gray-900">—</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-lg md:text-2xl lg:text-3xl text-blue-600">business</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{ui.noOrg}</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">{ui.noOrgSub}</p>
            <a href="mailto:support@rusingacademy.com" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <span className="material-icons text-sm">support_agent</span>
              {ui.contactSupport}
            </a>
          </div>
        )}
      </div>
    </HRLayout>
  );
}

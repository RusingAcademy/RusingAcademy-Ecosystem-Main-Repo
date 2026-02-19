// client/src/i18n/admin-translations.ts — Phase 4: Extended admin/HR translations
// These are merged into the main translation files

export const adminTranslationsEn = {
  admin: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Platform overview",
      kpis: {
        totalUsers: "Total Users",
        activeUsers: "Active Users",
        revenue: "Revenue",
        courses: "Courses",
        sessions: "Sessions",
      },
    },
    users: {
      title: "User Management",
      table: { name: "Name", email: "Email", role: "Role", status: "Status", createdAt: "Created", actions: "Actions" },
      filters: { search: "Search...", role: "Filter by role", status: "Filter by status" },
      actions: { edit: "Edit", delete: "Delete", suspend: "Suspend", activate: "Activate" },
      dialogs: { deleteConfirm: "Are you sure you want to delete this user?", suspendConfirm: "Are you sure you want to suspend this user?" },
    },
    courses: {
      title: "Course Management",
      createNew: "Create Course",
      table: { title: "Title", instructor: "Instructor", students: "Students", status: "Status", price: "Price" },
    },
    featureFlags: {
      title: "Feature Flags",
      subtitle: "Enable/disable features",
      table: { name: "Name", description: "Description", enabled: "Enabled", environment: "Environment", updatedAt: "Updated" },
      create: "Create Flag",
      edit: "Edit",
      environments: { all: "All", development: "Development", staging: "Staging", production: "Production" },
    },
    monitoring: {
      title: "Monitoring",
      subtitle: "Platform monitoring",
      tabs: { overview: "Overview", errors: "Errors", performance: "Performance", users: "User Sessions" },
      metrics: { errorRate: "Error Rate", responseTime: "Response Time", uptime: "Uptime", activeUsers: "Active Users" },
    },
    common: {
      save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit", create: "Create",
      search: "Search", filter: "Filter", export: "Export", import: "Import",
      loading: "Loading...", noData: "No data", error: "An error occurred", success: "Operation successful",
      confirm: "Confirm", yes: "Yes", no: "No",
    },
  },
  hr: {
    reports: {
      title: "HR Reports",
      generate: "Generate Report",
      history: "Report History",
      types: {
        candidates: "Candidate Report",
        interviews: "Interview Report",
        onboarding: "Onboarding Report",
        compliance: "Compliance Report",
        team: "Team Report",
      },
      dateRange: { start: "Start Date", end: "End Date" },
      download: "Download",
      generating: "Generating...",
      success: "Report generated successfully!",
      noReports: "No reports generated yet",
    },
    compliance: {
      title: "Compliance",
      rate: "Compliance Rate",
      requirements: "Requirements",
      issues: "Issues",
    },
  },
};

export const adminTranslationsFr = {
  admin: {
    dashboard: {
      title: "Tableau de bord",
      subtitle: "Vue d'ensemble de la plateforme",
      kpis: {
        totalUsers: "Utilisateurs totaux",
        activeUsers: "Utilisateurs actifs",
        revenue: "Revenus",
        courses: "Cours",
        sessions: "Sessions",
      },
    },
    users: {
      title: "Gestion des utilisateurs",
      table: { name: "Nom", email: "Courriel", role: "Rôle", status: "Statut", createdAt: "Créé le", actions: "Actions" },
      filters: { search: "Rechercher...", role: "Filtrer par rôle", status: "Filtrer par statut" },
      actions: { edit: "Modifier", delete: "Supprimer", suspend: "Suspendre", activate: "Activer" },
      dialogs: { deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?", suspendConfirm: "Êtes-vous sûr de vouloir suspendre cet utilisateur ?" },
    },
    courses: {
      title: "Gestion des cours",
      createNew: "Créer un cours",
      table: { title: "Titre", instructor: "Instructeur", students: "Étudiants", status: "Statut", price: "Prix" },
    },
    featureFlags: {
      title: "Feature Flags",
      subtitle: "Activer/désactiver les fonctionnalités",
      table: { name: "Nom", description: "Description", enabled: "Activé", environment: "Environnement", updatedAt: "Mis à jour" },
      create: "Créer un flag",
      edit: "Modifier",
      environments: { all: "Tous", development: "Développement", staging: "Staging", production: "Production" },
    },
    monitoring: {
      title: "Surveillance",
      subtitle: "Surveillance de la plateforme",
      tabs: { overview: "Vue d'ensemble", errors: "Erreurs", performance: "Performance", users: "Sessions utilisateurs" },
      metrics: { errorRate: "Taux d'erreur", responseTime: "Temps de réponse", uptime: "Disponibilité", activeUsers: "Utilisateurs actifs" },
    },
    common: {
      save: "Enregistrer", cancel: "Annuler", delete: "Supprimer", edit: "Modifier", create: "Créer",
      search: "Rechercher", filter: "Filtrer", export: "Exporter", import: "Importer",
      loading: "Chargement...", noData: "Aucune donnée", error: "Une erreur est survenue", success: "Opération réussie",
      confirm: "Confirmer", yes: "Oui", no: "Non",
    },
  },
  hr: {
    reports: {
      title: "Rapports RH",
      generate: "Générer un rapport",
      history: "Historique des rapports",
      types: {
        candidates: "Rapport des candidats",
        interviews: "Rapport des entrevues",
        onboarding: "Rapport d'intégration",
        compliance: "Rapport de conformité",
        team: "Rapport d'équipe",
      },
      dateRange: { start: "Date début", end: "Date fin" },
      download: "Télécharger",
      generating: "Génération...",
      success: "Rapport généré avec succès !",
      noReports: "Aucun rapport généré",
    },
    compliance: {
      title: "Conformité",
      rate: "Taux de conformité",
      requirements: "Exigences",
      issues: "Problèmes",
    },
  },
};

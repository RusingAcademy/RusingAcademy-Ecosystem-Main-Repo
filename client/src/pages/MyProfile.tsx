/**
 * RusingAcademy Learning Portal — My Profile Page (Sprint H1)
 * Fully database-driven, bilingual, WCAG 2.1 AA accessible
 * Sections: Personal Info, SLE Levels, Learning Goals, Certification, Preferences
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const SLE_LEVELS = ["X", "A", "B", "C"] as const;
const FOCUS_OPTIONS = ["oral", "written", "reading", "all"] as const;
const DEPARTMENTS = [
  "Treasury Board Secretariat", "Employment and Social Development Canada",
  "Immigration, Refugees and Citizenship Canada", "Canada Revenue Agency",
  "Public Services and Procurement Canada", "National Defence",
  "Health Canada", "Transport Canada", "Innovation, Science and Economic Development",
  "Global Affairs Canada", "Environment and Climate Change Canada",
  "Indigenous Services Canada", "Justice Canada", "Other",
];

const ui = {
  en: {
    title: "My Profile",
    back: "Dashboard",
    personal: "Personal Information",
    name: "Full Name",
    email: "Email",
    department: "Department",
    position: "Position / Title",
    sleLevels: "SLE Proficiency Levels",
    currentLevels: "Current Levels",
    targetLevels: "Target Levels",
    reading: "Reading",
    writing: "Writing",
    oral: "Oral",
    learningGoals: "Learning Goals",
    goals: "Your Learning Goals",
    goalsPlaceholder: "Describe your language learning objectives...",
    primaryFocus: "Primary Focus",
    focusLabels: { oral: "Oral Communication", written: "Written Expression", reading: "Reading Comprehension", all: "All Skills" },
    targetLanguage: "Target Language",
    french: "French", english: "English",
    schedule: "Study Schedule",
    weeklyHours: "Weekly Study Hours",
    examDate: "Target Exam Date",
    certification: "SLE Certification",
    certDate: "Last Certification Date",
    certExpiry: "Certification Expiry",
    certLevel: "Certified Level",
    noCert: "No certification on file",
    preferences: "Preferences",
    prefLang: "Interface Language",
    weeklyReport: "Weekly Progress Report",
    save: "Save Changes",
    saving: "Saving...",
    saved: "Profile saved successfully!",
    error: "Error saving profile",
    loading: "Loading profile...",
    noProfile: "No profile found. Complete onboarding to get started.",
    startOnboarding: "Start Onboarding",
    editMode: "Edit",
    viewMode: "View",
    hoursPerWeek: "hours/week",
    notSet: "Not set",
    daysUntilExpiry: "days until expiry",
    expired: "Expired",
    valid: "Valid",
  },
  fr: {
    title: "Mon profil",
    back: "Tableau de bord",
    personal: "Informations personnelles",
    name: "Nom complet",
    email: "Courriel",
    department: "Ministère",
    position: "Poste / Titre",
    sleLevels: "Niveaux de compétence ELS",
    currentLevels: "Niveaux actuels",
    targetLevels: "Niveaux cibles",
    reading: "Compréhension de l'écrit",
    writing: "Expression écrite",
    oral: "Interaction orale",
    learningGoals: "Objectifs d'apprentissage",
    goals: "Vos objectifs d'apprentissage",
    goalsPlaceholder: "Décrivez vos objectifs d'apprentissage linguistique...",
    primaryFocus: "Priorité principale",
    focusLabels: { oral: "Communication orale", written: "Expression écrite", reading: "Compréhension de l'écrit", all: "Toutes les compétences" },
    targetLanguage: "Langue cible",
    french: "Français", english: "Anglais",
    schedule: "Horaire d'étude",
    weeklyHours: "Heures d'étude par semaine",
    examDate: "Date d'examen cible",
    certification: "Certification ELS",
    certDate: "Dernière date de certification",
    certExpiry: "Expiration de la certification",
    certLevel: "Niveau certifié",
    noCert: "Aucune certification au dossier",
    preferences: "Préférences",
    prefLang: "Langue de l'interface",
    weeklyReport: "Rapport de progrès hebdomadaire",
    save: "Enregistrer",
    saving: "Enregistrement...",
    saved: "Profil enregistré avec succès !",
    error: "Erreur lors de l'enregistrement",
    loading: "Chargement du profil...",
    noProfile: "Aucun profil trouvé. Complétez l'intégration pour commencer.",
    startOnboarding: "Commencer l'intégration",
    editMode: "Modifier",
    viewMode: "Voir",
    hoursPerWeek: "heures/semaine",
    notSet: "Non défini",
    daysUntilExpiry: "jours avant l'expiration",
    expired: "Expiré",
    valid: "Valide",
  },
};

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    X: "bg-gray-100 text-gray-600 border-gray-300",
    A: "bg-blue-50 text-blue-700 border-blue-300",
    B: "bg-emerald-50 text-emerald-700 border-emerald-300",
    C: "bg-amber-50 text-amber-700 border-amber-300",
  };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border font-bold text-sm ${colors[level] || colors.X}`}>
      {level}
    </span>
  );
}

export default function MyProfile() {
  const { language: lang } = useLanguage();
  const t = ui[lang] || ui.en;

  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [currentReading, setCurrentReading] = useState("X");
  const [currentWriting, setCurrentWriting] = useState("X");
  const [currentOral, setCurrentOral] = useState("X");
  const [targetReading, setTargetReading] = useState("B");
  const [targetWriting, setTargetWriting] = useState("B");
  const [targetOral, setTargetOral] = useState("B");
  const [learningGoals, setLearningGoals] = useState("");
  const [primaryFocus, setPrimaryFocus] = useState<string>("oral");
  const [targetLanguage, setTargetLanguage] = useState<string>("french");
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(5);
  const [examDate, setExamDate] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<string>("en");

  // Queries
  const profileQuery = trpc.learner.getProfile.useQuery();
  const onboardingQuery = trpc.learner.getOnboardingStatus.useQuery();
  const certQuery = trpc.learner.getCertificationStatus.useQuery();

  const updateProfile = trpc.learner.updateProfile.useMutation({
    onSuccess: () => {
      toast.success(t.saved);
      setIsEditing(false);
      profileQuery.refetch();
    },
    onError: () => {
      toast.error(t.error);
    },
  });

  // Populate form from profile data
  useEffect(() => {
    if (profileQuery.data) {
      const p = profileQuery.data;
      setName(p.name || "");
      setDepartment(p.department || "");
      setPosition(p.position || "");
      setTargetLanguage(p.targetLanguage || "french");
      setPrimaryFocus(p.primaryFocus || "oral");
      setLearningGoals(p.learningGoals || "");
      setWeeklyStudyHours(Number(p.weeklyStudyHours) || 5);
      setExamDate(p.examDate ? new Date(p.examDate).toISOString().split("T")[0] : "");

      // Parse JSON level fields
      try {
        const cl = typeof p.currentLevel === "string" ? JSON.parse(p.currentLevel) : p.currentLevel;
        if (cl) { setCurrentReading(cl.reading || "X"); setCurrentWriting(cl.writing || "X"); setCurrentOral(cl.oral || "X"); }
      } catch { /* keep defaults */ }
      try {
        const tl = typeof p.targetLevel === "string" ? JSON.parse(p.targetLevel) : p.targetLevel;
        if (tl) { setTargetReading(tl.reading || "B"); setTargetWriting(tl.writing || "B"); setTargetOral(tl.oral || "B"); }
      } catch { /* keep defaults */ }
    }
  }, [profileQuery.data]);

  const handleSave = () => {
    updateProfile.mutate({
      name: name || undefined,
      department: department || undefined,
      position: position || undefined,
      targetLanguage: targetLanguage as "french" | "english",
      primaryFocus: primaryFocus as "oral" | "written" | "reading" | "all",
      currentLevel: { reading: currentReading, writing: currentWriting, oral: currentOral },
      targetLevel: { reading: targetReading, writing: targetWriting, oral: targetOral },
      learningGoals: learningGoals || undefined,
      weeklyStudyHours: weeklyStudyHours,
      examDate: examDate || undefined,
      preferredLanguage: preferredLanguage as "en" | "fr",
    });
  };

  if (profileQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="animate-spin w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-500">{t.loading}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileQuery.data && onboardingQuery.data && !onboardingQuery.data.completed) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md">
            <span className="material-icons text-teal-700 text-5xl">person_add</span>
            <h2 className="text-xl font-bold text-gray-900">{t.noProfile}</h2>
            <Link href="/onboarding">
              <button className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors">
                {t.startOnboarding}
              </button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const profile = profileQuery.data;
  const cert = certQuery.data;

  return (
    <DashboardLayout>
      <div className="max-w-[960px] mx-auto" role="main" aria-label={t.title}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-gray-400 hover:text-teal-700 transition-colors" aria-label={t.back}>
              <span className="material-icons text-xl">navigate_before</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.title}
            </h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditing
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-teal-700/10 text-teal-700 hover:bg-teal-700/20"
            }`}
            aria-label={isEditing ? t.viewMode : t.editMode}
          >
            <span className="material-icons text-base">{isEditing ? "visibility" : "edit"}</span>
            {isEditing ? t.viewMode : t.editMode}
          </button>
        </div>

        <div className="space-y-6">
          {/* ── Personal Information ── */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden" aria-labelledby="section-personal">
            <div className="bg-[rgba(0,128,144,0.08)] px-6 py-3">
              <h2 id="section-personal" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-teal-700 text-lg">person</span>
                {t.personal}
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">{t.name}</label>
                      {isEditing ? (
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                          aria-label={t.name} />
                      ) : (
                        <p className="text-sm text-gray-800 py-2">{name || t.notSet}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">{t.email}</label>
                      <p className="text-sm text-gray-800 py-2">{profile?.email || t.notSet}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">{t.department}</label>
                      {isEditing ? (
                        <select value={department} onChange={(e) => setDepartment(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                          aria-label={t.department}>
                          <option value="">—</option>
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-800 py-2">{department || t.notSet}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">{t.position}</label>
                      {isEditing ? (
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                          aria-label={t.position} />
                      ) : (
                        <p className="text-sm text-gray-800 py-2">{position || t.notSet}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Avatar */}
                <div className="w-full lg:w-[160px] flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-700/20 to-teal-700/5 flex items-center justify-center mb-2 border-2 border-teal-700/20">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="material-icons text-teal-700 text-4xl">person</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">{profile?.email}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── SLE Proficiency Levels ── */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden" aria-labelledby="section-sle">
            <div className="bg-[rgba(0,128,144,0.08)] px-6 py-3">
              <h2 id="section-sle" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-teal-700 text-lg">assessment</span>
                {t.sleLevels}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Levels */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t.currentLevels}</h3>
                  <div className="space-y-3">
                    {([["reading", currentReading, setCurrentReading, t.reading],
                       ["writing", currentWriting, setCurrentWriting, t.writing],
                       ["oral", currentOral, setCurrentOral, t.oral]] as const).map(([key, val, setter, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        {isEditing ? (
                          <div className="flex gap-1">
                            {SLE_LEVELS.map((lvl) => (
                              <button key={lvl} onClick={() => (setter as (v: string) => void)(lvl)}
                                className={`w-8 h-8 rounded-full text-xs font-bold border transition-all ${
                                  val === lvl ? "bg-teal-700 text-white border-teal-700" : "bg-white text-gray-500 border-gray-300 hover:border-teal-700"
                                }`} aria-label={`${label}: ${lvl}`}>
                                {lvl}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <LevelBadge level={val} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Target Levels */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t.targetLevels}</h3>
                  <div className="space-y-3">
                    {([["reading", targetReading, setTargetReading, t.reading],
                       ["writing", targetWriting, setTargetWriting, t.writing],
                       ["oral", targetOral, setTargetOral, t.oral]] as const).map(([key, val, setter, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        {isEditing ? (
                          <div className="flex gap-1">
                            {SLE_LEVELS.map((lvl) => (
                              <button key={lvl} onClick={() => (setter as (v: string) => void)(lvl)}
                                className={`w-8 h-8 rounded-full text-xs font-bold border transition-all ${
                                  val === lvl ? "bg-teal-700 text-white border-teal-700" : "bg-white text-gray-500 border-gray-300 hover:border-teal-700"
                                }`} aria-label={`${label}: ${lvl}`}>
                                {lvl}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <LevelBadge level={val} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Learning Goals ── */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden" aria-labelledby="section-goals">
            <div className="bg-[rgba(0,128,144,0.08)] px-6 py-3">
              <h2 id="section-goals" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-teal-700 text-lg">flag</span>
                {t.learningGoals}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t.goals}</label>
                {isEditing ? (
                  <textarea value={learningGoals} onChange={(e) => setLearningGoals(e.target.value)}
                    rows={3} placeholder={t.goalsPlaceholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 resize-none"
                    aria-label={t.goals} />
                ) : (
                  <p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{learningGoals || t.notSet}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t.primaryFocus}</label>
                  {isEditing ? (
                    <select value={primaryFocus} onChange={(e) => setPrimaryFocus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                      aria-label={t.primaryFocus}>
                      {FOCUS_OPTIONS.map((f) => (
                        <option key={f} value={f}>{t.focusLabels[f]}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-800 py-2">{t.focusLabels[primaryFocus as keyof typeof t.focusLabels] || t.notSet}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t.targetLanguage}</label>
                  {isEditing ? (
                    <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                      aria-label={t.targetLanguage}>
                      <option value="french">{t.french}</option>
                      <option value="english">{t.english}</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-800 py-2">{targetLanguage === "french" ? t.french : t.english}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t.weeklyHours}</label>
                  {isEditing ? (
                    <input type="number" min={1} max={40} value={weeklyStudyHours}
                      onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                      aria-label={t.weeklyHours} />
                  ) : (
                    <p className="text-sm text-gray-800 py-2">{weeklyStudyHours} {t.hoursPerWeek}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t.examDate}</label>
                {isEditing ? (
                  <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                    aria-label={t.examDate} />
                ) : (
                  <p className="text-sm text-gray-800 py-2">{examDate || t.notSet}</p>
                )}
              </div>
            </div>
          </section>

          {/* ── SLE Certification ── */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden" aria-labelledby="section-cert">
            <div className="bg-[rgba(0,128,144,0.08)] px-6 py-3">
              <h2 id="section-cert" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-teal-700 text-lg">verified</span>
                {t.certification}
              </h2>
            </div>
            <div className="p-6">
              {cert && cert.hasCertification ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{t.certDate}</label>
                    <p className="text-sm text-gray-800">{cert.certificationDate ? new Date(cert.certificationDate).toLocaleDateString() : "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{t.certExpiry}</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-800">{cert.certificationExpiry ? new Date(cert.certificationExpiry).toLocaleDateString() : "—"}</p>
                      {cert.isExpired ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">{t.expired}</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">{t.valid}</span>
                      )}
                    </div>
                    {cert.daysUntilExpiry && !cert.isExpired && (
                      <p className="text-xs text-gray-400 mt-0.5">{cert.daysUntilExpiry} {t.daysUntilExpiry}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{t.certLevel}</label>
                    <div className="flex gap-2 items-center">
                      {cert.certifiedLevel && typeof cert.certifiedLevel === "object" && (
                        <>
                          <span className="text-xs text-gray-500">{t.reading}:</span>
                          <LevelBadge level={(cert.certifiedLevel as any).reading || "X"} />
                          <span className="text-xs text-gray-500">{t.writing}:</span>
                          <LevelBadge level={(cert.certifiedLevel as any).writing || "X"} />
                          <span className="text-xs text-gray-500">{t.oral}:</span>
                          <LevelBadge level={(cert.certifiedLevel as any).oral || "X"} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="material-icons text-gray-300">info</span>
                  <p className="text-sm">{t.noCert}</p>
                </div>
              )}
            </div>
          </section>

          {/* ── Preferences ── */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden" aria-labelledby="section-prefs">
            <div className="bg-[rgba(0,128,144,0.08)] px-6 py-3">
              <h2 id="section-prefs" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-teal-700 text-lg">settings</span>
                {t.preferences}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t.prefLang}</label>
                  {isEditing ? (
                    <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700"
                      aria-label={t.prefLang}>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-800 py-2">{preferredLanguage === "fr" ? "Français" : "English"}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Save Button ── */}
          {isEditing && (
            <div className="flex justify-end gap-3 pb-8">
              <button onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                {t.viewMode}
              </button>
              <button onClick={handleSave} disabled={updateProfile.isPending}
                className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                aria-label={t.save}>
                {updateProfile.isPending && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                {updateProfile.isPending ? t.saving : t.save}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

import SEO from "@/components/SEO";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Video, 
  Award,
  ChevronRight,
  Globe,
  Mic,
  FileText,
  Download,
  ExternalLink,
  Clock,
  MapPin,
  Star,
  Heart,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Shield
} from "lucide-react";
import Footer from "@/components/Footer";

// Icon mapping for forum categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "💬": MessageSquare,
  "🏆": Award,
  "🎤": Mic,
  "⭐": Star,
};

// Resources data (static for now)
const resources = [
  {
    id: 1,
    type: "guide",
    title: { en: "Complete SLE Exam Guide 2026", fr: "Guide complet des examens ELS 2026" },
    description: { en: "Everything you need to know about SLE reading, writing, and oral exams", fr: "Tout ce que vous devez savoir sur les examens ELS de lecture, d'écriture et oraux" },
    format: "PDF",
    size: "2.4 MB",
    downloads: 1234,
    icon: FileText,
    color: "#17E2C6"
  },
  {
    id: 2,
    type: "video",
    title: { en: "Oral Exam Mock Interview Series", fr: "Série d'entrevues simulées pour l'examen oral" },
    description: { en: "Watch real mock interviews with expert feedback and analysis", fr: "Regardez de vraies entrevues simulées avec des commentaires et analyses d'experts" },
    format: "Video Series",
    duration: "3h 45m",
    views: 5678,
    icon: Video,
    color: "#3C5759"
  },
  {
    id: 3,
    type: "template",
    title: { en: "French Email Templates for Government", fr: "Modèles de courriels français pour le gouvernement" },
    description: { en: "Professional email templates for common workplace scenarios", fr: "Modèles de courriels professionnels pour les scénarios de travail courants" },
    format: "DOCX",
    size: "156 KB",
    downloads: 892,
    icon: FileText,
    color: "#D4AF37"
  },
  {
    id: 4,
    type: "podcast",
    title: { en: "Bilingual Leadership Podcast", fr: "Balado Leadership bilingue" },
    description: { en: "Weekly episodes featuring successful bilingual leaders in the public service", fr: "Épisodes hebdomadaires mettant en vedette des leaders bilingues à succès dans la fonction publique" },
    format: "Podcast",
    episodes: 45,
    subscribers: 2341,
    icon: Mic,
    color: "#8B5CFF"
  }
];

// Community stats
const communityStats = [
  { value: "5,200+", label: { en: "Active Members", fr: "Membres actifs" }, icon: Users },
  { value: "850+", label: { en: "SLE Success Stories", fr: "Réussites ELS" }, icon: TrendingUp },
  { value: "120+", label: { en: "Events Hosted", fr: "Événements organisés" }, icon: Calendar },
  { value: "15,000+", label: { en: "Resources Downloaded", fr: "Ressources téléchargées" }, icon: Download }
];

export default function Community() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"events" | "forum" | "resources">("events");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState<Record<number, "idle" | "loading" | "success" | "error">>({});

  // Fetch real data from API
  const { data: user } = trpc.auth.me.useQuery();
  const { data: forumCategories, isLoading: categoriesLoading } = trpc.forum.categories.useQuery();
  const { data: events, isLoading: eventsLoading } = trpc.events.list.useQuery();
  
  // Mutations
  const createThreadMutation = trpc.forum.createThread.useMutation();
  const registerEventMutation = trpc.events.register.useMutation();
  const utils = trpc.useUtils();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop": return "#17E2C6";
      case "networking": return "#D4AF37";
      case "practice": return "#3C5759";
      case "info_session": return "#8B5CFF";
      case "webinar": return "#FF6B6B";
      default: return "#17E2C6";
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      workshop: { en: "Workshop", fr: "Atelier" },
      networking: { en: "Networking", fr: "Réseautage" },
      practice: { en: "Practice", fr: "Pratique" },
      info_session: { en: "Info Session", fr: "Session d'info" },
      webinar: { en: "Webinar", fr: "Webinaire" },
      other: { en: "Event", fr: "Événement" }
    };
    return labels[type]?.[language] || type;
  };

  const handleCreateThread = async () => {
    if (!selectedCategoryId || !newThreadTitle.trim() || !newThreadContent.trim()) return;
    
    try {
      await createThreadMutation.mutateAsync({
        categoryId: selectedCategoryId,
        title: newThreadTitle,
        content: newThreadContent,
      });
      
      setNewThreadTitle("");
      setNewThreadContent("");
      setSelectedCategoryId(null);
      setShowNewThreadModal(false);
      utils.forum.categories.invalidate();
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  const handleRegisterEvent = async (eventId: number) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    setRegistrationStatus(prev => ({ ...prev, [eventId]: "loading" }));
    
    try {
      await registerEventMutation.mutateAsync({ eventId });
      setRegistrationStatus(prev => ({ ...prev, [eventId]: "success" }));
      utils.events.list.invalidate();
      setTimeout(() => {
        setRegistrationStatus(prev => ({ ...prev, [eventId]: "idle" }));
      }, 3000);
    } catch (error: any) {
      setRegistrationStatus(prev => ({ ...prev, [eventId]: "error" }));
      console.error("Failed to register:", error);
      setTimeout(() => {
        setRegistrationStatus(prev => ({ ...prev, [eventId]: "idle" }));
      }, 3000);
    }
  };

  const formatEventTime = (startAt: Date, endAt: Date) => {
    const start = new Date(startAt as any);
    const end = new Date(endAt as any);
    const timeFormat = new Intl.DateTimeFormat(language === "en" ? "en-CA" : "fr-CA", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${timeFormat.format(start)} - ${timeFormat.format(end)} EST`;
  };

  return (
    <div className="min-h-screen text-white dark-page" style={{ background: "linear-gradient(135deg, #0d1a19 0%, #0f2028 40%, #0a1628 100%)" }}>
      <SEO title="Community" description="Join the RusingÂcademy learning community. Connect with fellow public servants preparing for SLE exams." canonical="/community" />
      
      {/* Hero Section — Premium Glassmorphism */}
      <section className="community-hero relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <WaveDivider variant="smooth" color="#0d1020" backgroundColor="transparent" orientation="bottom" />
        {/* Ambient background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-16 left-[15%] w-[28rem] h-[28rem] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(23, 226, 198, 0.1), transparent 70%)" }} />
          <div className="absolute bottom-10 right-[10%] w-[24rem] h-[24rem] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(60, 87, 89, 0.15), transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(209, 235, 219, 0.04), transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Premium badge */}
            <div className="community-hero-badge mx-auto mb-8 w-fit">
              <Sparkles className="w-4 h-4" style={{ color: "#17E2C6" }} aria-hidden="true" />
              <span>
                {language === "en" ? "Join 5,200+ members" : "Rejoignez 5 200+ membres"}
              </span>
            </div>

            <h1 className="community-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              {language === "en" ? (
                <>
                  Your <span className="accent">Bilingual</span> Community
                </>
              ) : (
                <>
                  Votre communauté <span className="accent">bilingue</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-10" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
              {language === "en"
                ? "Connect with fellow public servants, share experiences, attend events, and access exclusive resources on your journey to bilingual excellence."
                : "Connectez-vous avec d'autres fonctionnaires, partagez vos expériences, participez à des événements et accédez à des ressources exclusives dans votre parcours vers l'excellence bilingue."}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="community-btn-primary px-8 py-6 text-base rounded-xl border-0"
              >
                {language === "en" ? "Join the Community" : "Rejoindre la communauté"}
                <ChevronRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="community-btn-outline px-8 py-6 text-base rounded-xl"
              >
                {language === "en" ? "Learn More" : "En savoir plus"}
              </Button>
            </div>
          </motion.div>

          {/* Stats — Premium glassmorphism cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mt-12 sm:mt-16"
          >
            {communityStats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="community-stat-card"
                >
                  <StatIcon className="w-5 h-5 mx-auto mb-2" style={{ color: "rgba(23, 226, 198, 0.6)" }} aria-hidden="true" />
                  <div className="community-stat-value">
                    {stat.value}
                  </div>
                  <div className="community-stat-label">
                    {stat.label[language]}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation — Premium glassmorphism pills */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 pb-8">
        <WaveDivider variant="organic" color="#080a14" backgroundColor="#0d1020" orientation="bottom" />
        <div className="flex justify-center">
          <div className="community-tabs" role="tablist" aria-label={language === "en" ? "Community sections" : "Sections de la communauté"}>
            {[
              { id: "events", icon: Calendar, label: { en: "Events", fr: "Événements" } },
              { id: "forum", icon: MessageSquare, label: { en: "Forum", fr: "Forum" } },
              { id: "resources", icon: BookOpen, label: { en: "Resources", fr: "Ressources" } }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                aria-selected={activeTab === tab.id}
                aria-pressed={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                className={`community-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                <tab.icon className="w-4 h-4" aria-hidden="true" />
                {tab.label[language]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      {activeTab === "events" && (
        <section id="tabpanel-events" role="tabpanel" aria-labelledby="tab-events" className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 pb-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="community-section-header">
              <h2 className="community-section-title">
                {language === "en" ? "Upcoming Events" : "Événements à venir"}
              </h2>
              <Button variant="ghost" className="text-sm font-semibold" style={{ color: "#17E2C6" }}>
                {language === "en" ? "View All Events" : "Voir tous les événements"}
                <ChevronRight className="ml-1 w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-16 sm:py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#17E2C6" }} />
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {events.map((event, idx) => {
                  const spotsLeft = (event.maxCapacity || 0) - (event.currentRegistrations || 0);
                  const status = registrationStatus[event.id] || "idle";
                  const typeColor = getEventTypeColor(event.eventType || "other");
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      whileHover={{ y: -5 }}
                      className="community-event-card group"
                    >
                      <div className="p-6">
                        {/* Event type badge */}
                        <div 
                          className="community-badge mb-4"
                          style={{ backgroundColor: `${typeColor}15`, color: typeColor, borderColor: `${typeColor}30` }}
                        >
                          {getEventTypeLabel(event.eventType || "other")}
                        </div>

                        <h3 className="text-lg font-bold mb-2 transition-colors duration-200" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                          {language === "en" ? event.title : event.titleFr}
                        </h3>

                        <p className="text-sm mb-4 line-clamp-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          {language === "en" ? event.description : event.descriptionFr}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm mb-5" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                            {new Date(event.startAt).toLocaleDateString(language === "en" ? "en-CA" : "fr-CA", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            {/* @ts-ignore - TS2345: auto-suppressed during TS cleanup */}
                            {formatEventTime(event.startAt, event.endAt)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            {event.locationDetails || (event.locationType === "virtual" ? (language === "en" ? "Virtual" : "Virtuel") : event.locationType)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-bold" style={{ color: "#17E2C6" }}>{spotsLeft > 0 ? spotsLeft : 0}</span>
                            <span style={{ color: "rgba(255, 255, 255, 0.55)" }}> / {event.maxCapacity || "∞"} {language === "en" ? "spots left" : "places restantes"}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRegisterEvent(event.id)}
                            disabled={status === "loading" || status === "success" || spotsLeft <= 0}
                            className="font-bold text-sm rounded-lg transition-all"
                            style={{
                              background: status === "success" 
                                ? "rgba(16, 185, 129, 0.2)" 
                                : status === "error"
                                ? "rgba(239, 68, 68, 0.2)"
                                : "linear-gradient(135deg, #17E2C6, #14B8A6)",
                              color: status === "success" ? "#34D399" : status === "error" ? "#F87171" : "#192524",
                              border: status === "success" ? "1px solid rgba(16, 185, 129, 0.3)" : status === "error" ? "1px solid rgba(239, 68, 68, 0.3)" : "none",
                              boxShadow: status === "idle" ? "0 4px 12px rgba(23, 226, 198, 0.25)" : "none",
                            }}
                          >
                            {status === "loading" ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : status === "success" ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                                {language === "en" ? "Registered!" : "Inscrit!"}
                              </>
                            ) : status === "error" ? (
                              <>
                                <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                                {language === "en" ? "Error" : "Erreur"}
                              </>
                            ) : spotsLeft <= 0 ? (
                              language === "en" ? "Full" : "Complet"
                            ) : (
                              language === "en" ? "Register" : "S'inscrire"
                            )}
                          </Button>
                        </div>

                        {/* Progress bar for spots */}
                        {event.maxCapacity && (
                          <div className="mt-4">
                            <div className="community-progress-bar">
                              <div 
                                className="community-progress-fill"
                                style={{ width: `${((event.currentRegistrations || 0) / event.maxCapacity) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.04)" }}>
                  <Calendar className="w-8 h-8" style={{ color: "rgba(255, 255, 255, 0.3)" }} aria-hidden="true" />
                </div>
                <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>{language === "en" ? "No upcoming events at the moment." : "Aucun événement à venir pour le moment."}</p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Forum Section */}
      {activeTab === "forum" && (
        <section id="tabpanel-forum" role="tabpanel" aria-labelledby="tab-forum" className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 pb-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="community-section-header">
              <h2 className="community-section-title">
                {language === "en" ? "Community Forum" : "Forum communautaire"}
              </h2>
              <Button 
                onClick={() => {
                  if (!user) {
                    window.location.href = "/login";
                    return;
                  }
                  setShowNewThreadModal(true);
                }}
                className="community-btn-primary text-sm"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                {language === "en" ? "New Discussion" : "Nouvelle discussion"}
              </Button>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-16 sm:py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#17E2C6" }} />
              </div>
            ) : forumCategories && forumCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {forumCategories.map((category, idx) => {
                  const IconComponent = categoryIcons[category.icon || "💬"] || MessageSquare;
                  const categoryColor = category.color || "#17E2C6";
                  
                  return (
                    <Link key={category.id} href={`/community/category/${category.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        whileHover={{ y: -5 }}
                        className="community-category-card group"
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="community-category-icon"
                            style={{ backgroundColor: `${categoryColor}15` }}
                          >
                            <IconComponent className="w-6 h-6" style={{ color: categoryColor }} aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold mb-1 transition-colors duration-200" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                              {language === "en" ? category.name : category.nameFr}
                            </h3>
                            <p className="text-sm mb-3 line-clamp-2" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                              {language === "en" ? category.description : category.descriptionFr}
                            </p>
                            <div className="flex gap-4 text-xs" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" aria-hidden="true" />
                                {category.threadCount || 0} {language === "en" ? "threads" : "fils"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" aria-hidden="true" />
                                {category.postCount || 0} {language === "en" ? "posts" : "messages"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ color: "rgba(255, 255, 255, 0.3)" }} aria-hidden="true" />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.04)" }}>
                  <MessageSquare className="w-8 h-8" style={{ color: "rgba(255, 255, 255, 0.3)" }} aria-hidden="true" />
                </div>
                <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>{language === "en" ? "No forum categories available." : "Aucune catégorie de forum disponible."}</p>
              </div>
            )}

            {/* Community Guidelines — Premium glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="community-guidelines mt-12"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                <Shield className="w-5 h-5" style={{ color: "#17E2C6" }} aria-hidden="true" />
                {language === "en" ? "Community Guidelines" : "Lignes directrices de la communauté"}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {[
                  { en: "Be respectful and supportive of fellow learners", fr: "Soyez respectueux et soutenez les autres apprenants" },
                  { en: "Share your experiences and tips freely", fr: "Partagez librement vos expériences et conseils" },
                  { en: "Practice both official languages when possible", fr: "Pratiquez les deux langues officielles quand possible" },
                  { en: "Keep discussions professional and on-topic", fr: "Gardez les discussions professionnelles et pertinentes" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#17E2C6" }} aria-hidden="true" />
                    {item[language]}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Resources Section */}
      {activeTab === "resources" && (
        <section id="tabpanel-resources" role="tabpanel" aria-labelledby="tab-resources" className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 pb-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="community-section-header">
              <h2 className="community-section-title">
                {language === "en" ? "Learning Resources" : "Ressources d'apprentissage"}
              </h2>
              <Button variant="ghost" className="text-sm font-semibold" style={{ color: "#17E2C6" }}>
                {language === "en" ? "Browse All" : "Parcourir tout"}
                <ChevronRight className="ml-1 w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {resources.map((resource, idx) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="community-resource-card group"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="community-category-icon flex-shrink-0"
                      style={{ backgroundColor: `${resource.color}15` }}
                    >
                      <resource.icon className="w-6 h-6" style={{ color: resource.color }} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span 
                          className="community-badge"
                          style={{ backgroundColor: `${resource.color}15`, color: resource.color, borderColor: `${resource.color}30` }}
                        >
                          {resource.format}
                        </span>
                        {resource.size && <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.45)" }}>{resource.size}</span>}
                        {resource.duration && <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.45)" }}>{resource.duration}</span>}
                        {resource.episodes && <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.45)" }}>{resource.episodes} {language === "en" ? "episodes" : "épisodes"}</span>}
                      </div>
                      <h3 className="text-base font-bold mb-2 transition-colors duration-200" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                        {resource.title[language]}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                        {resource.description[language]}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                          {resource.downloads && `${resource.downloads.toLocaleString()} ${language === "en" ? "downloads" : "téléchargements"}`}
                          {resource.views && `${resource.views.toLocaleString()} ${language === "en" ? "views" : "vues"}`}
                          {resource.subscribers && `${resource.subscribers.toLocaleString()} ${language === "en" ? "subscribers" : "abonnés"}`}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-sm font-semibold"
                          style={{ color: "#17E2C6" }}
                        >
                          {resource.type === "guide" || resource.type === "template" ? (
                            <>
                              <Download className="w-4 h-4 mr-1" aria-hidden="true" />
                              {language === "en" ? "Download" : "Télécharger"}
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-1" aria-hidden="true" />
                              {language === "en" ? "Access" : "Accéder"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Featured resource banner — Premium glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-12 p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(23, 226, 198, 0.08) 0%, rgba(60, 87, 89, 0.12) 100%)",
                border: "1px solid rgba(23, 226, 198, 0.2)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="community-badge mb-3" style={{ background: "rgba(23, 226, 198, 0.12)", color: "#17E2C6", borderColor: "rgba(23, 226, 198, 0.25)" }}>
                    <Star className="w-3 h-3" aria-hidden="true" />
                    {language === "en" ? "Featured Resource" : "Ressource vedette"}
                  </div>
                  <h3 className="text-2xl font-black mb-2" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                    {language === "en" ? "SLE Success Toolkit" : "Trousse de réussite ELS"}
                  </h3>
                  <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                    {language === "en"
                      ? "Our comprehensive toolkit includes study guides, practice tests, vocabulary lists, and exam strategies - everything you need to succeed."
                      : "Notre trousse complète comprend des guides d'étude, des tests pratiques, des listes de vocabulaire et des stratégies d'examen - tout ce dont vous avez besoin pour réussir."}
                  </p>
                  <Button className="community-btn-primary text-sm">
                    {language === "en" ? "Get Free Access" : "Obtenir un accès gratuit"}
                    <ChevronRight className="ml-1 w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center" style={{ background: "rgba(23, 226, 198, 0.08)", border: "1px solid rgba(23, 226, 198, 0.15)" }}>
                  <BookOpen className="w-14 h-14 sm:w-16 sm:h-16" style={{ color: "rgba(23, 226, 198, 0.6)" }} aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* CTA Section — Premium glassmorphism */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 pb-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="community-cta"
        >
          <Heart className="w-10 h-10 mx-auto mb-5" style={{ color: "#17E2C6" }} aria-hidden="true" />
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
            {language === "en" ? "Ready to Join Our Community?" : "Prêt à rejoindre notre communauté?"}
          </h2>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
            {language === "en"
              ? "Connect with thousands of public servants on their bilingual journey. Get support, share experiences, and accelerate your language learning."
              : "Connectez-vous avec des milliers de fonctionnaires dans leur parcours bilingue. Obtenez du soutien, partagez vos expériences et accélérez votre apprentissage des langues."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="community-btn-primary px-8 py-6 text-base rounded-xl border-0"
            >
              {language === "en" ? "Create Free Account" : "Créer un compte gratuit"}
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="community-btn-outline px-8 py-6 text-base rounded-xl"
              >
                {language === "en" ? "Contact Us" : "Nous contacter"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* New Thread Modal — Premium glassmorphism */}
      <AnimatePresence>
        {showNewThreadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="community-modal-backdrop"
            onClick={() => setShowNewThreadModal(false)}
            role="dialog"
            aria-modal="true"
            aria-label={language === "en" ? "Start a New Discussion" : "Démarrer une nouvelle discussion"}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="community-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                  {language === "en" ? "Start a New Discussion" : "Démarrer une nouvelle discussion"}
                </h3>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  aria-label={language === "en" ? "Close dialog" : "Fermer le dialogue"}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {language === "en" ? "Category" : "Catégorie"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {forumCategories?.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        aria-pressed={selectedCategoryId === category.id}
                        className="p-3 rounded-xl text-left text-sm transition-all"
                        style={{
                          background: selectedCategoryId === category.id ? "rgba(23, 226, 198, 0.12)" : "rgba(255, 255, 255, 0.04)",
                          border: selectedCategoryId === category.id ? "1px solid rgba(23, 226, 198, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                          color: selectedCategoryId === category.id ? "#17E2C6" : "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        <span className="font-medium">
                          {language === "en" ? category.name : category.nameFr}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {language === "en" ? "Title" : "Titre"}
                  </label>
                  <input
                    type="text"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder={language === "en" ? "What's your question or topic?" : "Quelle est votre question ou sujet?"}
                    className="community-input"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {language === "en" ? "Content" : "Contenu"}
                  </label>
                  <textarea
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    placeholder={language === "en" ? "Share more details..." : "Partagez plus de détails..."}
                    rows={5}
                    className="community-input resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewThreadModal(false)}
                    className="community-btn-outline flex-1"
                  >
                    {language === "en" ? "Cancel" : "Annuler"}
                  </Button>
                  <Button
                    onClick={handleCreateThread}
                    disabled={!selectedCategoryId || !newThreadTitle.trim() || !newThreadContent.trim() || createThreadMutation.isPending}
                    className="community-btn-primary flex-1 disabled:opacity-50"
                  >
                    {createThreadMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      language === "en" ? "Post Discussion" : "Publier la discussion"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

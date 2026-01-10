import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: { en: "SLE Oral Exam Prep Workshop", fr: "Atelier de préparation à l'examen oral ELS" },
    date: "2026-01-25",
    time: "10:00 AM - 12:00 PM EST",
    type: "workshop",
    format: { en: "Virtual", fr: "Virtuel" },
    spots: 25,
    spotsLeft: 8,
    image: "/images/events/workshop-oral.jpg",
    description: {
      en: "Master the oral component of your SLE exam with expert tips and live practice sessions.",
      fr: "Maîtrisez la composante orale de votre examen ELS avec des conseils d'experts et des sessions de pratique en direct."
    }
  },
  {
    id: 2,
    title: { en: "Bilingual Networking Mixer", fr: "Soirée de réseautage bilingue" },
    date: "2026-02-05",
    time: "5:30 PM - 7:30 PM EST",
    type: "networking",
    format: { en: "In-Person (Ottawa)", fr: "En personne (Ottawa)" },
    spots: 50,
    spotsLeft: 22,
    image: "/images/events/networking.jpg",
    description: {
      en: "Connect with fellow public servants on their bilingual journey. Light refreshments provided.",
      fr: "Connectez-vous avec d'autres fonctionnaires dans leur parcours bilingue. Rafraîchissements légers offerts."
    }
  },
  {
    id: 3,
    title: { en: "French Conversation Circle", fr: "Cercle de conversation française" },
    date: "2026-01-18",
    time: "12:00 PM - 1:00 PM EST",
    type: "practice",
    format: { en: "Virtual", fr: "Virtuel" },
    spots: 15,
    spotsLeft: 3,
    image: "/images/events/conversation.jpg",
    description: {
      en: "Weekly informal conversation practice for intermediate French learners. All topics welcome!",
      fr: "Pratique de conversation informelle hebdomadaire pour les apprenants de français intermédiaire. Tous les sujets sont les bienvenus!"
    }
  },
  {
    id: 4,
    title: { en: "Path Series™ Info Session", fr: "Session d'information Path Series™" },
    date: "2026-02-12",
    time: "2:00 PM - 3:00 PM EST",
    type: "info",
    format: { en: "Virtual", fr: "Virtuel" },
    spots: 100,
    spotsLeft: 67,
    image: "/images/events/info-session.jpg",
    description: {
      en: "Learn about our accelerated learning programs and how they can help you achieve your SLE goals.",
      fr: "Découvrez nos programmes d'apprentissage accéléré et comment ils peuvent vous aider à atteindre vos objectifs ELS."
    }
  }
];

// Forum categories
const forumCategories = [
  {
    id: "general",
    icon: MessageSquare,
    title: { en: "General Discussion", fr: "Discussion générale" },
    description: { en: "Share experiences, ask questions, and connect with the community", fr: "Partagez vos expériences, posez des questions et connectez-vous avec la communauté" },
    threads: 234,
    posts: 1892,
    color: "#17E2C6"
  },
  {
    id: "sle-prep",
    icon: Award,
    title: { en: "SLE Exam Preparation", fr: "Préparation aux examens ELS" },
    description: { en: "Tips, resources, and support for SLE exam success", fr: "Conseils, ressources et soutien pour réussir les examens ELS" },
    threads: 156,
    posts: 1245,
    color: "#1E9B8A"
  },
  {
    id: "practice",
    icon: Mic,
    title: { en: "Practice Partners", fr: "Partenaires de pratique" },
    description: { en: "Find conversation partners and study buddies", fr: "Trouvez des partenaires de conversation et de camarades d'étude" },
    threads: 89,
    posts: 567,
    color: "#D4A853"
  },
  {
    id: "success",
    icon: Star,
    title: { en: "Success Stories", fr: "Histoires de réussite" },
    description: { en: "Celebrate achievements and inspire others", fr: "Célébrez les réussites et inspirez les autres" },
    threads: 78,
    posts: 423,
    color: "#FF6B6B"
  }
];

// Resources data
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
    color: "#1E9B8A"
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
    color: "#D4A853"
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
  { value: "5,200+", label: { en: "Active Members", fr: "Membres actifs" } },
  { value: "850+", label: { en: "SLE Success Stories", fr: "Réussites ELS" } },
  { value: "120+", label: { en: "Events Hosted", fr: "Événements organisés" } },
  { value: "15,000+", label: { en: "Resources Downloaded", fr: "Ressources téléchargées" } }
];

export default function Community() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"events" | "forum" | "resources">("events");

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop": return "#17E2C6";
      case "networking": return "#D4A853";
      case "practice": return "#1E9B8A";
      case "info": return "#8B5CFF";
      default: return "#17E2C6";
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      workshop: { en: "Workshop", fr: "Atelier" },
      networking: { en: "Networking", fr: "Réseautage" },
      practice: { en: "Practice", fr: "Pratique" },
      info: { en: "Info Session", fr: "Session d'info" }
    };
    return labels[type]?.[language] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080a14] via-[#0d1020] to-[#080a14] text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#17E2C6]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#1E9B8A]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Users className="w-4 h-4 text-[#17E2C6]" />
              <span className="text-sm font-medium text-white/80">
                {language === "en" ? "Join 5,200+ members" : "Rejoignez 5 200+ membres"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {language === "en" ? (
                <>
                  Your <span className="text-[#17E2C6]">Bilingual</span> Community
                </>
              ) : (
                <>
                  Votre communauté <span className="text-[#17E2C6]">bilingue</span>
                </>
              )}
            </h1>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              {language === "en"
                ? "Connect with fellow public servants, share experiences, attend events, and access exclusive resources on your journey to bilingual excellence."
                : "Connectez-vous avec d'autres fonctionnaires, partagez vos expériences, participez à des événements et accédez à des ressources exclusives dans votre parcours vers l'excellence bilingue."}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#17E2C6] to-[#0d9488] text-white border-0 px-8 py-6 text-base font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
                style={{ boxShadow: "0 10px 25px -5px rgba(23, 226, 198, 0.5)" }}
              >
                {language === "en" ? "Join the Community" : "Rejoindre la communauté"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/5 text-white border-white/20 px-8 py-6 text-base font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                {language === "en" ? "Learn More" : "En savoir plus"}
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {communityStats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-3xl md:text-4xl font-black text-[#17E2C6] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label[language]}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 mb-12">
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10">
            {[
              { id: "events", icon: Calendar, label: { en: "Events", fr: "Événements" } },
              { id: "forum", icon: MessageSquare, label: { en: "Forum", fr: "Forum" } },
              { id: "resources", icon: BookOpen, label: { en: "Resources", fr: "Ressources" } }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-[#17E2C6] text-black"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label[language]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      {activeTab === "events" && (
        <section className="relative z-10 max-w-[1280px] mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black">
                {language === "en" ? "Upcoming Events" : "Événements à venir"}
              </h2>
              <Button variant="ghost" className="text-[#17E2C6] hover:text-[#17E2C6]/80">
                {language === "en" ? "View All Events" : "Voir tous les événements"}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#17E2C6]/30 transition-all"
                >
                  {/* Event type badge */}
                  <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ backgroundColor: `${getEventTypeColor(event.type)}20`, color: getEventTypeColor(event.type) }}
                  >
                    {getEventTypeLabel(event.type)}
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#17E2C6] transition-colors">
                    {event.title[language]}
                  </h3>

                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {event.description[language]}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString(language === "en" ? "en-CA" : "fr-CA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {event.format[language]}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-[#17E2C6] font-bold">{event.spotsLeft}</span>
                      <span className="text-white/50"> / {event.spots} {language === "en" ? "spots left" : "places restantes"}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#17E2C6] text-black hover:bg-[#17E2C6]/90 font-bold"
                    >
                      {language === "en" ? "Register" : "S'inscrire"}
                    </Button>
                  </div>

                  {/* Progress bar for spots */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                    <div 
                      className="h-full bg-[#17E2C6]/50 transition-all"
                      style={{ width: `${((event.spots - event.spotsLeft) / event.spots) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Forum Section */}
      {activeTab === "forum" && (
        <section className="relative z-10 max-w-[1280px] mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black">
                {language === "en" ? "Community Forum" : "Forum communautaire"}
              </h2>
              <Button className="bg-[#17E2C6] text-black hover:bg-[#17E2C6]/90 font-bold">
                {language === "en" ? "New Discussion" : "Nouvelle discussion"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {forumCategories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -5 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <category.icon className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-[#17E2C6] transition-colors">
                        {category.title[language]}
                      </h3>
                      <p className="text-white/60 text-sm mb-3">
                        {category.description[language]}
                      </p>
                      <div className="flex gap-4 text-xs text-white/40">
                        <span>{category.threads} {language === "en" ? "threads" : "fils"}</span>
                        <span>{category.posts} {language === "en" ? "posts" : "messages"}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#17E2C6] transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent discussions preview */}
            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold mb-4">
                {language === "en" ? "Recent Discussions" : "Discussions récentes"}
              </h3>
              <div className="space-y-4">
                {[
                  { title: { en: "Tips for the CBC oral exam?", fr: "Conseils pour l'examen oral CBC?" }, replies: 23, views: 156, time: "2h" },
                  { title: { en: "Looking for a conversation partner (BBB level)", fr: "Recherche partenaire de conversation (niveau BBB)" }, replies: 8, views: 67, time: "4h" },
                  { title: { en: "Just passed my SLE! Here's what worked for me", fr: "Je viens de réussir mon ELS! Voici ce qui a fonctionné pour moi" }, replies: 45, views: 312, time: "6h" }
                ].map((discussion, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-sm hover:text-[#17E2C6] transition-colors">
                        {discussion.title[language]}
                      </h4>
                      <div className="flex gap-3 text-xs text-white/40 mt-1">
                        <span>{discussion.replies} {language === "en" ? "replies" : "réponses"}</span>
                        <span>{discussion.views} {language === "en" ? "views" : "vues"}</span>
                      </div>
                    </div>
                    <span className="text-xs text-white/40">{discussion.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Resources Section */}
      {activeTab === "resources" && (
        <section className="relative z-10 max-w-[1280px] mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black">
                {language === "en" ? "Learning Resources" : "Ressources d'apprentissage"}
              </h2>
              <Button variant="ghost" className="text-[#17E2C6] hover:text-[#17E2C6]/80">
                {language === "en" ? "Browse All" : "Parcourir tout"}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <motion.div
                  key={resource.id}
                  whileHover={{ y: -5 }}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${resource.color}20` }}
                    >
                      <resource.icon className="w-6 h-6" style={{ color: resource.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${resource.color}20`, color: resource.color }}
                        >
                          {resource.format}
                        </span>
                        {resource.size && <span className="text-xs text-white/40">{resource.size}</span>}
                        {resource.duration && <span className="text-xs text-white/40">{resource.duration}</span>}
                        {resource.episodes && <span className="text-xs text-white/40">{resource.episodes} {language === "en" ? "episodes" : "épisodes"}</span>}
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-[#17E2C6] transition-colors">
                        {resource.title[language]}
                      </h3>
                      <p className="text-white/60 text-sm mb-4">
                        {resource.description[language]}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/40">
                          {resource.downloads && `${resource.downloads.toLocaleString()} ${language === "en" ? "downloads" : "téléchargements"}`}
                          {resource.views && `${resource.views.toLocaleString()} ${language === "en" ? "views" : "vues"}`}
                          {resource.subscribers && `${resource.subscribers.toLocaleString()} ${language === "en" ? "subscribers" : "abonnés"}`}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#17E2C6] hover:text-[#17E2C6]/80 hover:bg-[#17E2C6]/10"
                        >
                          {resource.type === "guide" || resource.type === "template" ? (
                            <>
                              <Download className="w-4 h-4 mr-1" />
                              {language === "en" ? "Download" : "Télécharger"}
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-1" />
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

            {/* Featured resource banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#17E2C6]/20 to-[#1E9B8A]/20 border border-[#17E2C6]/30"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17E2C6]/20 text-[#17E2C6] text-xs font-bold mb-3">
                    <Star className="w-3 h-3" />
                    {language === "en" ? "Featured Resource" : "Ressource vedette"}
                  </div>
                  <h3 className="text-2xl font-black mb-2">
                    {language === "en" ? "SLE Success Toolkit" : "Trousse de réussite ELS"}
                  </h3>
                  <p className="text-white/70 mb-4">
                    {language === "en"
                      ? "Our comprehensive toolkit includes study guides, practice tests, vocabulary lists, and exam strategies - everything you need to succeed."
                      : "Notre trousse complète comprend des guides d'étude, des tests pratiques, des listes de vocabulaire et des stratégies d'examen - tout ce dont vous avez besoin pour réussir."}
                  </p>
                  <Button className="bg-[#17E2C6] text-black hover:bg-[#17E2C6]/90 font-bold">
                    {language === "en" ? "Get Free Access" : "Obtenir un accès gratuit"}
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
                <div className="w-32 h-32 rounded-2xl bg-[#17E2C6]/20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#17E2C6]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-12 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10"
        >
          <Heart className="w-12 h-12 text-[#17E2C6] mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">
            {language === "en" ? "Ready to Join Our Community?" : "Prêt à rejoindre notre communauté?"}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {language === "en"
              ? "Connect with thousands of public servants on their bilingual journey. Get support, share experiences, and accelerate your language learning."
              : "Connectez-vous avec des milliers de fonctionnaires dans leur parcours bilingue. Obtenez du soutien, partagez vos expériences et accélérez votre apprentissage des langues."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#17E2C6] to-[#0d9488] text-white border-0 px-8 py-6 text-base font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
              style={{ boxShadow: "0 10px 25px -5px rgba(23, 226, 198, 0.5)" }}
            >
              {language === "en" ? "Create Free Account" : "Créer un compte gratuit"}
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/5 text-white border-white/20 px-8 py-6 text-base font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                {language === "en" ? "Contact Us" : "Nous contacter"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/**
 * Barholex Media Portal
 * 
 * Client portal for media production services:
 * - Project brief submission form
 * - Project status tracking
 * - File delivery
 * - Bilingual support (EN/FR)
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Film,
  Mic,
  Image,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  MessageSquare,
  Calendar,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function BarholexPortal() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("new-project");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    projectType: "",
    title: "",
    description: "",
    deadline: "",
    budget: "",
    deliverables: "",
    references: "",
  });

  // Mock projects data (will be replaced with tRPC query)
  const projects = [
    {
      id: 1,
      title: "Corporate Training Video",
      type: "video",
      status: "in_progress",
      createdAt: "2026-01-05",
      deadline: "2026-01-20",
      progress: 65,
    },
    {
      id: 2,
      title: "Podcast Episode Editing",
      type: "audio",
      status: "review",
      createdAt: "2026-01-08",
      deadline: "2026-01-15",
      progress: 90,
    },
    {
      id: 3,
      title: "Social Media Graphics",
      type: "graphics",
      status: "completed",
      createdAt: "2025-12-20",
      deadline: "2025-12-28",
      progress: 100,
    },
  ];

  const labels = {
    en: {
      title: "Barholex Media Portal",
      subtitle: "Professional media production services for your organization",
      newProject: "New Project",
      myProjects: "My Projects",
      // Form
      formTitle: "Submit a Project Brief",
      formDesc: "Tell us about your media production needs",
      projectType: "Project Type",
      projectTypePlaceholder: "Select project type",
      videoProduction: "Video Production",
      audioProduction: "Audio/Podcast",
      graphicDesign: "Graphic Design",
      animation: "Animation/Motion Graphics",
      projectTitle: "Project Title",
      projectTitlePlaceholder: "Enter a descriptive title",
      description: "Project Description",
      descriptionPlaceholder: "Describe your project goals, target audience, and key messages...",
      deadline: "Desired Deadline",
      budget: "Budget Range",
      budgetPlaceholder: "Select budget range",
      budget1: "$500 - $1,000",
      budget2: "$1,000 - $2,500",
      budget3: "$2,500 - $5,000",
      budget4: "$5,000 - $10,000",
      budget5: "$10,000+",
      deliverables: "Expected Deliverables",
      deliverablesPlaceholder: "List the files/formats you need (e.g., MP4, 1080p, subtitles)",
      references: "References/Inspiration",
      referencesPlaceholder: "Share links to examples or styles you like",
      submit: "Submit Brief",
      submitting: "Submitting...",
      // Projects
      noProjects: "No projects yet",
      startProject: "Start your first project",
      status: "Status",
      statusDraft: "Draft",
      statusPending: "Pending Review",
      statusInProgress: "In Progress",
      statusReview: "Ready for Review",
      statusCompleted: "Completed",
      progress: "Progress",
      deadline: "Deadline",
      viewDetails: "View Details",
      downloadFiles: "Download Files",
      // Services
      servicesTitle: "Our Services",
      serviceVideo: "Video Production",
      serviceVideoDesc: "Corporate videos, training content, promotional materials",
      serviceAudio: "Audio Production",
      serviceAudioDesc: "Podcasts, voiceovers, audio editing",
      serviceGraphics: "Graphic Design",
      serviceGraphicsDesc: "Branding, social media, print materials",
      serviceAnimation: "Animation",
      serviceAnimationDesc: "Motion graphics, explainer videos, 3D animation",
      loginRequired: "Please sign in to access the portal",
      signIn: "Sign In",
    },
    fr: {
      title: "Portail Barholex Media",
      subtitle: "Services de production média professionnels pour votre organisation",
      newProject: "Nouveau projet",
      myProjects: "Mes projets",
      // Form
      formTitle: "Soumettre un brief de projet",
      formDesc: "Parlez-nous de vos besoins en production média",
      projectType: "Type de projet",
      projectTypePlaceholder: "Sélectionner le type de projet",
      videoProduction: "Production vidéo",
      audioProduction: "Audio/Podcast",
      graphicDesign: "Design graphique",
      animation: "Animation/Motion Graphics",
      projectTitle: "Titre du projet",
      projectTitlePlaceholder: "Entrez un titre descriptif",
      description: "Description du projet",
      descriptionPlaceholder: "Décrivez vos objectifs, public cible et messages clés...",
      deadline: "Date limite souhaitée",
      budget: "Fourchette de budget",
      budgetPlaceholder: "Sélectionner la fourchette de budget",
      budget1: "500 $ - 1 000 $",
      budget2: "1 000 $ - 2 500 $",
      budget3: "2 500 $ - 5 000 $",
      budget4: "5 000 $ - 10 000 $",
      budget5: "10 000 $+",
      deliverables: "Livrables attendus",
      deliverablesPlaceholder: "Listez les fichiers/formats nécessaires (ex: MP4, 1080p, sous-titres)",
      references: "Références/Inspiration",
      referencesPlaceholder: "Partagez des liens vers des exemples ou styles que vous aimez",
      submit: "Soumettre le brief",
      submitting: "Soumission...",
      // Projects
      noProjects: "Aucun projet",
      startProject: "Démarrer votre premier projet",
      status: "Statut",
      statusDraft: "Brouillon",
      statusPending: "En attente de révision",
      statusInProgress: "En cours",
      statusReview: "Prêt pour révision",
      statusCompleted: "Complété",
      progress: "Progression",
      deadline: "Date limite",
      viewDetails: "Voir les détails",
      downloadFiles: "Télécharger les fichiers",
      // Services
      servicesTitle: "Nos services",
      serviceVideo: "Production vidéo",
      serviceVideoDesc: "Vidéos corporatives, contenu de formation, matériel promotionnel",
      serviceAudio: "Production audio",
      serviceAudioDesc: "Podcasts, voix off, montage audio",
      serviceGraphics: "Design graphique",
      serviceGraphicsDesc: "Image de marque, médias sociaux, imprimés",
      serviceAnimation: "Animation",
      serviceAnimationDesc: "Motion graphics, vidéos explicatives, animation 3D",
      loginRequired: "Veuillez vous connecter pour accéder au portail",
      signIn: "Se connecter",
    },
  };

  const t = labels[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement tRPC mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(isEn ? "Brief submitted successfully!" : "Brief soumis avec succès!");
      setFormData({
        projectType: "",
        title: "",
        description: "",
        deadline: "",
        budget: "",
        deliverables: "",
        references: "",
      });
      setActiveTab("my-projects");
    } catch (error) {
      toast.error(isEn ? "Failed to submit brief" : "Échec de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline"; icon: any }> = {
      draft: { label: t.statusDraft, variant: "outline", icon: FileText },
      pending: { label: t.statusPending, variant: "secondary", icon: Clock },
      in_progress: { label: t.statusInProgress, variant: "default", icon: Play },
      review: { label: t.statusReview, variant: "secondary", icon: AlertCircle },
      completed: { label: t.statusCompleted, variant: "default", icon: CheckCircle },
    };
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className={status === "completed" ? "bg-green-100 text-green-700" : status === "in_progress" ? "bg-blue-100 text-blue-700" : ""}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getProjectIcon = (type: string) => {
    const icons: Record<string, any> = {
      video: Video,
      audio: Mic,
      graphics: Image,
      animation: Film,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="h-5 w-5" />;
  };

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto bg-slate-800 border-slate-700">
            <CardContent className="pt-8 pb-8">
              <Video className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-white">{t.loginRequired}</h2>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <a href={getLoginUrl()}>{t.signIn}</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <SEO
        title={isEn ? "Client Portal | Barholex Media" : "Portail client | Barholex Media"}
        description={isEn
          ? "Submit project briefs and track your media production projects with Barholex Media."
          : "Soumettez des briefs de projet et suivez vos projets de production média avec Barholex Media."
        }
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-orange-600 rounded-xl">
              <Film className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800">
            <TabsTrigger value="new-project" className="data-[state=active]:bg-orange-600">
              <Sparkles className="h-4 w-4 mr-2" />
              {t.newProject}
            </TabsTrigger>
            <TabsTrigger value="my-projects" className="data-[state=active]:bg-orange-600">
              <FileText className="h-4 w-4 mr-2" />
              {t.myProjects}
            </TabsTrigger>
          </TabsList>

          {/* New Project Tab */}
          <TabsContent value="new-project">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{t.formTitle}</CardTitle>
                <CardDescription className="text-slate-400">{t.formDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label htmlFor="projectType" className="text-white">{t.projectType}</Label>
                    <Select value={formData.projectType} onValueChange={(v) => handleInputChange("projectType", v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder={t.projectTypePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video"><Video className="h-4 w-4 mr-2 inline" />{t.videoProduction}</SelectItem>
                        <SelectItem value="audio"><Mic className="h-4 w-4 mr-2 inline" />{t.audioProduction}</SelectItem>
                        <SelectItem value="graphics"><Image className="h-4 w-4 mr-2 inline" />{t.graphicDesign}</SelectItem>
                        <SelectItem value="animation"><Film className="h-4 w-4 mr-2 inline" />{t.animation}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">{t.projectTitle}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder={t.projectTitlePlaceholder}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">{t.description}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder={t.descriptionPlaceholder}
                      className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                      required
                    />
                  </div>

                  {/* Deadline & Budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-white">{t.deadline}</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange("deadline", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-white">{t.budget}</Label>
                      <Select value={formData.budget} onValueChange={(v) => handleInputChange("budget", v)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder={t.budgetPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500-1000">{t.budget1}</SelectItem>
                          <SelectItem value="1000-2500">{t.budget2}</SelectItem>
                          <SelectItem value="2500-5000">{t.budget3}</SelectItem>
                          <SelectItem value="5000-10000">{t.budget4}</SelectItem>
                          <SelectItem value="10000+">{t.budget5}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-2">
                    <Label htmlFor="deliverables" className="text-white">{t.deliverables}</Label>
                    <Textarea
                      id="deliverables"
                      value={formData.deliverables}
                      onChange={(e) => handleInputChange("deliverables", e.target.value)}
                      placeholder={t.deliverablesPlaceholder}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  {/* References */}
                  <div className="space-y-2">
                    <Label htmlFor="references" className="text-white">{t.references}</Label>
                    <Textarea
                      id="references"
                      value={formData.references}
                      onChange={(e) => handleInputChange("references", e.target.value)}
                      placeholder={t.referencesPlaceholder}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>{t.submitting}</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Projects Tab */}
          <TabsContent value="my-projects">
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-700 rounded-lg text-orange-500">
                            {getProjectIcon(project.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{project.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {project.deadline}
                              </span>
                              <span>{t.progress}: {project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                              <div
                                className="bg-orange-600 h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(project.status)}
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                              {t.viewDetails}
                            </Button>
                            {project.status === "completed" && (
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                <Download className="h-4 w-4 mr-1" />
                                {t.downloadFiles}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">{t.noProjects}</p>
                  <Button onClick={() => setActiveTab("new-project")} className="bg-orange-600 hover:bg-orange-700">
                    {t.startProject}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Services Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">{t.servicesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Video, title: t.serviceVideo, desc: t.serviceVideoDesc },
              { icon: Mic, title: t.serviceAudio, desc: t.serviceAudioDesc },
              { icon: Image, title: t.serviceGraphics, desc: t.serviceGraphicsDesc },
              { icon: Film, title: t.serviceAnimation, desc: t.serviceAnimationDesc },
            ].map((service, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
                <CardContent className="p-6 text-center">
                  <service.icon className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-400">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

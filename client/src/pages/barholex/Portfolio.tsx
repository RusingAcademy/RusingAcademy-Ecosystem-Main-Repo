import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Play,
  Filter,
} from "lucide-react";

export default function BarholexPortfolio() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");

  const FILTERS = [
    { id: "all", labelEn: "All Projects", labelFr: "Tous les projets" },
    { id: "video", labelEn: "Video", labelFr: "Vidéo" },
    { id: "web", labelEn: "Web & Apps", labelFr: "Web & Apps" },
    { id: "branding", labelEn: "Branding", labelFr: "Image de marque" },
    { id: "edtech", labelEn: "EdTech", labelFr: "EdTech" },
  ];

  const PROJECTS = [
    {
      id: 1,
      titleEn: "Lingueefy Learning Platform",
      titleFr: "Plateforme d'apprentissage Lingueefy",
      categoryEn: "EdTech Platform",
      categoryFr: "Plateforme EdTech",
      descEn: "A comprehensive bilingual learning platform with AI-powered coaching and SLE exam preparation.",
      descFr: "Une plateforme d'apprentissage bilingue complète avec coaching alimenté par l'IA et préparation aux examens ELS.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      filter: "edtech",
      featured: true,
    },
    {
      id: 2,
      titleEn: "Government Training Videos",
      titleFr: "Vidéos de formation gouvernementale",
      categoryEn: "Video Production",
      categoryFr: "Production vidéo",
      descEn: "Series of bilingual training videos for federal employee onboarding programs.",
      descFr: "Série de vidéos de formation bilingues pour les programmes d'intégration des employés fédéraux.",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800",
      filter: "video",
      featured: true,
    },
    {
      id: 3,
      titleEn: "Language School Rebrand",
      titleFr: "Refonte de l'image d'une école de langues",
      categoryEn: "Brand Identity",
      categoryFr: "Identité de marque",
      descEn: "Complete brand refresh including logo, visual identity, and marketing materials.",
      descFr: "Refonte complète de la marque incluant logo, identité visuelle et matériel marketing.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      filter: "branding",
      featured: false,
    },
    {
      id: 4,
      titleEn: "Mobile Learning App",
      titleFr: "Application d'apprentissage mobile",
      categoryEn: "App Development",
      categoryFr: "Développement d'application",
      descEn: "Cross-platform mobile app for on-the-go language learning with offline capabilities.",
      descFr: "Application mobile multiplateforme pour l'apprentissage des langues en déplacement avec capacités hors ligne.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      filter: "web",
      featured: true,
    },
    {
      id: 5,
      titleEn: "Documentary: Bilingual Canada",
      titleFr: "Documentaire: Canada bilingue",
      categoryEn: "Documentary",
      categoryFr: "Documentaire",
      descEn: "Award-winning documentary exploring the history and future of bilingualism in Canada.",
      descFr: "Documentaire primé explorant l'histoire et l'avenir du bilinguisme au Canada.",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
      filter: "video",
      featured: false,
    },
    {
      id: 6,
      titleEn: "Corporate Training Portal",
      titleFr: "Portail de formation corporative",
      categoryEn: "Web Platform",
      categoryFr: "Plateforme web",
      descEn: "Custom LMS for a Fortune 500 company with advanced analytics and reporting.",
      descFr: "LMS personnalisé pour une entreprise Fortune 500 avec analytique avancée et rapports.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
      filter: "web",
      featured: false,
    },
    {
      id: 7,
      titleEn: "Podcast Series Production",
      titleFr: "Production de série de podcasts",
      categoryEn: "Audio Production",
      categoryFr: "Production audio",
      descEn: "Weekly bilingual podcast about language learning tips and cultural insights.",
      descFr: "Podcast bilingue hebdomadaire sur les conseils d'apprentissage des langues et les perspectives culturelles.",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800",
      filter: "video",
      featured: false,
    },
    {
      id: 8,
      titleEn: "EdTech Startup Branding",
      titleFr: "Image de marque pour startup EdTech",
      categoryEn: "Brand Identity",
      categoryFr: "Identité de marque",
      descEn: "Full brand development for an emerging language learning startup.",
      descFr: "Développement complet de la marque pour une startup émergente d'apprentissage des langues.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      filter: "branding",
      featured: false,
    },
  ];

  const filteredProjects = activeFilter === "all" 
    ? PROJECTS 
    : PROJECTS.filter(p => p.filter === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4 relative overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {language === "en" ? "Our Portfolio" : "Notre portfolio"}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {language === "en"
                  ? "Explore our work across video production, web development, branding, and EdTech solutions"
                  : "Explorez nos travaux en production vidéo, développement web, image de marque et solutions EdTech"
                }
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? "bg-[#D4AF37] text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {language === "en" ? filter.labelEn : filter.labelFr}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative rounded-2xl overflow-hidden ${
                    project.featured ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <img 
                    src={project.image} 
                    alt={language === "en" ? project.titleEn : project.titleFr}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      project.featured ? "h-[400px] md:h-full" : "h-64"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="text-xs text-[#D4AF37] font-medium mb-2">
                      {language === "en" ? project.categoryEn : project.categoryFr}
                    </span>
                    <h3 className={`font-bold text-white mb-2 ${project.featured ? "text-2xl" : "text-lg"}`}>
                      {language === "en" ? project.titleEn : project.titleFr}
                    </h3>
                    <p className={`text-gray-300 mb-4 ${project.featured ? "text-base" : "text-sm"} line-clamp-2`}>
                      {language === "en" ? project.descEn : project.descFr}
                    </p>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-[#D4AF37] hover:bg-[#B8962E] text-black rounded-full">
                        {language === "en" ? "View Project" : "Voir le projet"}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-bold">
                      {language === "en" ? "FEATURED" : "EN VEDETTE"}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center text-black">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? "Have a Project in Mind?" : "Vous avez un projet en tête?"}
              </h2>
              <p className="text-xl text-black/80 mb-10">
                {language === "en"
                  ? "Let's create something amazing together"
                  : "Créons quelque chose d'incroyable ensemble"
                }
              </p>
              <Link href="/barholex/contact">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 h-14 text-lg font-semibold bg-black text-[#D4AF37] hover:bg-gray-900"
                >
                  {language === "en" ? "Start a Project" : "Démarrer un projet"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

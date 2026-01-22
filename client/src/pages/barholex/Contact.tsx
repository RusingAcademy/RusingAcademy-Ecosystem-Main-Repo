import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Video,
  PenTool,
  Monitor,
  Sparkles,
} from "lucide-react";

export default function BarholexContact() {
  const { language } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const projectTypes = [
    { value: "video", labelEn: "Video Production", labelFr: "Production vidéo" },
    { value: "audio", labelEn: "Audio Production", labelFr: "Production audio" },
    { value: "design", labelEn: "Graphic Design", labelFr: "Design graphique" },
    { value: "web", labelEn: "Web Development", labelFr: "Développement web" },
    { value: "localization", labelEn: "Localization", labelFr: "Localisation" },
    { value: "ai", labelEn: "AI Solutions", labelFr: "Solutions IA" },
    { value: "multiple", labelEn: "Multiple Services", labelFr: "Services multiples" },
  ];

  const budgets = [
    { value: "5k-10k", labelEn: "$5,000 - $10,000", labelFr: "5 000 $ - 10 000 $" },
    { value: "10k-25k", labelEn: "$10,000 - $25,000", labelFr: "10 000 $ - 25 000 $" },
    { value: "25k-50k", labelEn: "$25,000 - $50,000", labelFr: "25 000 $ - 50 000 $" },
    { value: "50k-100k", labelEn: "$50,000 - $100,000", labelFr: "50 000 $ - 100 000 $" },
    { value: "100k+", labelEn: "$100,000+", labelFr: "100 000 $+" },
    { value: "discuss", labelEn: "Let's discuss", labelFr: "À discuter" },
  ];

  const timelines = [
    { value: "asap", labelEn: "ASAP", labelFr: "Dès que possible" },
    { value: "1month", labelEn: "Within 1 month", labelFr: "Dans 1 mois" },
    { value: "3months", labelEn: "Within 3 months", labelFr: "Dans 3 mois" },
    { value: "6months", labelEn: "Within 6 months", labelFr: "Dans 6 mois" },
    { value: "flexible", labelEn: "Flexible", labelFr: "Flexible" },
  ];

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
        <Header />
        <main className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {language === "en" ? "Message Received!" : "Message reçu!"}
              </h1>
              <p className="text-lg text-gray-400 mb-6">
                {language === "en"
                  ? "Thank you for reaching out. Our team will review your project details and get back to you within 24 hours."
                  : "Merci de nous avoir contactés. Notre équipe examinera les détails de votre projet et vous répondra dans les 24 heures."
                }
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {language === "en" ? "Expected response: 24 hours" : "Réponse attendue: 24 heures"}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <Header />
      
      <main id="main-content" className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {language === "en" ? "Let's Create Together" : "Créons ensemble"}
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                {language === "en"
                  ? "Tell us about your project and we'll bring your vision to life"
                  : "Parlez-nous de votre projet et nous donnerons vie à votre vision"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8962E] text-black">
                    <h3 className="text-xl font-bold mb-4">
                      {language === "en" ? "Contact Information" : "Coordonnées"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Email</p>
                          <a href="mailto:hello@barholexmedia.com" className="text-black/80 hover:text-black">
                            hello@barholexmedia.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 mt-0.5" />
                        <div>
                          <p className="font-medium">{language === "en" ? "Phone" : "Téléphone"}</p>
                          <a href="tel:+16135551234" className="text-black/80 hover:text-black">
                            +1 (613) 555-1234
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5" />
                        <div>
                          <p className="font-medium">{language === "en" ? "Studio" : "Studio"}</p>
                          <p className="text-black/80">
                            Ottawa, Ontario, Canada
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <h3 className="font-bold text-white mb-4">
                      {language === "en" ? "Our Services" : "Nos services"}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Video className="w-4 h-4 text-[#D4AF37]" />
                        {language === "en" ? "Video Production" : "Production vidéo"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <PenTool className="w-4 h-4 text-[#D4AF37]" />
                        {language === "en" ? "Graphic Design" : "Design graphique"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Monitor className="w-4 h-4 text-[#D4AF37]" />
                        {language === "en" ? "Web Development" : "Développement web"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        {language === "en" ? "AI Solutions" : "Solutions IA"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Your Name" : "Votre nom"} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        placeholder={language === "en" ? "John Doe" : "Jean Dupont"}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Email Address" : "Adresse courriel"} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        placeholder="email@company.com"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Company/Organization" : "Entreprise/Organisation"}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        placeholder={language === "en" ? "Company name" : "Nom de l'entreprise"}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Phone Number" : "Numéro de téléphone"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        placeholder="+1 (613) 555-1234"
                      />
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Project Type" : "Type de projet"} *
                      </label>
                      <select
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      >
                        <option value="" className="bg-gray-900">{language === "en" ? "Select type" : "Sélectionnez le type"}</option>
                        {projectTypes.map((type) => (
                          <option key={type.value} value={type.value} className="bg-gray-900">
                            {language === "en" ? type.labelEn : type.labelFr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Budget Range" : "Fourchette budgétaire"}
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      >
                        <option value="" className="bg-gray-900">{language === "en" ? "Select budget" : "Sélectionnez le budget"}</option>
                        {budgets.map((budget) => (
                          <option key={budget.value} value={budget.value} className="bg-gray-900">
                            {language === "en" ? budget.labelEn : budget.labelFr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timeline */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Timeline" : "Échéancier"}
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      >
                        <option value="" className="bg-gray-900">{language === "en" ? "Select timeline" : "Sélectionnez l'échéancier"}</option>
                        {timelines.map((timeline) => (
                          <option key={timeline.value} value={timeline.value} className="bg-gray-900">
                            {language === "en" ? timeline.labelEn : timeline.labelFr}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {language === "en" ? "Project Details" : "Détails du projet"} *
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"
                        placeholder={language === "en" 
                          ? "Tell us about your project, goals, and any specific requirements..."
                          : "Parlez-nous de votre projet, vos objectifs et toute exigence spécifique..."
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-black rounded-full h-14 text-lg font-semibold"
                    >
                      {language === "en" ? "Send Message" : "Envoyer le message"}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

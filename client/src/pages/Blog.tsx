import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const labels = {
  en: {
    title: "Blog",
    subtitle: "Tips, strategies, and insights for SLE success",
    featured: "Featured",
    readMore: "Read More",
    minRead: "min read",
    searchPlaceholder: "Search articles...",
    noResults: "No articles found. Check back soon!",
    loadMore: "Load More",
    categories: {
      all: "All Posts",
      sle: "SLE Tips",
      grammar: "Grammar",
      vocabulary: "Vocabulary",
      speaking: "Speaking",
      success: "Success Stories",
    },
    subscribe: {
      title: "Subscribe to Our Newsletter",
      description: "Get weekly tips and resources for SLE preparation delivered to your inbox.",
      placeholder: "Enter your email",
      button: "Subscribe",
      privacy: "We respect your privacy. Unsubscribe at any time.",
    },
    comingSoon: "Full article coming soon. Subscribe to be notified!",
  },
  fr: {
    title: "Blogue",
    subtitle: "Conseils, stratégies et perspectives pour réussir vos ELS",
    featured: "À la une",
    readMore: "Lire la suite",
    minRead: "min de lecture",
    searchPlaceholder: "Rechercher des articles...",
    noResults: "Aucun article trouvé. Revenez bientôt!",
    loadMore: "Charger plus",
    categories: {
      all: "Tous les articles",
      sle: "Conseils ELS",
      grammar: "Grammaire",
      vocabulary: "Vocabulaire",
      speaking: "Expression orale",
      success: "Histoires de réussite",
    },
    subscribe: {
      title: "Abonnez-vous à notre infolettre",
      description: "Recevez des conseils et des ressources hebdomadaires pour la préparation aux ELS directement dans votre boîte de réception.",
      placeholder: "Entrez votre courriel",
      button: "S'abonner",
      privacy: "Nous respectons votre vie privée. Désabonnez-vous à tout moment.",
    },
    comingSoon: "Article complet à venir. Abonnez-vous pour être notifié!",
  },
};

// Static fallback posts when no DB posts exist
const staticPosts = [
  {
    id: 1, slug: "5-strategies-sle-oral-exam",
    title: "5 Strategies to Ace Your SLE Oral Exam",
    titleFr: "5 stratégies pour réussir votre examen oral ELS",
    excerpt: "Discover proven techniques used by successful candidates to achieve Level C in oral interaction.",
    excerptFr: "Découvrez les techniques éprouvées utilisées par les candidats qui ont réussi à atteindre le niveau C en interaction orale.",
    category: "sle", publishedAt: "2026-01-05", featuredImageUrl: null, viewCount: 0,
  },
  {
    id: 2, slug: "common-french-grammar-mistakes",
    title: "Common French Grammar Mistakes to Avoid",
    titleFr: "Erreurs de grammaire française courantes à éviter",
    excerpt: "Learn about the most frequent grammatical errors English speakers make when learning French.",
    excerptFr: "Découvrez les erreurs grammaticales les plus fréquentes que font les anglophones en apprenant le français.",
    category: "grammar", publishedAt: "2026-01-03", featuredImageUrl: null, viewCount: 0,
  },
  {
    id: 3, slug: "building-vocabulary-federal-workplace",
    title: "Building Vocabulary for Federal Workplace Communication",
    titleFr: "Vocabulaire pour la communication en milieu de travail fédéral",
    excerpt: "Essential vocabulary and expressions for briefings, meetings, and written communications.",
    excerptFr: "Vocabulaire et expressions essentiels pour les séances d'information, les réunions et les communications écrites.",
    category: "vocabulary", publishedAt: "2025-12-28", featuredImageUrl: null, viewCount: 0,
  },
  {
    id: 4, slug: "from-bbb-to-cbc-maries-success-story",
    title: "From BBB to CBC: Marie's Success Story",
    titleFr: "De BBB à CBC : L'histoire de réussite de Marie",
    excerpt: "How a policy analyst improved her French proficiency in just 6 months using Lingueefy coaches.",
    excerptFr: "Comment une analyste de politiques a amélioré sa maîtrise du français en seulement 6 mois.",
    category: "success", publishedAt: "2025-12-20", featuredImageUrl: null, viewCount: 0,
  },
  {
    id: 5, slug: "how-to-practice-speaking-when-shy",
    title: "How to Practice Speaking When You're Shy",
    titleFr: "Comment pratiquer l'oral quand on est timide",
    excerpt: "Practical tips for introverts and those who feel anxious about speaking a second language.",
    excerptFr: "Conseils pratiques pour les introvertis et ceux qui se sentent anxieux à l'idée de parler une langue seconde.",
    category: "speaking", publishedAt: "2025-12-15", featuredImageUrl: null, viewCount: 0,
  },
  {
    id: 6, slug: "understanding-sle-scoring-system",
    title: "Understanding the SLE Scoring System",
    titleFr: "Comprendre le système de notation ELS",
    excerpt: "A complete breakdown of how SLE exams are scored and what evaluators look for at each level.",
    excerptFr: "Une analyse complète de la façon dont les examens ELS sont notés et ce que les évaluateurs recherchent.",
    category: "sle", publishedAt: "2025-12-10", featuredImageUrl: null, viewCount: 0,
  },
];

const categoryEmoji: Record<string, string> = {
  sle: "📋", grammar: "📝", vocabulary: "📖", success: "🏆", speaking: "🎤",
};

export default function Blog() {
  const { language } = useLanguage();
  const t = labels[language];
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Fetch published blog posts from the database
  const { data, isLoading } = trpc.kajabiBlog.publicList.useQuery({
    category: selectedCategory,
    limit: 50,
  });

  // Use DB posts if available, otherwise fall back to static posts
  const dbPosts = data?.items ?? [];
  const posts = dbPosts.length > 0 ? dbPosts : staticPosts;
  const filteredPosts = selectedCategory
    ? posts.filter((p: any) => p.category === selectedCategory)
    : posts;

  const getTitle = (post: any) =>
    language === "fr" && post.titleFr ? post.titleFr : post.title;
  const getExcerpt = (post: any) =>
    language === "fr" && post.excerptFr ? post.excerptFr : post.excerpt;

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "fr" ? "fr-CA" : "en-CA", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={t.title}
        description={language === "fr"
          ? "Conseils, stratégies et ressources pour la préparation aux ELS et l'apprentissage des langues."
          : "Insights, tips, and resources for bilingual professionals. SLE preparation strategies and language learning advice."}
        canonical="/blog"
      />

      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-b border-border">
          <div className="container max-w-6xl">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(t.categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key === "all" ? undefined : key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (key === "all" && !selectedCategory) || selectedCategory === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="py-12">
            <div className="container max-w-6xl text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
                <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
              </div>
            </div>
          </section>
        )}

        {/* No Results */}
        {!isLoading && filteredPosts.length === 0 && (
          <section className="py-16">
            <div className="container max-w-6xl text-center">
              <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">{t.noResults}</p>
            </div>
          </section>
        )}

        {/* Featured Post */}
        {!isLoading && featuredPost && (
          <section className="py-6 md:py-8 lg:py-12">
            <div className="container max-w-6xl">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="bg-primary/10 aspect-video md:aspect-auto flex items-center justify-center overflow-hidden">
                    {featuredPost.featuredImageUrl ? (
                      <img
                        loading="lazy"
                        src={featuredPost.featuredImageUrl}
                        alt={getTitle(featuredPost)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-3xl md:text-5xl lg:text-6xl">
                        {categoryEmoji[featuredPost.category ?? "sle"] ?? "📚"}
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary w-fit mb-4">
                      {t.featured}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {getTitle(featuredPost)}
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {getExcerpt(featuredPost)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        {formatDate(featuredPost.publishedAt)}
                      </span>
                      {featuredPost.viewCount > 0 && (
                        <span className="text-xs">
                          {featuredPost.viewCount} {language === "fr" ? "vues" : "views"}
                        </span>
                      )}
                    </div>
                    {featuredPost.slug ? (
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline w-fit"
                      >
                        {t.readMore}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => toast.info(t.comingSoon)}
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline w-fit"
                      >
                        {t.readMore}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        {!isLoading && regularPosts.length > 0 && (
          <section className="py-6 md:py-8 lg:py-12">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post: any) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="bg-primary/5 aspect-video flex items-center justify-center overflow-hidden">
                      {post.featuredImageUrl ? (
                        <img
                          loading="lazy"
                          src={post.featuredImageUrl}
                          alt={getTitle(post)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-xl md:text-3xl lg:text-4xl">
                          {categoryEmoji[post.category ?? "sle"] ?? "📚"}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground mb-3">
                        {t.categories[post.category as keyof typeof t.categories] ?? post.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {getTitle(post)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {getExcerpt(post)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          {formatDate(post.publishedAt)}
                        </span>
                        {post.viewCount > 0 && (
                          <span>{post.viewCount} {language === "fr" ? "vues" : "views"}</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Subscribe */}
        <section className="py-8 md:py-12 lg:py-16 bg-primary/5">
          <div className="container max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t.subscribe.title}
            </h2>
            <p className="text-muted-foreground mb-8">{t.subscribe.description}</p>
            <form
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                toast.info(t.comingSoon);
              }}
            >
              <label htmlFor="email-subscribe" className="sr-only">Email</label>
              <input
                id="email-subscribe"
                type="email"
                placeholder={t.subscribe.placeholder}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t.subscribe.button}
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">{t.subscribe.privacy}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft, Eye } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

export default function BlogPost() {
  const { language } = useLanguage();
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.kajabiBlog.getBySlug.useQuery(
    { slug: params.slug ?? "" },
    { enabled: !!params.slug }
  );

  const getTitle = () =>
    language === "fr" && post?.titleFr ? post.titleFr : post?.title ?? "";
  const getContent = () =>
    language === "fr" && post?.contentFr ? post.contentFr : post?.content ?? "";
  const getExcerpt = () =>
    language === "fr" && post?.excerptFr ? post.excerptFr : post?.excerpt ?? "";

  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "fr" ? "fr-CA" : "en-CA", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-16">
          <div className="container max-w-3xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-64 bg-muted rounded" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-16">
          <div className="container max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {language === "fr" ? "Article non trouvé" : "Article Not Found"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === "fr"
                ? "Cet article n'existe pas ou a été retiré."
                : "This article doesn't exist or has been removed."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "fr" ? "Retour au blogue" : "Back to Blog"}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={getTitle()}
        description={getExcerpt()}
        canonical={`/blog/${post.slug}`}
      />

      <main className="flex-1" id="main-content">
        {/* Back link */}
        <div className="container max-w-3xl pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "fr" ? "Retour au blogue" : "Back to Blog"}
          </Link>
        </div>

        {/* Article Header */}
        <article className="py-8 md:py-12">
          <div className="container max-w-3xl">
            {post.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {getTitle()}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              {(post.viewCount ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  {post.viewCount} {language === "fr" ? "vues" : "views"}
                </span>
              )}
            </div>

            {/* Featured Image */}
            {post.featuredImageUrl && (
              <div className="rounded-xl overflow-hidden mb-8">
                <img
                  loading="lazy"
                  src={post.featuredImageUrl}
                  alt={getTitle()}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: getContent() }}
            />
          </div>
        </article>

        {/* Back to Blog CTA */}
        <section className="py-8 border-t border-border">
          <div className="container max-w-3xl text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "fr" ? "Voir tous les articles" : "View All Articles"}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Public Landing Page Renderer — Phase 8.1
 * Renders a published landing page by slug at /p/:slug
 */
import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";
import { SectionRenderer } from "@/components/templates/SectionRenderer";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function LandingPage() {
  const params = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = trpc.landingPages.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!page || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-500">Page not found</p>
        </div>
      </div>
    );
  }

  const sections = (page.sections as any[]) || [];

  return (
    <>
      <Helmet>
        <title>{page.metaTitle || page.title}</title>
        {page.metaDescription && <meta name="description" content={page.metaDescription} />}
        {page.ogImage && <meta property="og:image" content={page.ogImage} />}
        <meta property="og:title" content={page.metaTitle || page.title} />
        {page.metaDescription && <meta property="og:description" content={page.metaDescription} />}
      </Helmet>
      <main>
        {sections.sort((a: any, b: any) => a.order - b.order).map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    </>
  );
}

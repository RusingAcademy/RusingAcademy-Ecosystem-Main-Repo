import { getDb } from "../db";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.VITE_APP_URL || "https://rusingacademy.manus.space";

interface SitemapUrl {
  loc: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  lastmod?: string;
}

// Static public routes
const staticRoutes: SitemapUrl[] = [
  { loc: "/", changefreq: "weekly", priority: 1.0 },
  { loc: "/rusingacademy", changefreq: "weekly", priority: 0.9 },
  { loc: "/lingueefy", changefreq: "weekly", priority: 0.9 },
  { loc: "/barholex", changefreq: "weekly", priority: 0.9 },
  { loc: "/courses", changefreq: "daily", priority: 0.8 },
  { loc: "/paths", changefreq: "weekly", priority: 0.8 },
  { loc: "/curriculum", changefreq: "weekly", priority: 0.8 },
  { loc: "/coaches", changefreq: "weekly", priority: 0.8 },
  { loc: "/pricing", changefreq: "monthly", priority: 0.8 },
  { loc: "/about", changefreq: "monthly", priority: 0.7 },
  { loc: "/contact", changefreq: "monthly", priority: 0.7 },
  { loc: "/community", changefreq: "weekly", priority: 0.7 },
  { loc: "/leaderboard", changefreq: "daily", priority: 0.6 },
  { loc: "/faq", changefreq: "monthly", priority: 0.6 },
  { loc: "/how-it-works", changefreq: "monthly", priority: 0.6 },
  { loc: "/for-business", changefreq: "monthly", priority: 0.7 },
  { loc: "/for-departments", changefreq: "monthly", priority: 0.7 },
  { loc: "/blog", changefreq: "weekly", priority: 0.6 },
  { loc: "/careers", changefreq: "monthly", priority: 0.5 },
  { loc: "/become-a-coach", changefreq: "monthly", priority: 0.6 },
  { loc: "/privacy", changefreq: "yearly", priority: 0.3 },
  { loc: "/terms", changefreq: "yearly", priority: 0.3 },
  { loc: "/accessibility", changefreq: "yearly", priority: 0.3 },
  { loc: "/cookie-policy", changefreq: "yearly", priority: 0.3 },
];

async function getDynamicRoutes(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];

  try {
    const db = await getDb();
    if (!db) return urls;

    // Published courses
    const { courses } = await import("../../drizzle/schema");
    const publishedCourses = await db
      .select({ slug: courses.slug, updatedAt: courses.updatedAt })
      .from(courses)
      .where(eq(courses.status, "published"));

    for (const course of publishedCourses) {
      if (course.slug) {
        urls.push({
          loc: `/courses/${course.slug}`,
          changefreq: "weekly",
          priority: 0.7,
          lastmod: course.updatedAt ? new Date(course.updatedAt).toISOString().split("T")[0] : undefined,
        });
      }
    }

    // Published paths
    const { learningPaths } = await import("../../drizzle/schema");
    const publishedPaths = await db
      .select({ slug: learningPaths.slug, updatedAt: learningPaths.updatedAt })
      .from(learningPaths)
      .where(eq(learningPaths.status, "published"));

    for (const path of publishedPaths) {
      if (path.slug) {
        urls.push({
          loc: `/paths/${path.slug}`,
          changefreq: "weekly",
          priority: 0.7,
          lastmod: path.updatedAt ? new Date(path.updatedAt).toISOString().split("T")[0] : undefined,
        });
      }
    }

    // Coach profiles
    const { coachProfiles, users } = await import("../../drizzle/schema");
    const approvedCoaches = await db
      .select({ userId: coachProfiles.userId })
      .from(coachProfiles)
      .where(eq(coachProfiles.status, "approved"));

    for (const coach of approvedCoaches) {
      urls.push({
        loc: `/coaches/${coach.userId}`,
        changefreq: "monthly",
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching dynamic routes:", error);
  }

  return urls;
}

export async function generateSitemapXml(): Promise<string> {
  const dynamicRoutes = await getDynamicRoutes();
  const allUrls = [...staticRoutes, ...dynamicRoutes];
  const today = new Date().toISOString().split("T")[0];

  const urlEntries = allUrls
    .map((url) => {
      const lastmod = url.lastmod || today;
      return `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /learner/
Disallow: /coach/
Disallow: /settings/
Disallow: /hr/

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

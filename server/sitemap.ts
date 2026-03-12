import { getDb } from './db';

/**
 * Generate sitemap.xml for all pages and properties
 */
export async function generateSitemap(): Promise<string> {
  const db = await getDb();
  const baseUrl = 'https://sheikhprop-p3nkkbke.manus.space';

  // Static pages
  const staticPages = [
    { url: '/', lastmod: new Date().toISOString().split('T')[0], priority: '1.0', changefreq: 'weekly' },
    { url: '/properties', lastmod: new Date().toISOString().split('T')[0], priority: '0.9', changefreq: 'daily' },
    { url: '/projects', lastmod: new Date().toISOString().split('T')[0], priority: '0.9', changefreq: 'weekly' },
    { url: '/about', lastmod: new Date().toISOString().split('T')[0], priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', lastmod: new Date().toISOString().split('T')[0], priority: '0.8', changefreq: 'monthly' },
  ];

  let dynamicUrls: any[] = [];

  // Get properties from database
  if (db) {
    try {
      const { properties } = await import('../drizzle/schema');
      const props = await db.select().from(properties);
      dynamicUrls = props.map((prop: any) => ({
        url: `/property/${slugify(prop.title)}-${prop.id}`,
        lastmod: prop.updatedAt?.toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'weekly',
      }));
    } catch (error) {
      console.error('Error fetching properties for sitemap:', error);
    }
  }

  // Get projects from database
  if (db) {
    try {
      const { projects } = await import('../drizzle/schema');
      const projs = await db.select().from(projects);
      const projectUrls = projs.map((proj: any) => ({
        url: `/projects/${slugify(proj.name)}-${proj.id}`,
        lastmod: proj.updatedAt?.toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'weekly',
      }));
      dynamicUrls = [...dynamicUrls, ...projectUrls];
    } catch (error) {
      console.error('Error fetching projects for sitemap:', error);
    }
  }

  // Combine all URLs
  const allUrls = [...staticPages, ...dynamicUrls];

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of allUrls) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${item.url}</loc>\n`;
    if (item.lastmod) {
      xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return xml;
}

/**
 * Convert text to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate robots.txt content
 */
export function generateRobots(): string {
  return `User-agent: *
Allow: /
Allow: /properties
Allow: /projects
Allow: /about
Allow: /contact
Disallow: /admin
Disallow: /api/
Disallow: /*.json$
Disallow: /*.pdf$

Sitemap: https://sheikhprop-p3nkkbke.manus.space/sitemap.xml

# Crawl delay for search engines
Crawl-delay: 1

# Specific rules for Googlebot
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Specific rules for Bingbot
User-agent: Bingbot
Allow: /
Crawl-delay: 1
`;
}

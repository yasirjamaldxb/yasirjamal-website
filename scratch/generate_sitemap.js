import fs from 'fs';

const pages = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: 'about/', priority: '0.9', changefreq: 'monthly' },
  { url: 'portfolio/', priority: '0.9', changefreq: 'weekly' },
  { url: 'portfolio/julphar/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/abayadore/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/prime-middle-east/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/hunza-global/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/markwilliams/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/fila-tech/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/alston-clayden/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/alomaids/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/westminster-properties/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/skylynx/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/dubai-podiatrist/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/noor-abu-dhabi/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/paws-and-planes/', priority: '0.8', changefreq: 'monthly' },
  { url: 'portfolio/baanpaa/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/', priority: '0.9', changefreq: 'weekly' },
  { url: 'blog/astro-vs-wordpress-speed-performance-guide/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/conversion-rate-optimization-cro-lead-generation/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/dubai-technical-seo-audit-ranking-guide/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/generative-engine-optimization-geo-ai-search/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/hiring-freelance-web-designer-vs-agency-dubai/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/modern-web-design-trends-2026/', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog/sub-second-ecommerce-architecture-gcc-scaling/', priority: '0.8', changefreq: 'monthly' },
  { url: 'privacy-policy/', priority: '0.4', changefreq: 'yearly' },
  { url: 'terms/', priority: '0.4', changefreq: 'yearly' }
];

const today = new Date().toISOString().split('T')[0];
const baseUrl = 'https://yasirjamal.com';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${baseUrl}/${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
fs.writeFileSync('public/sitemap-0.xml', xml, 'utf8');

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-0.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync('public/sitemap-index.xml', sitemapIndex, 'utf8');
console.log('✓ Generated public/sitemap.xml without design-system');

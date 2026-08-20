import fs from 'fs';
import path from 'path';

const blogDir = 'src/pages/blog';
const files = fs.readdirSync(blogDir);

for (const file of files) {
  if (file !== 'index.astro' && file.endsWith('.astro')) {
    const fullPath = path.join(blogDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    if (!content.includes('articleSchema')) {
      const schemaCode = `
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.title,
  "description": article.description,
  "image": article.image ? \`https://yasirjamal.com\${article.image}\` : "https://yasirjamal.com/images/hero_v3.webp",
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Person",
    "name": "Yasir Jamal",
    "url": "https://yasirjamal.com/#yasirjamal",
    "jobTitle": "Senior Product Designer & Web Architect"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Yasir Jamal",
    "url": "https://yasirjamal.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yasirjamal.com/images/logo.webp"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": pageUrl
  }
};
---`;
      content = content.replace(/\n---\s*\n\s*<Layout/m, `\n${schemaCode}\n\n<Layout`);
      content = content.replace(
        '<SEO title={`${article.title} | Yasir Jamal Blog`} description={article.description} url={pageUrl} />',
        '<SEO title={`${article.title} | Yasir Jamal Blog`} description={article.description} url={pageUrl} image={article.image} type="article" />\n    <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />'
      );
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✓ Added BlogPosting schema to ${file}`);
    }
  }
}

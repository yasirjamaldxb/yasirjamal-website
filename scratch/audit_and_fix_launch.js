import fs from 'fs';
import path from 'path';

const searchDir = 'src';
const oldDomainRegex = /https?:\/\/(?:lawngreen-toad-836930\.hostingersite\.com|yasirjamaldxb\.github\.io\/yasirjamal-website)/g;
const newDomain = 'https://yasirjamal.com';

function scanAndFix(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanAndFix(fullPath);
    } else if (/\.(astro|js|ts|json|mjs|html|md|txt)$/.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (oldDomainRegex.test(content)) {
        console.log(`Fixing domain references in: ${fullPath}`);
        content = content.replace(oldDomainRegex, newDomain);
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

scanAndFix('src');
scanAndFix('public');

// Also create public/CNAME for custom domain GitHub Pages support
fs.writeFileSync('public/CNAME', 'yasirjamal.com\n', 'utf8');
console.log('✓ Created public/CNAME with yasirjamal.com');

// Also check public/robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://yasirjamal.com/sitemap-index.xml
Sitemap: https://yasirjamal.com/sitemap-0.xml
`;
fs.writeFileSync('public/robots.txt', robotsTxt, 'utf8');
console.log('✓ Updated public/robots.txt for yasirjamal.com');

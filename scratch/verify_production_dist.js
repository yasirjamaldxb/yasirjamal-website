import fs from 'fs';
import path from 'path';

let errors = 0;
let checkedFiles = 0;

function checkHtmlFile(filePath) {
  checkedFiles++;
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check images
  const imgMatches = content.matchAll(/<img[^>]+src=["']([^"']+)["']/g);
  for (const match of imgMatches) {
    const src = match[1];
    if (src.startsWith('/')) {
      const assetPath = path.join('dist', src);
      if (!fs.existsSync(assetPath)) {
        console.error(`[ERROR] Broken image in ${filePath}: ${src}`);
        errors++;
      }
    }
  }

  // 2. Check canonical URL
  const canonicalMatch = content.match(/<link rel=["']canonical["'] href=["']([^"']+)["']/);
  if (!canonicalMatch) {
    console.warn(`[WARN] Missing canonical tag in ${filePath}`);
  } else if (!canonicalMatch[1].startsWith('https://yasirjamal.com')) {
    console.error(`[ERROR] Non-production canonical in ${filePath}: ${canonicalMatch[1]}`);
    errors++;
  }

  // 3. Check JSON-LD
  const jsonLdMatches = content.matchAll(/<script type=["']application\/ld\+json["']>([^<]+)<\/script>/g);
  for (const match of jsonLdMatches) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      console.error(`[ERROR] Invalid JSON-LD in ${filePath}: ${e.message}`);
      errors++;
    }
  }
}

function walkDist(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDist(fullPath);
    } else if (file.endsWith('.html')) {
      checkHtmlFile(fullPath);
    }
  }
}

walkDist('dist');
console.log(`\nVerified ${checkedFiles} HTML pages in dist/. Total errors: ${errors}`);

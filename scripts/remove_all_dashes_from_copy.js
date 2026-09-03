import fs from 'fs';
import path from 'path';

const filesToClean = [
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/layouts/Layout.astro',
  'src/components/Header.astro',
  'src/components/Footer.astro'
];

filesToClean.forEach(relPath => {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  // Replace HTML entities
  content = content.replace(/&mdash;/g, '.');
  content = content.replace(/&ndash;/g, 'to');
  content = content.replace(/\s+—\s+/g, '. ');
  content = content.replace(/\s+–\s+/g, ' to ');
  content = content.replace(/ — /g, '. ');
  content = content.replace(/ – /g, ' to ');

  // Replace text patterns like " - " in prose
  content = content.replace(/Senior Web Architect — Zero/g, 'Senior Web Architect. Zero');
  content = content.replace(/Senior Web Architect — /g, 'Senior Web Architect. ');
  content = content.replace(/day one — zero/g, 'day one. Zero');
  content = content.replace(/day one — /g, 'day one. ');
  content = content.replace(/ — /g, '. ');

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Cleaned dashes from: ${relPath}`);
  }
});
console.log('Finished removing all dashes from copy.');

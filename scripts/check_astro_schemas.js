import fs from 'fs';
import path from 'path';

function checkAstroDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkAstroDir(fullPath);
    } else if (file.endsWith('.astro')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const ldMatches = content.match(/type="application\/ld\+json"/gi);
      if (ldMatches && ldMatches.length > 1) {
        console.log(`⚠️ Multiple ld+json tags (${ldMatches.length}) in: ${fullPath}`);
      }
    }
  }
}

console.log('Checking all .astro files for multiple schema script tags...');
checkAstroDir('src');
console.log('Done.');

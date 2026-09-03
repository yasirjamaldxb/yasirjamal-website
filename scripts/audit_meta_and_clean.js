import fs from 'fs';
import path from 'path';

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      checkDir(fp);
    } else if (f.endsWith('.astro')) {
      const c = fs.readFileSync(fp, 'utf8');
      
      // Check title and description
      const lines = c.split('\n');
      lines.forEach((line, idx) => {
        if (/title|description|meta/i.test(line)) {
          if (/@|\+971|552600494|webandgraphicdesigner|055/.test(line)) {
            console.log(`[${fp}:${idx + 1}] -> ${line.trim()}`);
          }
        }
      });
    }
  }
}

console.log('Auditing all meta tags, titles, and descriptions in src/ ...');
checkDir('src');
console.log('Audit complete.');

import fs from 'fs';
import path from 'path';

function auditFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      auditFiles(fullPath);
    } else if (file.endsWith('.astro')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for title & description
      const titleMatch = content.match(/title\s*[:=]\s*["'`]([^"'`]+)["'`]/i) ||
                         content.match(/seoTitle\s*=\s*["'`]([^"'`]+)["'`]/i);
      const descMatch = content.match(/description\s*[:=]\s*["'`]([^"'`]+)["'`]/i) ||
                        content.match(/seoDescription\s*=\s*["'`]([^"'`]+)["'`]/i);

      console.log('--------------------------------------------------');
      console.log(`FILE: ${fullPath.replace('src\\pages\\', '')}`);
      console.log(`TITLE: ${titleMatch ? titleMatch[1] : 'NONE'}`);
      console.log(`DESC:  ${descMatch ? descMatch[1] : 'NONE'}`);
    }
  }
}

auditFiles('src/pages');

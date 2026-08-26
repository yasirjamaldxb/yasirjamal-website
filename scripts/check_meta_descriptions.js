import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.astro') || file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('@') && (line.toLowerCase().includes('description') || line.toLowerCase().includes('meta') || line.toLowerCase().includes('schema') || line.toLowerCase().includes('title'))) {
          console.log(`[FOUND @] ${fullPath}:${idx + 1} -> ${line.trim()}`);
        }
        if (line.toLowerCase().includes('nadvi') || line.toLowerCase().includes('yasir') && line.includes('@')) {
          console.log(`[EMAIL FOUND] ${fullPath}:${idx + 1} -> ${line.trim()}`);
        }
      });
    }
  }
}

console.log('Scanning src directory...');
scanDir('src');
console.log('\nScanning public directory...');
scanDir('public');

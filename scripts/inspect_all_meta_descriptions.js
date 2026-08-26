import fs from 'fs';
import path from 'path';

function inspectMetaDescriptions(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      inspectMetaDescriptions(fullPath);
    } else if (file === 'index.html') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
      const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                        content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
      
      console.log('--------------------------------------------------');
      console.log(`PAGE: ${fullPath.replace('dist\\', '').replace('dist/', '')}`);
      console.log(`TITLE: ${titleMatch ? titleMatch[1] : 'NONE'}`);
      console.log(`DESC:  ${descMatch ? descMatch[1] : 'NONE'}`);
    }
  }
}

if (fs.existsSync('dist')) {
  inspectMetaDescriptions('dist');
} else {
  console.log('dist directory not found. Please run build first.');
}

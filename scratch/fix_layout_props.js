import fs from 'fs';
import path from 'path';

function fixPages(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      fixPages(fullPath);
    } else if (item.endsWith('.astro')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('const seoDescription =') && content.includes('<Layout title={seoTitle}>')) {
        content = content.replace('<Layout title={seoTitle}>', '<Layout title={seoTitle} description={seoDescription}>');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      } else if (content.includes('const seoDescription =') && content.includes('<Layout title={title}>')) {
        content = content.replace('<Layout title={title}>', '<Layout title={title} description={seoDescription}>');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

fixPages('src/pages');

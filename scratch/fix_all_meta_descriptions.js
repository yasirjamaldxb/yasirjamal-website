import fs from 'fs';
import path from 'path';

// 1. Fix [slug].astro
const slugPath = 'src/pages/portfolio/[slug].astro';
let slugContent = fs.readFileSync(slugPath, 'utf8');
slugContent = slugContent.replace(
  '<Layout title={`${project.title} - Case Study | Yasir Jamal`}>',
  '<Layout title={`${project.title} - Case Study | Yasir Jamal`} description={project.description}>'
);
fs.writeFileSync(slugPath, slugContent, 'utf8');
console.log('✓ Updated portfolio/[slug].astro');

// 2. Fix all blog post pages
const blogDir = 'src/pages/blog';
const blogFiles = fs.readdirSync(blogDir);
for (const file of blogFiles) {
  if (file !== 'index.astro' && file.endsWith('.astro')) {
    const fullPath = path.join(blogDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(
      '<Layout title={`${article.title} | Yasir Jamal Blog`}>',
      '<Layout title={`${article.title} | Yasir Jamal Blog`} description={article.description}>'
    );
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated ${file}`);
  }
}

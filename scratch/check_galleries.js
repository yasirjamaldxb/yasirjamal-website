import fs from 'fs';

const content = fs.readFileSync('src/pages/portfolio/[slug].astro', 'utf8');
const regex = /"slug":\s*"([^"]+)"[\s\S]*?"gallery":\s*(\[[^\]]+\])/g;

let match;
while ((match = regex.exec(content)) !== null) {
  console.log(match[1], '-->', match[2].replace(/\s+/g, ' '));
}

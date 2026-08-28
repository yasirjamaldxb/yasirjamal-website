import fs from 'fs';

const html = fs.readFileSync('dist/portfolio/alston-clayden/index.html', 'utf8');
const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);

if (schemaMatches) {
  schemaMatches.forEach((s, idx) => {
    console.log(`\n=================== SCHEMA SCRIPT #${idx + 1} ===================`);
    console.log(s);
  });
}

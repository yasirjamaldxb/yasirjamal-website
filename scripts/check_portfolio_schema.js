import fs from 'fs';

const mw = fs.readFileSync('dist/portfolio/markwilliams/index.html', 'utf8');
const matches = mw.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);

console.log('markwilliams schema count:', matches ? matches.length : 0);
if (matches) {
  matches.forEach((m, i) => {
    console.log(`\n--- Script #${i + 1} ---`);
    console.log(m.substring(0, 300) + '...');
  });
}

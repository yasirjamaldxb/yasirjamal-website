const fs = require('fs');

const files = [
  'public/images/portfolio/hunzaglobal.jpg',
  'public/images/portfolio/hunzaglobal_full.jpg',
  'public/images/p_paws_v2.jpg',
  'public/images/portfolio/paws_and_planes_full.jpg'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const stats = fs.statSync(f);
    console.log(`${f}: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.log(`${f}: NOT FOUND`);
  }
}

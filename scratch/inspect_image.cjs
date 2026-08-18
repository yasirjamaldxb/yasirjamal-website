const fs = require('fs');

async function test() {
  // Let's check the size of hunzaglobal_full.jpg
  const stats = fs.statSync('public/images/portfolio/hunzaglobal_full.jpg');
  console.log('Size:', stats.size);
}

test();

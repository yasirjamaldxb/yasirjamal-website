import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const projects = [
  {
    slug: 'julphar',
    domain: 'julphar.net',
    image: 'public/images/portfolio/julphar.jpg',
    bg: 'linear-gradient(145deg, #f4f7fb 0%, #e8edf5 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(21, 89, 231, 0.08) 0%, transparent 70%)'
  },
  {
    slug: 'abayadore',
    domain: 'abayadore.com',
    image: 'public/images/portfolio/abayadore.jpg',
    bg: 'linear-gradient(145deg, #faf7f5 0%, #f1ebe6 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(212, 163, 115, 0.14) 0%, transparent 70%)'
  },
  {
    slug: 'prime-middle-east',
    domain: 'primemiddle-east.com',
    image: 'public/images/portfolio/primemiddleeast.jpg',
    bg: 'linear-gradient(145deg, #f5f7fa 0%, #e9edf2 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(100, 116, 139, 0.1) 0%, transparent 70%)'
  },
  {
    slug: 'hunza-global',
    domain: 'hunzaglobal.com',
    image: 'public/images/portfolio/hunzaglobal.jpg',
    bg: 'linear-gradient(145deg, #f2f9f5 0%, #e3f2ea 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
  },
  {
    slug: 'markwilliams',
    domain: 'markwilliams.ae',
    image: 'public/images/portfolio/markwilliams.jpg',
    bg: 'linear-gradient(145deg, #f3f6fb 0%, #e6ecf6 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
  },
  {
    slug: 'fila-tech',
    domain: 'fila-tech.store',
    image: 'public/images/portfolio/filatech.jpg',
    bg: 'linear-gradient(145deg, #f8f9fa 0%, #eaedf1 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.06) 0%, transparent 70%)'
  },
  {
    slug: 'alston-clayden',
    domain: 'alstonclayden.com',
    image: 'public/images/portfolio/alston_clayden.jpg',
    bg: 'linear-gradient(145deg, #f8f9fb 0%, #ebeef2 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(148, 163, 184, 0.1) 0%, transparent 70%)'
  },
  {
    slug: 'alomaids',
    domain: 'alomaids.com',
    image: 'public/images/portfolio/alomaids.jpg',
    bg: 'linear-gradient(145deg, #f1f9ff 0%, #e2f2fe 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.12) 0%, transparent 70%)'
  },
  {
    slug: 'westminster-properties',
    domain: 'westminsterproperties.ae',
    image: 'public/images/portfolio/westminster.jpg',
    bg: 'linear-gradient(145deg, #faf7f4 0%, #f1eae2 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.08) 0%, transparent 70%)'
  },
  {
    slug: 'skylynx',
    domain: 'skylynx.ae',
    image: 'public/images/portfolio/skylynx.jpg',
    bg: 'linear-gradient(145deg, #f2f5fa 0%, #e4e9f3 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
  },
  {
    slug: 'dubai-podiatrist',
    domain: 'dubaipodiatrist.com',
    image: 'public/images/portfolio/dubai_podiatrist.jpg',
    bg: 'linear-gradient(145deg, #f1f8fc 0%, #e2f0fa 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 70%)'
  },
  {
    slug: 'noor-abu-dhabi',
    domain: 'noorabudhabi.ae',
    image: 'public/images/portfolio/noorabudhabi.jpg',
    bg: 'linear-gradient(145deg, #fefbf0 0%, #fef2d6 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)'
  },
  {
    slug: 'paws-and-planes',
    domain: 'pawsandplanes.ae',
    image: 'public/images/p_paws_v2.jpg',
    bg: 'linear-gradient(145deg, #faf8f5 0%, #f1ede5 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 70%)'
  },
  {
    slug: 'baanpaa',
    domain: 'baanpaa.com',
    image: 'public/images/portfolio/baanpaa.jpg',
    bg: 'linear-gradient(145deg, #f2f8f4 0%, #e4f3e7 100%)',
    accentGlow: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.12) 0%, transparent 70%)'
  }
];

function getBase64Image(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return '';
  }
  const ext = path.extname(fullPath).replace('.', '') || 'jpeg';
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(fullPath).toString('base64');
  return `data:${mimeType};base64,${data}`;
}

async function generate() {
  console.log('Launching browser to render light showcase mockup cards...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: {
      width: 1200,
      height: 900,
      deviceScaleFactor: 2
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const proj of projects) {
    console.log(`Generating light showcase card for ${proj.slug}...`);
    const base64Img = getBase64Image(proj.image);
    if (!base64Img) continue;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1200px;
            height: 900px;
            background: ${proj.bg};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: relative;
            overflow: hidden;
          }
          .glow {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: ${proj.accentGlow};
            pointer-events: none;
          }
          .subtle-border {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border: 1px solid rgba(0, 0, 0, 0.05);
            pointer-events: none;
          }
          .mockup-card {
            width: 1000px;
            height: 640px;
            border-radius: 16px;
            background: #ffffff;
            overflow: hidden;
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.14),
              0 10px 20px -8px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(0, 0, 0, 0.06);
            position: relative;
            z-index: 10;
          }
          .screen-img {
            width: 1000px;
            height: 640px;
            object-fit: cover;
            object-position: top center;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="glow"></div>
        <div class="subtle-border"></div>
        <div class="mockup-card">
          <img src="${base64Img}" class="screen-img" alt="${proj.slug}" />
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'load' });
    await new Promise((r) => setTimeout(r, 150));

    const outPath = path.resolve(`public/images/portfolio/showcase_${proj.slug}.jpg`);
    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 92
    });
    console.log(`✓ Saved ${outPath}`);
  }

  await browser.close();
  console.log('All light showcase thumbnails generated successfully!');
}

generate().catch(err => {
  console.error('Fatal generation error:', err);
  process.exit(1);
});

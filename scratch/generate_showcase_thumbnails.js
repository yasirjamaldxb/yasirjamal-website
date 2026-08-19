import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const projects = [
  {
    slug: 'julphar',
    domain: 'julphar.net',
    image: 'public/images/portfolio/julphar.jpg',
    bg: 'linear-gradient(135deg, #051428 0%, #0a2540 50%, #0f3d68 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(21, 89, 231, 0.35) 0%, transparent 70%)'
  },
  {
    slug: 'abayadore',
    domain: 'abayadore.com',
    image: 'public/images/portfolio/abayadore.jpg',
    bg: 'linear-gradient(135deg, #181311 0%, #2a201c 50%, #3d2e27 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(212, 163, 115, 0.3) 0%, transparent 70%)'
  },
  {
    slug: 'prime-middle-east',
    domain: 'primemiddle-east.com',
    image: 'public/images/portfolio/primemiddleeast.jpg',
    bg: 'linear-gradient(135deg, #0a0f1d 0%, #151e34 50%, #1e2d4a 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.25) 0%, transparent 70%)'
  },
  {
    slug: 'hunza-global',
    domain: 'hunzaglobal.com',
    image: 'public/images/portfolio/hunzaglobal.jpg',
    bg: 'linear-gradient(135deg, #041a14 0%, #093327 50%, #11523f 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)'
  },
  {
    slug: 'markwilliams',
    domain: 'markwilliams.ae',
    image: 'public/images/portfolio/markwilliams.jpg',
    bg: 'linear-gradient(135deg, #060d1f 0%, #0e1b38 50%, #162952 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
  },
  {
    slug: 'fila-tech',
    domain: 'fila-tech.store',
    image: 'public/images/portfolio/filatech.jpg',
    bg: 'linear-gradient(135deg, #111318 0%, #1e222b 50%, #2b303c 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.25) 0%, transparent 70%)'
  },
  {
    slug: 'alston-clayden',
    domain: 'alstonclayden.com',
    image: 'public/images/portfolio/alston_clayden.jpg',
    bg: 'linear-gradient(135deg, #0d0f12 0%, #181b22 50%, #232730 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(203, 213, 225, 0.25) 0%, transparent 70%)'
  },
  {
    slug: 'alomaids',
    domain: 'alomaids.com',
    image: 'public/images/portfolio/alomaids.jpg',
    bg: 'linear-gradient(135deg, #051c2c 0%, #0c3552 50%, #15517a 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(14, 165, 233, 0.35) 0%, transparent 70%)'
  },
  {
    slug: 'westminster-properties',
    domain: 'westminsterproperties.ae',
    image: 'public/images/portfolio/westminster.jpg',
    bg: 'linear-gradient(135deg, #0c1017 0%, #161d2a 50%, #212c3e 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.25) 0%, transparent 70%)'
  },
  {
    slug: 'skylynx',
    domain: 'skylynx.ae',
    image: 'public/images/portfolio/skylynx.jpg',
    bg: 'linear-gradient(135deg, #05080f 0%, #0d121e 50%, #151d2f 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.3) 0%, transparent 70%)'
  },
  {
    slug: 'dubai-podiatrist',
    domain: 'dubaipodiatrist.com',
    image: 'public/images/portfolio/dubai_podiatrist.jpg',
    bg: 'linear-gradient(135deg, #08182b 0%, #0f2c4d 50%, #184270 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.3) 0%, transparent 70%)'
  },
  {
    slug: 'noor-abu-dhabi',
    domain: 'noorabudhabi.ae',
    image: 'public/images/portfolio/noorabudhabi.jpg',
    bg: 'linear-gradient(135deg, #13172c 0%, #202649 50%, #313a6c 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.35) 0%, transparent 70%)'
  },
  {
    slug: 'paws-and-planes',
    domain: 'pawsandplanes.ae',
    image: 'public/images/p_paws_v2.jpg',
    bg: 'linear-gradient(135deg, #0a111f 0%, #131f37 50%, #1e2f50 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.25) 0%, transparent 70%)'
  },
  {
    slug: 'baanpaa',
    domain: 'baanpaa.com',
    image: 'public/images/portfolio/baanpaa.jpg',
    bg: 'linear-gradient(135deg, #091a10 0%, #133320 50%, #1e4d31 100%)',
    accentGlow: 'radial-gradient(circle at 50% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
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
  console.log('Launching browser to render showcase mockup cards...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: {
      width: 1200,
      height: 750,
      deviceScaleFactor: 2
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const proj of projects) {
    console.log(`Generating showcase card for ${proj.slug}...`);
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
            height: 750px;
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
          .grid-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
          }
          .mockup-container {
            width: 1000px;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
            box-shadow: 
              0 30px 60px -15px rgba(0, 0, 0, 0.55),
              0 15px 30px -10px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.15);
            position: relative;
            z-index: 10;
          }
          .browser-bar {
            height: 38px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
          }
          .dots {
            display: flex;
            gap: 7px;
          }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }
          .dot-red { background: #f87171; }
          .dot-yellow { background: #fbbf24; }
          .dot-green { background: #34d399; }
          .url-bar {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 3px 20px;
            font-size: 11px;
            color: #64748b;
            font-weight: 500;
            letter-spacing: 0.2px;
          }
          .right-spacer { width: 50px; }
          .screen-content {
            width: 1000px;
            height: 575px;
            overflow: hidden;
            background: #ffffff;
          }
          .screen-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="glow"></div>
        <div class="grid-overlay"></div>
        <div class="mockup-container">
          <div class="browser-bar">
            <div class="dots">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
            </div>
            <div class="url-bar">${proj.domain}</div>
            <div class="right-spacer"></div>
          </div>
          <div class="screen-content">
            <img src="${base64Img}" class="screen-img" alt="${proj.slug}" />
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'load' });
    await new Promise((r) => setTimeout(r, 200));

    const outPath = path.resolve(`public/images/portfolio/showcase_${proj.slug}.jpg`);
    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 92
    });
    console.log(`✓ Saved ${outPath}`);
  }

  await browser.close();
  console.log('All showcase thumbnails generated successfully!');
}

generate().catch(err => {
  console.error('Fatal generation error:', err);
  process.exit(1);
});

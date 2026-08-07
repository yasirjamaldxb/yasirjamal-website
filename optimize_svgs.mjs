import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

async function fixWhiteSvgs() {
  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'logos_black');

  const files = fs.readdirSync(srcDir);
  
  for (const file of files) {
    if (file.endsWith('.svg')) {
      const srcPath = path.join(srcDir, file);
      let content = fs.readFileSync(srcPath, 'utf8');
      
      // Replace white fills or strokes with black
      content = content
        .replace(/fill=["']#fff(?:fff)?["']/gi, 'fill="#000000"')
        .replace(/fill=["']white["']/gi, 'fill="#000000"')
        .replace(/stroke=["']#fff(?:fff)?["']/gi, 'stroke="#000000"')
        .replace(/stroke=["']white["']/gi, 'stroke="#000000"');
      
      const blackSvgName = file.replace(/\.svg$/, '_fixed.svg');
      const blackSvgPath = path.join(outDir, blackSvgName);
      fs.writeFileSync(blackSvgPath, content);
      console.log('Saved black SVG:', blackSvgName);
    }
  }

  // Now let's re-render all logos using Playwright with high resolution and proper contrast
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  const logoList = [
    { src: 'audi-logo_2016.svg', name: 'Audi' },
    { src: 'filatech-uae.svg', name: 'Filatech UAE' },
    { src: 'global-logo_white_fixed.svg', name: 'Global' },
    { src: 'header-logo.svg', name: 'Al Omaids' },
    { src: 'julphar_logo.jpg', name: 'Julphar Pharma' },
    { src: 'logo-1.webp', name: 'Client Partner' },
    { src: 'logo-color.svg', name: 'Brand Partner' },
    { src: 'logo.png', name: 'Tech Brand' },
    { src: 'logo.webp', name: 'Digital Brand' },
    { src: 'logo_property_finder.png', name: 'Property Finder' },
    { src: 'lootah-holding-new-logo-1-revised-removebg-preview.png', name: 'Lootah Holding' },
    { src: 'namshi-logo-vector.svg-.png', name: 'Namshi' },
    { src: 'omnicom-logo_fixed.svg', name: 'Omnicom Media' },
    { src: 'pawsplanes_pr_logo_fixed.svg', name: 'Paws & Planes' },
    { src: 'rocket_internet.png', name: 'Rocket Internet' },
    { src: 'uae-podiatry_logo.jpg', name: 'UAE Podiatry' },
    { src: 'westminster-prperties.png', name: 'Westminster Properties' },
    { src: 'wfp-logo-vertical-white-en_fixed.svg', name: 'UN World Food Programme' }
  ];

  for (const item of logoList) {
    let fileToRead = item.src;
    let fullPath = path.join(outDir, fileToRead);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(srcDir, fileToRead);
    }
    
    if (!fs.existsSync(fullPath)) continue;

    const fileBuf = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:20px; background:white;">
          <div id="target" style="display:inline-block; padding:10px;">
            <img src="${dataUrl}" style="height:48px; width:auto; max-width:200px; filter: brightness(0); object-fit:contain; display:block;" />
          </div>
        </body>
      </html>
    `);

    const el = await page.$('#target');
    if (el) {
      const outPng = item.src.replace(/\.[^.]+$/, '') + '_rendered_black.png';
      await el.screenshot({ path: path.join(outDir, outPng) });
      console.log(`Rendered clean black logo PNG: ${outPng}`);
    }
  }

  await browser.close();
}

fixWhiteSvgs().catch(console.error);

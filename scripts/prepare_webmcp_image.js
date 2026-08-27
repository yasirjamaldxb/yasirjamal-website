import sharp from 'sharp';
import path from 'path';

const artifactsDir = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e';

async function prepareImage() {
  const src = path.join(artifactsDir, 'ghl_speed_fiber_optics_1787667759282.jpg');
  
  await sharp(src)
    .resize(1200, 675, { fit: 'cover' })
    .jpeg({ quality: 88, progressive: true })
    .toFile('public/images/blog/webmcp-agentic-web-design.jpg');

  await sharp(src)
    .resize(1200, 675, { fit: 'cover' })
    .webp({ quality: 86 })
    .toFile('public/images/blog/webmcp-agentic-web-design.webp');

  console.log('✅ WebMCP guide image prepared successfully: public/images/blog/webmcp-agentic-web-design.webp');
}

prepareImage().catch(console.error);

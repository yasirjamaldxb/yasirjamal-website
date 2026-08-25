import sharp from 'sharp';
import path from 'path';

const artifactsDir = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e';

const imageMap = [
  {
    // 1. GHL Setup Blueprint: Physical Architectural Drafting Table & Blueprints
    src: path.join(artifactsDir, 'ghl_blueprint_drafting_table_1787667648781.jpg'),
    destJpg: 'public/images/blog/ghl-agency-setup-blueprint.jpg',
    destWebp: 'public/images/blog/ghl-agency-setup-blueprint.webp'
  },
  {
    // 2. GHL Pricing Calculator: Executive Brass Balance Scale & Leather Ledger on Nero Marble
    src: path.join(artifactsDir, 'ghl_pricing_balance_ledger_1787667702735.jpg'),
    destJpg: 'public/images/blog/ghl-pricing-calculator.jpg',
    destWebp: 'public/images/blog/ghl-pricing-calculator.webp'
  },
  {
    // 3. GHL Speed Funnels: High-Speed Fiber-Optic Velocity Light Beams in Carbon Fiber
    src: path.join(artifactsDir, 'ghl_speed_fiber_optics_1787667759282.jpg'),
    destJpg: 'public/images/blog/ghl-speed-funnels.jpg',
    destWebp: 'public/images/blog/ghl-speed-funnels.webp'
  },
  {
    // 4. TMDHosting Review: Macro Gold-Plated Microchip Processor & Circuit Architecture
    src: path.join(artifactsDir, 'tmd_processor_chipset_1787667820624.jpg'),
    destJpg: 'public/images/blog/tmd-hosting-infrastructure.jpg',
    destWebp: 'public/images/blog/tmd-hosting-infrastructure.webp'
  },
  {
    // 5. GHL Real Estate: Luxury Architectural Property Showcase
    src: 'public/images/portfolio/showcase_westminster-properties.jpg',
    destJpg: 'public/images/blog/ghl-real-estate-crm.jpg',
    destWebp: 'public/images/blog/ghl-real-estate-crm.webp'
  }
];

async function deployImages() {
  console.log('Deploying 5 distinct, screen-free, face-free editorial blog images...');

  for (const item of imageMap) {
    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover' })
      .jpeg({ quality: 88, progressive: true })
      .toFile(item.destJpg);

    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 86 })
      .toFile(item.destWebp);

    console.log(`✅ Deployed: ${item.destJpg} & ${item.destWebp}`);
  }

  console.log('🎉 All unique editorial blog images successfully updated!');
}

deployImages().catch(console.error);

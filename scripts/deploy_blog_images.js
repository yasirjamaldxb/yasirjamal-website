import sharp from 'sharp';
import path from 'path';

const artifactsDir = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e';

const imageMap = [
  {
    src: path.join(artifactsDir, 'ghl_agency_setup_blueprint_1787666492229.jpg'),
    destJpg: 'public/images/blog/ghl-agency-setup-blueprint.jpg',
    destWebp: 'public/images/blog/ghl-agency-setup-blueprint.webp'
  },
  {
    src: path.join(artifactsDir, 'ghl_pricing_financial_audit_1787666514258.jpg'),
    destJpg: 'public/images/blog/ghl-pricing-calculator.jpg',
    destWebp: 'public/images/blog/ghl-pricing-calculator.webp'
  },
  {
    src: path.join(artifactsDir, 'ghl_speed_funnel_engineering_1787666541792.jpg'),
    destJpg: 'public/images/blog/ghl-speed-funnels.jpg',
    destWebp: 'public/images/blog/ghl-speed-funnels.webp'
  },
  {
    src: path.join(artifactsDir, 'tmd_cloud_server_infrastructure_1787666567919.jpg'),
    destJpg: 'public/images/blog/tmd-hosting-infrastructure.jpg',
    destWebp: 'public/images/blog/tmd-hosting-infrastructure.webp'
  },
  {
    src: path.join(artifactsDir, 'ghl_real_estate_crm_luxury_1787666599602.jpg'),
    destJpg: 'public/images/blog/ghl-real-estate-crm.jpg',
    destWebp: 'public/images/blog/ghl-real-estate-crm.webp'
  }
];

async function deployImages() {
  console.log('Optimizing and deploying unique blog header images...');

  for (const item of imageMap) {
    // 1200x675 (16:9 Standard for Google Discover & OpenGraph)
    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover' })
      .jpeg({ quality: 86, progressive: true })
      .toFile(item.destJpg);

    await sharp(item.src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(item.destWebp);

    console.log(`✅ Deployed: ${item.destJpg} & ${item.destWebp}`);
  }

  console.log('🎉 All unique editorial blog images deployed successfully!');
}

deployImages().catch(console.error);

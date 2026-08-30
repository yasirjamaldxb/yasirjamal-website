import { google } from 'googleapis';
import fs from 'fs';

async function analyzeHomepageEntities() {
  console.log('========================================================');
  console.log('🧠 GOOGLE CLOUD NATURAL LANGUAGE API (ENTITY SALIENCE)');
  console.log('========================================================\n');

  let authClient = null;
  if (fs.existsSync('gsc_credentials.json')) {
    authClient = new google.auth.GoogleAuth({
      keyFile: 'gsc_credentials.json',
      scopes: ['https://www.googleapis.com/auth/cloud-language']
    });
  }

  const language = google.language({ version: 'v1', auth: authClient });

  const sampleText = `Yasir Jamal is an elite Senior Product Designer and Freelance Web Designer based in Dubai Media City, UAE. With over 15 years of experience since 2010, Yasir Jamal engineers custom corporate websites, sub-second eCommerce platforms, Figma UX/UI design systems, and technical SEO architectures for major enterprise brands across Dubai, Abu Dhabi, and the GCC.`;

  try {
    const res = await language.documents.analyzeEntities({
      requestBody: {
        document: {
          type: 'PLAIN_TEXT',
          content: sampleText
        },
        encodingType: 'UTF8'
      }
    });

    console.log('📊 RECOGNIZED ENTITIES & SALIENCE SCORES:\n');
    res.data.entities.forEach((entity, i) => {
      console.log(`${i + 1}. Entity: "${entity.name}" | Type: ${entity.type} | Salience: ${(entity.salience * 100).toFixed(1)}%`);
      if (entity.metadata && Object.keys(entity.metadata).length > 0) {
        console.log(`   Metadata:`, entity.metadata);
      }
    });

  } catch (err) {
    console.error('❌ Cloud NLP Error:', err.message);
  }

  console.log('\n========================================================');
}

analyzeHomepageEntities().catch(console.error);

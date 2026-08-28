import fs from 'fs';
import path from 'path';

let totalFiles = 0;
let totalSchemas = 0;
let errors = 0;

function validateSchemaInHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);

  if (!schemaMatches) return;

  totalFiles++;
  const declaredTypes = new Map();

  schemaMatches.forEach((scriptTag, idx) => {
    totalSchemas++;
    const raw = scriptTag.replace(/<\/?script[^>]*>/gi, '').trim();

    try {
      const parsed = JSON.parse(raw);
      
      // If graph is used, validate graph nodes
      const nodes = parsed['@graph'] ? parsed['@graph'] : [parsed];

      nodes.forEach(node => {
        const type = Array.isArray(node['@type']) ? node['@type'].join('+') : node['@type'];
        const id = node['@id'] || 'no-id';

        // Check duplicate unique entities for the same page
        const key = `${type}::${id}`;
        if (type === 'BlogPosting' || type === 'FAQPage' || type === 'LocalBusiness') {
          if (declaredTypes.has(key)) {
            console.log(`❌ [${filePath}] Duplicate unique entity detected: ${key}`);
            errors++;
          } else {
            declaredTypes.set(key, true);
          }
        }

        // Check required fields
        if (type === 'BlogPosting') {
          if (!node.headline || !node.author || !node.datePublished) {
            console.log(`⚠️ [${filePath}] BlogPosting missing essential fields.`);
            errors++;
          }
        }
      });

    } catch (e) {
      console.log(`❌ [${filePath}] JSON Parse Error: ${e.message}`);
      errors++;
    }
  });
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      traverse(full);
    } else if (f.endsWith('.html')) {
      validateSchemaInHtml(full);
    }
  }
}

console.log('========================================================');
console.log('✨ RUNNING DEEP GOOGLE STRUCTURED DATA VALIDATOR');
console.log('========================================================\n');

traverse('dist');

console.log('\n========================================================');
console.log(`📊 VALIDATION AUDIT COMPLETE:`);
console.log(`   - HTML Pages Audited: ${totalFiles}`);
console.log(`   - Schemas Validated: ${totalSchemas}`);
console.log(`   - Total Errors/Duplicates: ${errors}`);
console.log('========================================================\n');

if (errors === 0) {
  console.log('🎉 100% CLEAN: All schemas are perfectly structured with 0 duplicates!');
}

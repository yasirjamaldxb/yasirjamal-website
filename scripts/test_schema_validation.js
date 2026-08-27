import fs from 'fs';

function validateSchema() {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  
  console.log('========================================================');
  console.log('🔍 HOMEPAGE SCHEMA.ORG & RICH SNIPPET VALIDATION');
  console.log('========================================================\n');

  if (!schemaMatches) {
    console.log('❌ No JSON-LD schema tags found on dist/index.html');
    return;
  }

  console.log(`Found ${schemaMatches.length} JSON-LD Schema script block(s):\n`);

  schemaMatches.forEach((tag, idx) => {
    const rawJson = tag.replace(/<\/?script[^>]*>/gi, '').trim();
    try {
      const parsed = JSON.parse(rawJson);
      console.log(`✅ Schema Block #${idx + 1} is VALID JSON:`);
      if (parsed['@graph']) {
        console.log(`   - Graph items: ${parsed['@graph'].length}`);
        parsed['@graph'].forEach((item, i) => {
          console.log(`     [${i + 1}] @type: ${JSON.stringify(item['@type'])} | @id: ${item['@id'] || item.name || 'N/A'}`);
        });
      } else {
        console.log(`   - @type: ${JSON.stringify(parsed['@type'])} | Name: ${parsed.name || 'N/A'}`);
      }
    } catch (e) {
      console.log(`❌ Schema Block #${idx + 1} JSON PARSE ERROR: ${e.message}`);
    }
  });
}

validateSchema();

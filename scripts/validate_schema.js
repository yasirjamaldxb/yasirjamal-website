import fs from 'fs';

const content = fs.readFileSync('src/layouts/Layout.astro', 'utf8');
const match = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

if (!match) {
  console.error('❌ No JSON-LD script found in Layout.astro');
  process.exit(1);
}

try {
  const parsed = JSON.parse(match[1]);
  console.log('✅ JSON-LD Syntax is 100% Valid!');
  console.log(`📊 Graph Nodes: ${parsed['@graph']?.length}`);
  parsed['@graph'].forEach((node, i) => {
    console.log(`   ${i + 1}. Type: ${JSON.stringify(node['@type'])} | ID: ${node['@id']}`);
  });
} catch (e) {
  console.error('❌ JSON-LD Parse Error:', e.message);
  process.exit(1);
}

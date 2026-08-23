import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function auditSEO() {
  console.log('Starting Comprehensive SEO Audit on dist/ ...\n');
  const htmlFiles = findHtmlFiles('dist');
  let issues = 0;
  const summary = [];

  for (const file of htmlFiles) {
    const relPath = path.relative('dist', file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    // 1. Title
    const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;

    // 2. Meta Description
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                      content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
    const desc = descMatch ? descMatch[1] : null;

    // 3. Canonical
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;

    // 4. OpenGraph
    const ogTitleMatch = content.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
    const ogDescMatch = content.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
    const ogImageMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
    const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i);

    // 5. Schema JSON-LD
    const schemaMatches = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
    const schemas = schemaMatches ? schemaMatches.length : 0;

    // 6. H1 count
    const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;

    // 7. Images without alt
    const imgMatches = content.match(/<img[^>]*>/gi) || [];
    const imgsWithoutAlt = imgMatches.filter(img => !img.includes('alt=') || img.includes('alt=""') || img.includes("alt=''"));

    const pageIssues = [];
    if (!title) pageIssues.push('Missing <title>');
    if (!desc) pageIssues.push('Missing meta description');
    if (!canonical) pageIssues.push('Missing canonical URL');
    if (canonical && !canonical.startsWith('https://yasirjamal.com')) pageIssues.push(`Canonical is not pointing to https://yasirjamal.com (Found: ${canonical})`);
    if (!ogTitleMatch) pageIssues.push('Missing og:title');
    if (!ogDescMatch) pageIssues.push('Missing og:description');
    if (!ogImageMatch) pageIssues.push('Missing og:image');
    if (h1Count === 0 && !relPath.includes('404')) pageIssues.push('Missing <h1>');
    if (h1Count > 1) pageIssues.push(`Multiple <h1> tags (${h1Count})`);

    if (pageIssues.length > 0) {
      issues += pageIssues.length;
      console.log(`❌ ${relPath}:`);
      pageIssues.forEach(iss => console.log(`   - ${iss}`));
    } else {
      console.log(`✓ ${relPath} (Title: ${title?.slice(0, 40)}... | Schemas: ${schemas} | H1s: ${h1Count})`);
    }

    summary.push({
      page: relPath,
      title,
      canonical,
      schemas,
      h1Count,
      issues: pageIssues.length
    });
  }

  console.log(`\n========================================`);
  console.log(`Total Pages Audited: ${htmlFiles.length}`);
  console.log(`Total SEO Issues Found: ${issues}`);
  console.log(`========================================\n`);

  // Check sitemap.xml and robots.txt
  if (fs.existsSync('dist/robots.txt')) {
    console.log('✓ robots.txt exists in dist/');
    console.log(fs.readFileSync('dist/robots.txt', 'utf8').trim());
  } else {
    console.log('❌ Missing robots.txt in dist/');
  }

  if (fs.existsSync('dist/sitemap.xml')) {
    console.log('\n✓ sitemap.xml exists in dist/');
    const sitemapContent = fs.readFileSync('dist/sitemap.xml', 'utf8');
    const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
    console.log(`   - Total URLs in sitemap: ${urlCount}`);
    const wrongDomain = sitemapContent.includes('yasirjamaldxb.github.io');
    if (wrongDomain) {
      console.log('   ❌ Warning: sitemap.xml contains github.io URLs instead of yasirjamal.com');
    } else {
      console.log('   ✓ All URLs in sitemap.xml properly use https://yasirjamal.com/');
    }
  }

  if (fs.existsSync('dist/llms.txt')) {
    console.log('\n✓ llms.txt exists in dist/ for AI & LLM Search Engine Optimization');
  }
}

auditSEO().catch(console.error);

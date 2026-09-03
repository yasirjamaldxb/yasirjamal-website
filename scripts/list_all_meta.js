import fs from 'fs';
import path from 'path';

function getMeta(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      getMeta(fp);
    } else if (f.endsWith('.astro')) {
      const c = fs.readFileSync(fp, 'utf8');
      const t = c.match(/title=[\"'](.*?)[\"']/i) || c.match(/const pageTitle = [\"'](.*?)[\"']/i) || c.match(/title:\s*[\"'](.*?)[\"']/i);
      const d = c.match(/description=[\"'](.*?)[\"']/i) || c.match(/const pageDescription = [\"'](.*?)[\"']/i) || c.match(/description:\s*[\"'](.*?)[\"']/i);
      console.log(`FILE: ${fp}`);
      console.log(`  TITLE: ${t ? t[1] : 'N/A'}`);
      console.log(`  DESC:  ${d ? d[1] : 'N/A'}`);
      console.log('---');
    }
  }
}

getMeta('src/pages');

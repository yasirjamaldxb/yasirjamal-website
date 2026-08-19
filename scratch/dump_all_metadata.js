import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      res = res.concat(getFiles(p));
    } else if (f.endsWith('index.html')) {
      res.push(p);
    }
  });
  return res;
}

const files = getFiles('dist');
const data = [];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const route = f.replace('dist', '').replace(/\\/g, '/').replace('/index.html', '/') || '/';
  
  data.push({
    route,
    title: titleMatch ? titleMatch[1] : '',
    description: descMatch ? descMatch[1] : ''
  });
});

console.log(JSON.stringify(data, null, 2));

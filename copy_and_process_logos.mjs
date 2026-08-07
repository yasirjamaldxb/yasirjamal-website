import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const srcDir = 'C:\\Users\\nadvi\\Desktop\\logos';
const destDir = path.join(process.cwd(), 'public', 'images', 'logos');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
console.log('Found files in source logos directory:', files);

files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  if (file.endsWith('.zip')) {
    // extract zip using powershell
    const zipDest = path.join(destDir, 'rocket_internet');
    if (!fs.existsSync(zipDest)) fs.mkdirSync(zipDest, { recursive: true });
    try {
      execSync(`powershell -Command "Expand-Archive -Path '${srcPath}' -DestinationPath '${zipDest}' -Force"`);
      console.log('Extracted zip:', file);
      // look for svg in extracted zip
      const extracted = fs.readdirSync(zipDest);
      console.log('Extracted zip content:', extracted);
      extracted.forEach(efile => {
        if (efile.endsWith('.svg') || efile.endsWith('.png') || efile.endsWith('.ai')) {
          fs.copyFileSync(path.join(zipDest, efile), path.join(destDir, 'rocket_internet' + path.extname(efile)));
        }
      });
    } catch (e) {
      console.error('Zip extraction error:', e);
    }
  } else {
    // Sanitize filename for clean URL
    const cleanName = file.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_\-\.]/g, '');
    const destPath = path.join(destDir, cleanName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} -> ${cleanName}`);
  }
});

console.log('All logos copied to:', destDir);

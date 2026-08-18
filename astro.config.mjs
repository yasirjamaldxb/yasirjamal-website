// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function fixAssetPaths() {
  return {
    name: 'fix-asset-paths',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distPath = fileURLToPath(dir);
        const processHtmlFiles = (directory) => {
          const files = fs.readdirSync(directory);
          for (const file of files) {
            const fullPath = path.join(directory, file);
            if (fs.statSync(fullPath).isDirectory()) {
              processHtmlFiles(fullPath);
            } else if (file.endsWith('.html')) {
              let content = fs.readFileSync(fullPath, 'utf8');
              content = content.replace(/src="\/images\//g, 'src="/yasirjamal-website/images/');
              content = content.replace(/src='\/images\//g, "src='/yasirjamal-website/images/");
              content = content.replace(/href="\/images\//g, 'href="/yasirjamal-website/images/');
              content = content.replace(/href="\/favicon/g, 'href="/yasirjamal-website/favicon');
              content = content.replace(/url\(['"]?\/images\//g, 'url(/yasirjamal-website/images/');
              
              // Internal navigation links
              content = content.replace(/href="\/about\/?/g, 'href="/yasirjamal-website/about/');
              content = content.replace(/href="\/portfolio\/?/g, 'href="/yasirjamal-website/portfolio/');
              content = content.replace(/href="\/blog\/?/g, 'href="/yasirjamal-website/blog/');
              content = content.replace(/href="\/design-system\/?/g, 'href="/yasirjamal-website/design-system/');
              content = content.replace(/href="\/privacy-policy\/?/g, 'href="/yasirjamal-website/privacy-policy/');
              content = content.replace(/href="\/terms\/?/g, 'href="/yasirjamal-website/terms/');
              content = content.replace(/href="\/"/g, 'href="/yasirjamal-website/"');
              
              fs.writeFileSync(fullPath, content, 'utf8');
            }
          }
        };
        processHtmlFiles(distPath);
        console.log('✓ Successfully patched all image and asset paths for GitHub Pages subpath!');
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://yasirjamaldxb.github.io',
  base: '/yasirjamal-website',
  integrations: [fixAssetPaths()],
  vite: {
    plugins: [tailwindcss()]
  }
});
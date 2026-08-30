import fs from 'fs';
import https from 'https';
import path from 'path';

const auth_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTQwNDY5OTY1MiIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODEyMDU3NSwiaWF0IjoxNzg4MDk4OTc1fQ.Z9VRs2bu6Rpa9Wh0KiKEH-HEFpKz1jPokeKA1ksmmIo";
const rest_auth_key = "198c1bbecc288898aed22156a4a9728eda88ed0b55342a362c15ddd31883c1e2-8acf1094fd965ce5";
const baseUrl = "https://srv1943-files.hstgr.io/rest/8acf1094fd965ce5/api/tus/public_html";

const filesToUpload = [
  {
    local: 'dist/blog/answer-engine-optimization-aeo-chatgpt-search-dubai/index.html',
    remote: 'blog/answer-engine-optimization-aeo-chatgpt-search-dubai/index.html'
  },
  {
    local: 'dist/images/blog/aeo-chatgpt-search-dubai.jpg',
    remote: 'images/blog/aeo-chatgpt-search-dubai.jpg'
  },
  {
    local: 'dist/blog/index.html',
    remote: 'blog/index.html'
  },
  {
    local: 'dist/llms.txt',
    remote: 'llms.txt'
  },
  {
    local: 'dist/sitemap-0.xml',
    remote: 'sitemap-0.xml'
  },
  {
    local: 'dist/sitemap.xml',
    remote: 'sitemap.xml'
  },
  {
    local: 'dist/index.html',
    remote: 'index.html'
  }
];

function uploadSingleFile(localPath, remotePath) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️ Local file not found: ${localPath}`);
      return resolve(false);
    }
    const stat = fs.statSync(localPath);
    const size = stat.size;
    const postUrl = new URL(`${baseUrl}/${encodeURI(remotePath)}?override=true`);

    // 1. POST
    const createReq = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': auth_key,
        'X-Auth-Rest': rest_auth_key,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size.toString(),
        'Upload-Offset': '0'
      }
    }, (res) => {
      // 2. PATCH
      const patchReq = https.request(postUrl, {
        method: 'PATCH',
        headers: {
          'X-Auth': auth_key,
          'X-Auth-Rest': rest_auth_key,
          'Tus-Resumable': '1.0.0',
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': '0',
          'Content-Length': size.toString()
        }
      }, (patchRes) => {
        if (patchRes.statusCode === 204 || patchRes.statusCode === 200) {
          console.log(`✅ [${patchRes.statusCode}] Uploaded: ${remotePath} (${(size / 1024).toFixed(1)} KB)`);
          resolve(true);
        } else {
          console.log(`⚠️ [${patchRes.statusCode}] Failed PATCH: ${remotePath}`);
          resolve(false);
        }
      });

      patchReq.on('error', (err) => {
        console.error(`❌ PATCH error for ${remotePath}:`, err.message);
        resolve(false);
      });

      fs.createReadStream(localPath).pipe(patchReq);
    });

    createReq.on('error', (err) => {
      console.error(`❌ POST error for ${remotePath}:`, err.message);
      resolve(false);
    });

    createReq.end();
  });
}

async function run() {
  console.log('🚀 Deploying new AEO blog and updated files to Hostinger public_html...\n');
  for (const item of filesToUpload) {
    await uploadSingleFile(item.local, item.remote);
  }
  console.log('\n🎉 Deployment complete!');
}

run().catch(console.error);

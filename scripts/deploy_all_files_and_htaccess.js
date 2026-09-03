import fs from 'fs';
import https from 'https';
import path from 'path';

const auth_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTQwNDY5OTY1MiIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODQ2NTk0OSwiaWF0IjoxNzg4NDQ0MzQ5fQ.6M_InneWtXnPeAC_pgh_VZXdOtkMiRIM5m09QHaVlag";
const rest_auth_key = "2318ef22295b24020f7396beef40a7d382112cb645ac5731dc5d9016eef2a16b-47efeffe8544acac";
const baseUrl = "https://srv1943-files.hstgr.io/rest/47efeffe8544acac/api/tus/public_html";

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function uploadSingleFile(localPath, remotePath) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️ Local file not found: ${localPath}`);
      return resolve(false);
    }
    const stat = fs.statSync(localPath);
    const size = stat.size;
    const postUrl = new URL(`${baseUrl}/${encodeURI(remotePath.replace(/\\/g, '/'))}?override=true`);

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
      if (res.statusCode !== 201 && res.statusCode !== 200) {
        console.log(`⚠️ [${res.statusCode}] Failed POST: ${remotePath}`);
        return resolve(false);
      }

      // 2. PATCH
      const fileBuffer = fs.readFileSync(localPath);
      const patchReq = https.request(postUrl, {
        method: 'PATCH',
        headers: {
          'X-Auth': auth_key,
          'X-Auth-Rest': rest_auth_key,
          'Tus-Resumable': '1.0.0',
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': '0',
          'Content-Length': fileBuffer.length.toString()
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

      patchReq.write(fileBuffer);
      patchReq.end();
    });

    createReq.on('error', (err) => {
      console.error(`❌ POST error for ${remotePath}:`, err.message);
      resolve(false);
    });

    createReq.end();
  });
}

async function runDeploy() {
  console.log('🚀 Deploying .htaccess and all dist files to Hostinger public_html...\n');

  // 1. Upload .htaccess
  console.log('📄 1. Deploying .htaccess with 301 Permanent Redirects & Canonical rules...');
  await uploadSingleFile('public/.htaccess', '.htaccess');

  // 2. Deploy all HTML, XML, TXT from dist/
  console.log('\n📦 2. Deploying all built pages & sitemaps...');
  const distFiles = getAllFiles('dist');
  const criticalFiles = distFiles.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.html' || ext === '.xml' || ext === '.txt' || ext === '.json' || ext === '.htaccess' || ext === '.php';
  });

  for (const f of criticalFiles) {
    const relativeRemote = path.relative('dist', f);
    await uploadSingleFile(f, relativeRemote);
  }

  console.log('\n🎉 Complete production deployment finished successfully!');
}

runDeploy().catch(console.error);

import fs from 'fs';
import https from 'https';

const auth_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTQwNDY5OTY1MiIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4Nzk2ODkxNywiaWF0IjoxNzg3OTQ3MzE3fQ.zLH0G_tSKBB_tBm2xmUxtNZpTX5mmE-_YfsWU4aQLUA";
const rest_auth_key = "418b93eb3e2cb56eeae09f0b5b982e0e9147fce3f3ee6452919e417d22bdd733-fa8740e65f9852e8";
const baseUrl = "https://srv1943-files.hstgr.io/rest/fa8740e65f9852e8/api/tus/public_html";
const fileName = "app.zip";
const filePath = "yasirjamal_clean.zip";

async function upload() {
  const stat = fs.statSync(filePath);
  const size = stat.size;
  console.log(`Starting upload of ${filePath} (${(size / (1024 * 1024)).toFixed(2)} MB)...`);

  // Step 1: POST to create upload
  const postUrl = new URL(`${baseUrl}/${fileName}?override=true`);
  
  const createReq = () => new Promise((resolve, reject) => {
    const req = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': auth_key,
        'X-Auth-Rest': rest_auth_key,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size.toString(),
        'Upload-Offset': '0'
      }
    }, (res) => {
      console.log(`POST response: ${res.statusCode}`);
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.end();
  });

  await createReq();

  // Step 2: PATCH with binary data in chunks
  console.log('Sending PATCH binary data...');
  const patchReq = () => new Promise((resolve, reject) => {
    const req = https.request(postUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': auth_key,
        'X-Auth-Rest': rest_auth_key,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Content-Length': size.toString()
      }
    }, (res) => {
      console.log(`PATCH response: ${res.statusCode}`);
      resolve(res.statusCode);
    });

    req.on('error', reject);
    const stream = fs.createReadStream(filePath);
    stream.pipe(req);
  });

  await patchReq();
  console.log('✅ File upload complete!');
}

upload().catch(console.error);

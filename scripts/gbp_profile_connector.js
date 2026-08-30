import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  'http://localhost:3000/oauth2callback'
);

const scopes = [
  'https://www.googleapis.com/auth/business.manage'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('========================================================');
console.log('📍 GOOGLE BUSINESS PROFILE (GBP) OAUTH 2.0 CONNECTOR');
console.log('========================================================\n');
console.log('Please open the following link to authorize Google Business Profile:\n');
console.log(authUrl);
console.log('\n--------------------------------------------------------');
console.log('⏳ Waiting for authorization callback on http://localhost:3000/oauth2callback ...\n');

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/oauth2callback')) {
      const q = url.parse(req.url, true).query;
      if (q.code) {
        const { tokens } = await oauth2Client.getToken(q.code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync('gbp_token.json', JSON.stringify(tokens, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: system-ui; text-align: center; padding: 50px; background: #01013E; color: white;">
              <h1 style="color: #4ade80;">✅ Google Business Profile Connected Successfully!</h1>
              <p style="color: #94a3b8;">You can now close this tab and return to the chat console.</p>
            </body>
          </html>
        `);

        console.log('✅ Authorization tokens received and saved to `gbp_token.json`!\n');

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1500);
      }
    }
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Authentication Error: ' + e.message);
    console.error('❌ Auth error:', e.message);
  }
});

server.listen(3000);

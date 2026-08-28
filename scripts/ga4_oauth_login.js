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
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('========================================================');
console.log('🔗 GOOGLE ANALYTICS 4 (GA4) OAUTH 2.0 AUTHORIZATION');
console.log('========================================================\n');
console.log('Please open the following link in your browser to sign in:\n');
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
        fs.writeFileSync('ga4_token.json', JSON.stringify(tokens, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: system-ui; text-align: center; padding: 50px; background: #01013E; color: white;">
              <h1 style="color: #4ade80;">✅ Google Analytics API Connected Successfully!</h1>
              <p style="color: #94a3b8;">You can now close this tab and return to the chat console.</p>
            </body>
          </html>
        `);

        console.log('✅ Authorization tokens received and saved to `ga4_token.json`!\n');

        // Test list accounts
        const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });
        const summaries = await analyticsadmin.accountSummaries.list();
        console.log('📊 ACCESSIBLE GOOGLE ANALYTICS 4 PROPERTIES:');
        if (summaries.data.accountSummaries) {
          summaries.data.accountSummaries.forEach(acc => {
            console.log(`   - Account: ${acc.displayName}`);
            if (acc.propertySummaries) {
              acc.propertySummaries.forEach(p => {
                console.log(`     └─ Property: ${p.displayName} (ID: ${p.property})`);
              });
            }
          });
        }
        console.log('\n🎉 GA4 API Connection Complete!');

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

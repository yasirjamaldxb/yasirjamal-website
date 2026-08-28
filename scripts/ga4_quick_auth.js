import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import fs from 'fs';

console.log('========================================================');
console.log('🚀 GOOGLE ANALYTICS 4 (GA4) API CONNECTION SETUP');
console.log('========================================================\n');

console.log('To link the GA4 API, you have two simple options:\n');
console.log('OPTION 1: Service Account (Recommended)');
console.log('1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts');
console.log('2. Click "Create Service Account", name it "ga4-agent", and click Done.');
console.log('3. Click the 3 dots on that service account > "Manage Keys" > "Add Key" > "Create new key" (JSON).');
console.log('4. Move the downloaded JSON file to this project folder as `ga4_credentials.json`.');
console.log('5. In Google Analytics (Admin > Property Access Management), add that new service account email (it will be accepted instantly without any error because it was created in your own Google Cloud account!).\n');
console.log('========================================================\n');

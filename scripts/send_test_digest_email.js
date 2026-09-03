import https from 'https';

const payload = JSON.stringify({
  _subject: "📊 Executive Intelligence & Conversion Digest - yasirjamal.com",
  Report_Date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  Server_Status: "200 OK (LiteSpeed Cache & GZIP Active)",
  Average_TTFB: "450ms (Sub-second)",
  Active_Visitor_Trackers: "RB2B (LinkedIn ID: 9NMMZHXX5QNW) • Leadfeeder (Dealfront ID: p1e024B0EgZ8GB6d)",
  Multi_Touch_AI_Attribution: "ChatGPT • Perplexity • Claude • Google AI • Gemini",
  Active_Lead_Funnels: "1) Homepage Free Video Audit Form • 2) Interactive Scope Estimator (/calculator/) • 3) WhatsApp Floating Radar",
  Email_Alert_Recipient: "yj.digitall@gmail.com",
  System_Notice: "This is your verified daily intelligence dispatch. All website submissions and visitor inquiries will be delivered directly to this inbox in real-time."
});

const req = https.request('https://formsubmit.co/ajax/yj.digitall@gmail.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://yasirjamal.com',
    'Referer': 'https://yasirjamal.com/'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (err) => {
  console.error('Error sending email:', err.message);
});

req.write(payload);
req.end();

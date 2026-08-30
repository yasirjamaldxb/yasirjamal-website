import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

const warmupTemplates = [
  {
    subject: "Quick question regarding modern web architecture in UAE",
    body: "Hi there,\n\nI was reviewing recent eCommerce performance benchmarks across the GCC and wanted to see if your team has explored sub-second headless architectures recently.\n\nBest regards,\nYasir Jamal\nSenior Web Architect | Dubai Media City"
  },
  {
    subject: "Follow up: UI/UX design system review",
    body: "Hi,\n\nFollowing up on our discussion about scalable design tokens and Figma component libraries for enterprise web apps. Let me know when you have 5 minutes to connect.\n\nBest,\nYasir"
  },
  {
    subject: "Core Web Vitals & technical SEO benchmark",
    body: "Hello,\n\nHope your week is going well. We recently completed a technical analysis on mobile load times for Dubai businesses. Let me know if you would like to review the summary.\n\nWarm regards,\nYasir Jamal"
  }
];

function sendWarmupEmail(fromAddress, toAddress, template) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      from: `Yasir Jamal <${fromAddress}>`,
      to: [toAddress],
      reply_to: 'webandgraphicdesigner@gmail.com',
      subject: template.subject,
      text: template.body,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">
          ${template.body.replace(/\n/g, '<br>')}
        </div>
      `
    });

    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      family: 4,
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runWarmupBatch(fromAddress, targetEmails) {
  console.log('========================================================================');
  console.log(`🔥 INBOX WARM-UP ENGINE DISPATCH`);
  console.log(`   Sender: ${fromAddress}`);
  console.log(`   Target Count: ${targetEmails.length}`);
  console.log('========================================================================\n');

  for (let i = 0; i < targetEmails.length; i++) {
    const target = targetEmails[i];
    const template = warmupTemplates[i % warmupTemplates.length];
    console.log(`[${i + 1}/${targetEmails.length}] Sending warm-up email to: ${target}...`);

    try {
      const res = await sendWarmupEmail(fromAddress, target, template);
      if (res.status === 200) {
        console.log(`   ✅ [200 OK] Delivered (ID: ${res.data.id})`);
      } else {
        console.log(`   ⚠️ [${res.status}] Notice: ${JSON.stringify(res.data || res.raw)}`);
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }

    // Human-like delay between sends (2-5 seconds)
    if (i < targetEmails.length - 1) {
      const delay = Math.floor(Math.random() * 3000) + 2000;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  console.log('\n🎉 Warm-up batch completed successfully!\n');
}

// Initial warm-up test to verified accounts
runWarmupBatch('yasir@yasirjamal.com', ['webandgraphicdesigner@gmail.com']).catch(console.error);

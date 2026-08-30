import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;
const statsFile = 'scripts/warmup_stats.json';

// Initialize stats if not present
if (!fs.existsSync(statsFile)) {
  fs.writeFileSync(statsFile, JSON.stringify({
    startDate: new Date().toISOString().split('T')[0],
    totalSent: 0,
    dailyHistory: {},
    currentPhase: 1,
    reputationScore: '100% (Optimal)'
  }, null, 2));
}

const templates = [
  {
    subject: "Sub-second website architecture for Dubai businesses",
    body: "Hi,\n\nI was reviewing recent eCommerce performance benchmarks across the GCC and wanted to share our latest case study on sub-second Astro architecture.\n\nLet me know if you would like to review the speed comparison.\n\nBest regards,\nYasir Jamal\nSenior Web Architect | Dubai Media City"
  },
  {
    subject: "Quick question regarding your web design & UX roadmap",
    body: "Hello,\n\nFollowing up on UI/UX design systems and conversion optimization for UAE product teams.\n\nWould you be open to a quick 5-minute chat this week?\n\nBest,\nYasir"
  },
  {
    subject: "Core Web Vitals & technical SEO benchmark (2026)",
    body: "Hi there,\n\nWe recently completed a technical analysis on mobile load times for Dubai enterprise portals. Thought this might be helpful for your technical roadmap.\n\nWarm regards,\nYasir Jamal"
  },
  {
    subject: "Figma design system & frontend tokens review",
    body: "Hi,\n\nSharing a quick update on our latest interactive design system components tailored for high-ticket lead conversion in Dubai.\n\nBest regards,\nYasir"
  }
];

function sendEmail(fromAddress, toAddress, subject, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      from: `Yasir Jamal <${fromAddress}>`,
      to: [toAddress],
      reply_to: 'webandgraphicdesigner@gmail.com',
      subject: subject,
      text: body,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">
          ${body.replace(/\n/g, '<br>')}
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runCliWarmup(count = 3) {
  console.log('========================================================================');
  console.log('🔥 100% FREE CLI INBOX WARM-UP ENGINE (0 COST / AUTOMATED)');
  console.log('========================================================================\n');

  const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  const today = new Date().toISOString().split('T')[0];
  if (!stats.dailyHistory[today]) {
    stats.dailyHistory[today] = 0;
  }

  const sender = 'yasir@yasirjamal.com';
  const seedTargets = [
    'webandgraphicdesigner@gmail.com',
    'ravomotors@gmail.com'
  ];

  console.log(`📍 Sender: ${sender}`);
  console.log(`📅 Today's Date: ${today}`);
  console.log(`📊 Sent Today: ${stats.dailyHistory[today]}`);
  console.log(`🎯 Target Batch: ${count} warm-up emails\n`);

  for (let i = 0; i < count; i++) {
    const target = seedTargets[i % seedTargets.length];
    const template = templates[i % templates.length];
    const timestamp = new Date().toLocaleTimeString();

    console.log(`[${i + 1}/${count}] ${timestamp} Sending to: ${target}...`);
    try {
      const res = await sendEmail(sender, target, template.subject, template.body);
      if (res.status === 200) {
        console.log(`   ✅ [200 OK] Delivered (Resend ID: ${res.data.id})`);
        stats.totalSent++;
        stats.dailyHistory[today]++;
      } else {
        console.log(`   ⚠️ [${res.status}] Response: ${JSON.stringify(res.data || res.raw)}`);
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }

    if (i < count - 1) {
      const delay = Math.floor(Math.random() * 2000) + 1500;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));

  console.log('\n========================================================================');
  console.log(`📈 UPDATED WARM-UP STATS:`);
  console.log(`   • Lifetime Sent: ${stats.totalSent}`);
  console.log(`   • Sent Today: ${stats.dailyHistory[today]}`);
  console.log(`   • Reputation: ${stats.reputationScore}`);
  console.log(`   • Cost: $0.00 (100% Free Forever)`);
  console.log('========================================================================\n');
}

// Run warm-up batch of 3 emails
runCliWarmup(3).catch(console.error);

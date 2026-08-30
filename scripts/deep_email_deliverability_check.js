import dns from 'dns';
import fs from 'fs';
import https from 'https';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;
const domainId = creds.domain_id;

async function checkDNS() {
  console.log('========================================================================');
  console.log('🛡️ 100% INBOX DELIVERABILITY & ANTI-SPAM COMPLIANCE AUDIT');
  console.log('========================================================================\n');

  // 1. Resolve Root SPF
  dns.resolveTxt('yasirjamal.com', (err, records) => {
    console.log('1️⃣ ROOT DOMAIN SPF & TXT:');
    if (err) console.log('   Error:', err.message);
    else records.forEach(r => console.log('   📄', r.join(' ')));
  });

  // 2. Resolve DMARC
  dns.resolveTxt('_dmarc.yasirjamal.com', (err, records) => {
    console.log('\n2️⃣ DMARC SECURITY RECORD:');
    if (err) console.log('   Error:', err.message);
    else records.forEach(r => console.log('   🔒', r.join(' ')));
  });

  // 3. Resolve DKIM
  dns.resolveTxt('resend._domainkey.yasirjamal.com', (err, records) => {
    console.log('\n3️⃣ RESEND DKIM CRYPTOGRAPHIC KEY:');
    if (err) console.log('   Error:', err.message);
    else records.forEach(r => console.log('   🔑', r.join('').substring(0, 50) + '...'));
  });

  // 4. Resolve Subdomain SPF & MX
  dns.resolveTxt('send.yasirjamal.com', (err, records) => {
    console.log('\n4️⃣ SUBDOMAIN (send.yasirjamal.com) SPF:');
    if (err) console.log('   Error:', err.message);
    else records.forEach(r => console.log('   📄', r.join(' ')));
  });

  dns.resolveMx('send.yasirjamal.com', (err, records) => {
    console.log('\n5️⃣ SUBDOMAIN (send.yasirjamal.com) MX:');
    if (err) console.log('   Error:', err.message);
    else records.forEach(r => console.log('   📬 Priority', r.priority, ':', r.exchange));
  });

  // 5. Query Resend API Domain Verification Status
  setTimeout(() => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: `/domains/${domainId}`,
      method: 'GET',
      family: 4,
      headers: { 'Authorization': `Bearer ${resendApiKey}` }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('\n6️⃣ RESEND LIVE VERIFICATION STATUS:');
        try {
          const parsed = JSON.parse(body);
          console.log(`   Domain: ${parsed.name}`);
          console.log(`   Status: ${parsed.status.toUpperCase()}`);
          console.log(`   Sending Capability: ${parsed.capabilities?.sending}`);
          console.log(`   Records breakdown:`);
          parsed.records?.forEach(rec => {
            console.log(`     - [${rec.record}] ${rec.name} (${rec.type}) -> Status: ${rec.status}`);
          });
        } catch(e) {
          console.log(body);
        }
        console.log('\n========================================================================\n');
      });
    });
    req.end();
  }, 2000);
}

checkDNS();

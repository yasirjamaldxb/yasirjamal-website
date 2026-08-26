import https from 'https';

async function queryDoH(name, type) {
  return new Promise((resolve) => {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const options = {
      headers: {
        'Accept': 'application/dns-json'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.Answer || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function auditDomain() {
  const domain = 'yasirjamal.com';
  console.log(`========================================================`);
  console.log(`🌐 LIVE DNS & DELIVERABILITY AUDIT (Cloudflare DoH): ${domain}`);
  console.log(`========================================================\n`);

  // 1. Nameservers (NS)
  const ns = await queryDoH(domain, 'NS');
  console.log('1. NAMESERVERS (NS):');
  if (ns.length > 0) {
    ns.forEach(r => console.log(`   - ${r.data}`));
  } else {
    console.log('   ❌ No NS records found');
  }

  // 2. A Records (IPv4)
  const a = await queryDoH(domain, 'A');
  console.log('\n2. A RECORDS (IPv4 / Hostinger Server IP):');
  if (a.length > 0) {
    a.forEach(r => console.log(`   - ${r.data} (TTL: ${r.TTL}s)`));
  } else {
    console.log('   ❌ No A records found');
  }

  // 3. WWW A / CNAME
  const www = await queryDoH(`www.${domain}`, 'CNAME');
  const wwwA = await queryDoH(`www.${domain}`, 'A');
  console.log('\n3. WWW SUBDOMAIN CONFIGURATION:');
  if (www.length > 0) {
    www.forEach(r => console.log(`   - CNAME: www.${domain} -> ${r.data}`));
  }
  if (wwwA.length > 0) {
    wwwA.forEach(r => console.log(`   - A Record: www.${domain} -> ${r.data}`));
  }

  // 4. MX Records
  const mx = await queryDoH(domain, 'MX');
  console.log('\n4. MX RECORDS (Email Server Routing):');
  if (mx.length > 0) {
    mx.forEach(r => console.log(`   - ${r.data}`));
  } else {
    console.log('   ❌ No MX records configured! (Email receiving will fail)');
  }

  // 5. TXT Records (SPF, GSC, etc.)
  const txt = await queryDoH(domain, 'TXT');
  console.log('\n5. TXT RECORDS (SPF, Google Verification, etc.):');
  if (txt.length > 0) {
    txt.forEach(r => console.log(`   - ${r.data}`));
  } else {
    console.log('   ⚠️ No TXT records found');
  }

  // 6. DMARC Record
  const dmarc = await queryDoH(`_dmarc.${domain}`, 'TXT');
  console.log('\n6. DMARC RECORD (_dmarc.yasirjamal.com):');
  if (dmarc.length > 0) {
    dmarc.forEach(r => console.log(`   - ${r.data}`));
  } else {
    console.log('   ❌ NOT CONFIGURED / MISSING (Gmail/Yahoo 2026 anti-spam enforcement warning)');
  }

  // 7. DKIM Selectors
  console.log('\n7. DKIM RECORD CHECK (Common Mail Selectors):');
  const selectors = ['default', 'google', 'hostingermail-a', 'hostingermail-b', 'k1', 's1', 'titan1', 'titan2', 'mail'];
  let dkimFound = false;
  for (const s of selectors) {
    const dkim = await queryDoH(`${s}._domainkey.${domain}`, 'TXT');
    if (dkim.length > 0) {
      dkim.forEach(d => console.log(`   ✅ Found '${s}': ${d.data}`));
      dkimFound = true;
    }
  }
  if (!dkimFound) {
    console.log('   ⚠️ No DKIM record detected on standard selectors');
  }

  // 8. CAA Records
  const caa = await queryDoH(domain, 'CAA');
  console.log('\n8. CAA RECORDS (SSL Certificate Security):');
  if (caa.length > 0) {
    caa.forEach(c => console.log(`   - ${c.data}`));
  } else {
    console.log('   ℹ️ Standard default CAA (Allowed for all trusted CAs)');
  }
}

auditDomain().catch(console.error);

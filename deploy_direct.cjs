const { spawn } = require('child_process');

const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";

async function waitForHostinger() {
  console.log("Checking Hostinger API status...");
  for (let i = 1; i <= 100; i++) {
    try {
      const res = await fetch('https://api.hostinger.com/v1/hosting/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200) {
        const data = await res.json();
        if (data && data.data) {
          console.log("✓ Hostinger API is ONLINE and healthy! Triggering deployment...");
          return true;
        }
      }
      console.log(`[Attempt ${i}/100] Status: ${res.status}. Waiting 5s...`);
    } catch (err) {
      console.log(`[Attempt ${i}/100] Connection: ${err.message}. Waiting 5s...`);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  return false;
}

async function run() {
  const ready = await waitForHostinger();
  if (!ready) {
    console.error("Hostinger API did not become ready in time.");
    process.exit(1);
  }

  const child = spawn('node', ['deploy_now.cjs'], { stdio: 'inherit' });
  child.on('close', (code) => {
    process.exit(code);
  });
}

run();

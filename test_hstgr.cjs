const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";

async function run() {
  const urls = [
    "https://srv1943-files.hstgr.io/",
    "https://rest.hstgr.io/",
    "https://api.hostinger.com/v1/hosting/orders"
  ];
  
  for (const url of urls) {
    try {
      console.log("Testing:", url);
      const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
      console.log(url, "-> Status:", res.status);
    } catch(e) {
      console.log(url, "-> Failed:", e.message);
    }
  }
}

run();

const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";
const domain = "lawngreen-toad-836930.hostingersite.com";

async function test() {
  try {
    console.log("Checking Hostinger API limits...");
    const res = await fetch("https://api.hostinger.com/v1/hosting/websites", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const data = await res.json();
    console.log("Data:", JSON.stringify(data).slice(0, 300));
  } catch(e) {
    console.error("Error:", e);
  }
}

test();

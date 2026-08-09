const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";
const domain = "lawngreen-toad-836930.hostingersite.com";

async function run() {
  console.log("Testing Hostinger API direct account resolution...");
  try {
    const res = await fetch(`https://api.hostinger.com/v1/hosting/websites`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text.slice(0, 500));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();

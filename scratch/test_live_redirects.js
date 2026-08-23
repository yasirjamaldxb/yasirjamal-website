const testUrls = [
  'https://yasirjamal.com/work/',
  'https://yasirjamal.com/work/westminster-properties/',
  'https://yasirjamal.com/work/skylynx/',
  'https://yasirjamal.com/work/alston-clayden/',
  'https://yasirjamal.com/work/markwilliams/',
  'https://yasirjamal.com/work/mark-williams/',
  'https://yasirjamal.com/work/dubai-podiatrist/',
  'https://yasirjamal.com/work/noor-abu-dhabi/',
  'https://yasirjamal.com/work/paws-and-planes/',
  'https://yasirjamal.com/work/alomaids/',
  'https://yasirjamal.com/work/fila-tech/',
  'https://yasirjamal.com/work/julphar/',
  'https://yasirjamal.com/work/abayadore/',
  'https://yasirjamal.com/work/hunza-global/',
  'https://yasirjamal.com/work/baanpaa/',
  'https://yasirjamal.com/contact-us/',
  'https://yasirjamal.com/contact/',
  'https://yasirjamal.com/services/',
  'https://yasirjamal.com/our-services/',
  'https://yasirjamal.com/who-is-yasir-jamal/',
  'https://yasirjamal.com/quote/'
];

async function checkRedirects() {
  console.log('Testing old URLs against live yasirjamal.com ...\n');
  for (const url of testUrls) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      const location = res.headers.get('location');
      console.log(`[${res.status}] ${url} -> ${location || '(served direct / no redirect)'}`);
    } catch (err) {
      console.error(`Error testing ${url}:`, err.message);
    }
  }
}

checkRedirects().catch(console.error);

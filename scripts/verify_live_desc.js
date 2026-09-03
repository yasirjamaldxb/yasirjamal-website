import https from 'https';

https.get('https://yasirjamal.com/?nocache=' + Date.now(), (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const descMatch = data.match(/<meta name="description" content="([^"]+)"/i);
    const ogMatch = data.match(/<meta property="og:description" content="([^"]+)"/i);
    console.log('=== PRODUCTION VERIFICATION ===');
    console.log('Meta Description:', descMatch ? descMatch[1] : 'Not Found');
    console.log('OG Description:  ', ogMatch ? ogMatch[1] : 'Not Found');
  });
});

const https = require('https');

https.get('https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/amplitude.svg', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('master amplitude:', d));
});

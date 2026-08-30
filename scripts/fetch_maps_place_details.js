import https from 'https';

const query = encodeURIComponent('Yasir Jamal Freelance Web Designer Dubai');
const url = `https://www.google.com/maps/search/?api=1&query=${query}`;

console.log('Querying Google Maps for Yasir Jamal Business Profile...');
console.log('Maps URL:', url);

// We can also query Google Search SERP local card
async function fetchGoogleSerp() {
  return new Promise((resolve) => {
    https.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent('Yasir Jamal Freelance Web Designer Dubai Media City Google Maps')}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(data);
      });
    });
  });
}

fetchGoogleSerp().then(d => {
  console.log('Fetched SERP data length:', d.length);
}).catch(console.error);

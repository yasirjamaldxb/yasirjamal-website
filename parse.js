const fs = require('fs');

function extractText(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    html = html.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');
    html = html.replace(/<[^>]+>/g, '\n');
    
    html = html.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
    html = html.replace(/\n\s*\n/g, '\n').trim();
    
    console.log(html);
}

extractText(process.argv[2]);

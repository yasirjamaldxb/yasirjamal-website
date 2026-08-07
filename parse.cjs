const fs = require('fs');

function extractText(filePath, outPath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    html = html.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');
    html = html.replace(/<[^>]+>/g, '\n');
    
    html = html.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
    html = html.replace(/\n\s*\n/g, '\n').trim();
    
    fs.writeFileSync(outPath, html, 'utf-8');
}

extractText(process.argv[2], process.argv[3]);

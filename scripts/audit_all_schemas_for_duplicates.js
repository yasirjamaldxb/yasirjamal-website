import fs from 'fs';
import path from 'path';

function findDuplicateKeys(jsonString) {
  const duplicateKeys = [];
  const keyRegex = /"([^"]+)"\s*:/g;
  
  // Custom recursive parser or regex checker to find duplicate keys at the same object level
  function checkObjectString(str) {
    const lines = str.split('\n');
    // Simple object parser tracking keys per depth
    const stack = [new Set()];
    let inString = false;
    let escape = false;
    let currentKey = '';
    let readingKey = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        if (!inString && readingKey) {
          readingKey = false;
          const currentScope = stack[stack.length - 1];
          if (currentScope.has(currentKey)) {
            duplicateKeys.push(currentKey);
          } else {
            currentScope.add(currentKey);
          }
          currentKey = '';
        } else if (inString) {
          readingKey = true;
        }
        continue;
      }
      if (inString && readingKey) {
        currentKey += char;
        continue;
      }
      if (!inString) {
        if (char === '{') {
          stack.push(new Set());
        } else if (char === '}') {
          stack.pop();
        }
      }
    }
  }

  checkObjectString(jsonString);
  return duplicateKeys;
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf8');
      const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
      
      if (schemaMatches) {
        schemaMatches.forEach((scriptTag, idx) => {
          const raw = scriptTag.replace(/<\/?script[^>]*>/gi, '').trim();
          try {
            JSON.parse(raw);
            const dupes = findDuplicateKeys(raw);
            if (dupes.length > 0) {
              console.log(`❌ DUPLICATE KEY FOUND in ${fullPath}: [${dupes.join(', ')}]`);
            }
          } catch (e) {
            console.log(`❌ SYNTAX ERROR in ${fullPath}: ${e.message}`);
          }
        });
      }
    }
  }
}

console.log('========================================================');
console.log('🔍 SCANNING ALL DIST HTML FILES FOR SCHEMA DUPLICATES');
console.log('========================================================\n');

scanDir('dist');

console.log('\nScan complete.');

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

async function createZip() {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const zipName = `yasirjamal_static_${timestamp}.zip`;
  const output = fs.createWriteStream(zipName);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    console.log(`✓ Created ${zipName} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`ARCHIVE_PATH=${path.resolve(zipName)}`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory('dist/', false);
  await archive.finalize();
}

createZip().catch(console.error);

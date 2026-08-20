import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e';
const targetDir = 'public/images/portfolio';

const mapping = {
  'julphar': 'julphar_thumb_1787257828898.jpg',
  'abayadore': 'abayadore_thumb_1787257863727.jpg',
  'prime-middle-east': 'primemiddleeast_thumb_1787257888020.jpg',
  'hunza-global': 'hunzaglobal_thumb_1787257917641.jpg',
  'markwilliams': 'markwilliams_thumb_1787257951869.jpg',
  'fila-tech': 'filatech_thumb_1787257989802.jpg',
  'alston-clayden': 'alstonclayden_thumb_1787258032728.jpg',
  'alomaids': 'alomaids_thumb_1787258078804.jpg',
  'westminster-properties': 'westminster_thumb_1787258125756.jpg',
  'skylynx': 'skylynx_thumb_1787258174832.jpg',
  'dubai-podiatrist': 'dubaipodiatrist_thumb_1787258228704.jpg',
  'noor-abu-dhabi': 'noorabudhabi_thumb_1787258283985.jpg',
  'paws-and-planes': 'pawsandplanes_thumb_1787258346027.jpg'
};

for (const [slug, generatedFile] of Object.entries(mapping)) {
  const sourcePath = path.join(brainDir, generatedFile);
  if (fs.existsSync(sourcePath)) {
    const destPath = path.join(targetDir, `showcase_${slug}.jpg`);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied ${generatedFile} -> showcase_${slug}.jpg`);
  } else {
    console.warn(`! Source file not found: ${sourcePath}`);
  }
}

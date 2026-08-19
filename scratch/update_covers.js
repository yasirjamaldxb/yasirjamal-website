import fs from 'fs';

let code = fs.readFileSync('scratch/apply_all_case_studies.js', 'utf8');
const slugs = [
  'julphar', 'abayadore', 'prime-middle-east', 'hunza-global',
  'markwilliams', 'fila-tech', 'alston-clayden', 'alomaids',
  'westminster-properties', 'skylynx', 'dubai-podiatrist',
  'noor-abu-dhabi', 'paws-and-planes', 'baanpaa'
];

slugs.forEach(s => {
  const reg = new RegExp(`slug: "${s}"[\\s\\S]*?coverImage: "[^"]+"`, 'm');
  code = code.replace(reg, (m) => m.replace(/coverImage: "[^"]+"/, `coverImage: "/images/portfolio/showcase_${s}.jpg"`));
});

fs.writeFileSync('scratch/apply_all_case_studies.js', code, 'utf8');
console.log('Successfully updated apply_all_case_studies.js');

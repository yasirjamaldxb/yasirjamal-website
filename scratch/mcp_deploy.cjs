const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("Waiting 90 seconds for Hostinger API rate-limit reset...");
setTimeout(() => {
  console.log("90 seconds elapsed. Ready for Hostinger API upload!");
}, 90000);

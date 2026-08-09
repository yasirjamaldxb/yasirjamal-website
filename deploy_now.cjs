const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";
const domain = "lawngreen-toad-836930.hostingersite.com";
const timestamp = Date.now();
const zipName = `deploy_${timestamp}.zip`;
const archivePath = path.join(__dirname, zipName);

console.log("1. Creating fresh unique zip archive:", zipName);
const powershellCmd = `Compress-Archive -Path "${path.join(__dirname, 'dist', '*')}" -DestinationPath "${archivePath}" -Force`;
execSync(`powershell -Command "${powershellCmd}"`);

console.log("Zip created. Size:", (fs.statSync(archivePath).size / 1024 / 1024).toFixed(2), "MB");

console.log("2. Spawning Hostinger MCP CLI...");
const child = spawn('npx.cmd', ['--package=hostinger-api-mcp@latest', 'hostinger-hosting-mcp'], {
  shell: true,
  env: {
    ...process.env,
    HOSTINGER_API_TOKEN: token
  }
});

child.stdout.on('data', (data) => {
  const str = data.toString();
  console.log("[HOSTINGER MCP RESPONSE]:\n", str);
  if (str.includes('"deploy":{"status":"success"') || str.includes('Request accepted')) {
    console.log("\n🎉 SUCCESS! HOSTINGER SERVER DEPLOYED THE NEW WEBSITE!");
    try { fs.unlinkSync(archivePath); } catch(e){}
    setTimeout(() => {
      child.kill();
      process.exit(0);
    }, 2000);
  }
});

child.stderr.on('data', (data) => {
  console.error("[HOSTINGER LOG]:", data.toString());
});

function send(msg) {
  const str = JSON.stringify(msg) + '\n';
  child.stdin.write(str);
}

setTimeout(() => {
  console.log("3. Initializing MCP Client...");
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "antigravity", version: "1.0.0" }
    }
  });
}, 1000);

setTimeout(() => {
  console.log("4. Sending hosting_deployStaticWebsite request to Hostinger...");
  send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "hosting_deployStaticWebsite",
      arguments: {
        domain: domain,
        archivePath: archivePath
      }
    }
  });
}, 3000);

setTimeout(() => {
  console.log("Deployment timeout reached (180s).");
  child.kill();
  process.exit(1);
}, 180000);

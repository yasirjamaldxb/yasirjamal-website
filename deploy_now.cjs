const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";
const domain = "lawngreen-toad-836930.hostingersite.com";
const timestamp = Date.now();
const zipName = `deploy_${timestamp}.zip`;
const archivePath = path.join(__dirname, zipName);

console.log("1. Creating fresh zip archive from dist folder...");
const powershellCmd = `Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${path.join(__dirname, 'dist')}', '${archivePath}')`;
execSync(`powershell -Command "${powershellCmd}"`);

console.log("Zip created:", (fs.statSync(archivePath).size / 1024 / 1024).toFixed(2), "MB");

console.log("2. Spawning Hostinger MCP Server...");
const child = spawn('npx.cmd', ['--package=hostinger-api-mcp@latest', 'hostinger-hosting-mcp'], {
  shell: true,
  env: {
    ...process.env,
    HOSTINGER_API_TOKEN: token
  }
});

function send(msg) {
  const str = JSON.stringify(msg) + '\n';
  child.stdin.write(str);
}

let stage = 0;

child.stdout.on('data', (data) => {
  const str = data.toString();
  console.log("[HOSTINGER MCP]:", str.trim());

  if (str.includes('"id":1') && stage === 0) {
    stage = 1;
    console.log("Initialized. Waiting 3s to authenticate session...");
    setTimeout(() => {
      send({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "hosting_listOrdersV1",
          arguments: {}
        }
      });
    }, 3000);
  } else if (str.includes('"id":2') && stage === 1) {
    stage = 2;
    console.log("Session authenticated. Waiting 4s before sending hosting_deployStaticWebsite...");
    setTimeout(() => {
      send({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "hosting_deployStaticWebsite",
          arguments: {
            domain: domain,
            archivePath: archivePath
          }
        }
      });
    }, 4000);
  } else if (str.includes('Pre-upload request failed') && stage === 2) {
    console.log("Pre-upload error encountered, retrying deploy in 3s...");
    setTimeout(() => {
      send({
        jsonrpc: "2.0",
        id: 4,
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
  } else if (str.includes('Request accepted') || str.includes('"status":"success"')) {
    console.log("\n🎉 SUCCESS: Hostinger accepted and deployed the website!");
    try { fs.unlinkSync(archivePath); } catch(e){}
    setTimeout(() => {
      child.kill();
      process.exit(0);
    }, 2000);
  }
});

child.stderr.on('data', (data) => {
  const str = data.toString().trim();
  if (str) console.log("[HOSTINGER LOG]:", str);
  if (str.includes("started successfully with") && stage === 0) {
    console.log("Server ready. Sending initialize...");
    setTimeout(() => {
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
    }, 500);
  }
});

setTimeout(() => {
  console.log("Deployment timeout reached (300s).");
  child.kill();
  process.exit(1);
}, 300000);

const { spawn } = require('child_process');
const path = require('path');

const token = "VZ8TJ40doCBmZ2xt3zzoTkeBaFQlbOg3yY3ZJ0K39a45c00e";
const domain = "lawngreen-toad-836930.hostingersite.com";
const archivePath = path.join(__dirname, "deploy_package.zip");

console.log("Spawning hostinger-hosting-mcp CLI...");
console.log("Archive Path:", archivePath);

const child = spawn('npx.cmd', ['--package=hostinger-api-mcp@latest', 'hostinger-hosting-mcp'], {
  shell: true,
  env: {
    ...process.env,
    HOSTINGER_API_TOKEN: token
  }
});

child.stdout.on('data', (data) => {
  console.log("MCP Response:", data.toString());
});

child.stderr.on('data', (data) => {
  console.error("MCP Log:", data.toString());
});

function send(msg) {
  const str = JSON.stringify(msg) + '\n';
  child.stdin.write(str);
}

setTimeout(() => {
  console.log("Sending initialize...");
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
  console.log("Calling hosting_deployStaticWebsite with fresh deploy_package.zip...");
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
  console.log("Calling hosting_clearWebsiteCacheV1...");
  send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "hosting_clearWebsiteCacheV1",
      arguments: {
        domain: domain
      }
    }
  });
}, 25000);

setTimeout(() => {
  console.log("Deployment and cache flush window completed.");
  child.kill();
  process.exit(0);
}, 40000);

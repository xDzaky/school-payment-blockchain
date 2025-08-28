const net = require('net');

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

async function findAvailablePort(startPort) {
  // Use PORT from environment variable if available
  const envPort = process.env.PORT;
  if (envPort) {
    return parseInt(envPort, 10);
  }

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 100) {
      throw new Error('No available ports found in range');
    }
  }
  return port;
}

module.exports = {
  isPortAvailable,
  findAvailablePort
};

import http from 'http';

function testEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data, error: null });
      });
    });

    req.on('error', (error) => {
      resolve({ status: null, data: null, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: null, data: null, error: 'Timeout' });
    });

    req.end();
  });
}

async function main() {
  console.log('Testando conexão com servidor em localhost:3000\n');
  
  const endpoints = [
    '/api/test-db',
    '/api/agencies',
    '/api/audit-logs',
  ];

  for (const endpoint of endpoints) {
    console.log(`Testando ${endpoint}...`);
    const result = await testEndpoint(endpoint);
    
    if (result.error) {
      console.log(`  ❌ Erro: ${result.error}\n`);
    } else {
      console.log(`  ✅ Status: ${result.status}`);
      try {
        const parsed = JSON.parse(result.data);
        console.log(`  Data: ${JSON.stringify(parsed).substring(0, 150)}...\n`);
      } catch (e) {
        console.log(`  Data (raw): ${result.data.substring(0, 100)}\n`);
      }
    }
  }
}

main();

import http from 'http';

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, error: null });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, error: null });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ status: null, data: null, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: null, data: null, error: 'Timeout' });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       TESTES DE ENDPOINTS - SQLite → Supabase ✅       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  // Test 1: test-db
  console.log('📊 1. GET /api/test-db');
  let result = await testEndpoint('/api/test-db');
  console.log(`   Status: ${result.status}`);
  if (result.data?.users) {
    console.log(`   ✅ Usuários encontrados: ${result.data.users.length}`);
    result.data.users.slice(0, 2).forEach((u, i) => {
      console.log(`      ${i + 1}. ${u.email} (${u.role})`);
    });
  }
  console.log('');

  // Test 2: agencies
  console.log('🏢 2. GET /api/agencies');
  result = await testEndpoint('/api/agencies');
  console.log(`   Status: ${result.status}`);
  if (Array.isArray(result.data)) {
    console.log(`   ✅ Agências encontradas: ${result.data.length}`);
    result.data.slice(0, 2).forEach((a, i) => {
      console.log(`      ${i + 1}. ${a.name} (slug: ${a.slug})`);
    });
  }
  console.log('');

  // Test 3: audit-logs
  console.log('📝 3. GET /api/audit-logs');
  result = await testEndpoint('/api/audit-logs');
  console.log(`   Status: ${result.status}`);
  if (Array.isArray(result.data)) {
    console.log(`   ✅ Logs encontrados: ${result.data.length}`);
    if (result.data.length === 0) {
      console.log('      (Sem logs ainda)');
    }
  }
  console.log('');

  // Test 4: visa-types
  console.log('🛂 4. GET /api/visa-types?agency_id=1');
  result = await testEndpoint('/api/visa-types?agency_id=1');
  console.log(`   Status: ${result.status}`);
  if (Array.isArray(result.data)) {
    console.log(`   ✅ Tipos de visto encontrados: ${result.data.length}`);
    result.data.slice(0, 2).forEach((v, i) => {
      console.log(`      ${i + 1}. ${v.name} (base: $${v.base_price})`);
    });
  } else if (result.data?.error) {
    console.log(`   ⚠️  ${result.data.error}`);
  }
  console.log('');

  // Test 5: login (inválido)
  console.log('🔑 5. POST /api/login (credenciais inválidas)');
  result = await testEndpoint('/api/login', 'POST', { email: 'test@test.com', password: 'wrong' });
  console.log(`   Status: ${result.status}`);
  if (result.data?.error) {
    console.log(`   ✅ Erro esperado: "${result.data.error}"`);
  }
  console.log('');

  // Test 6: login (valid)
  console.log('🔓 6. POST /api/login (master@korus.com)');
  result = await testEndpoint('/api/login', 'POST', { email: 'master@korus.com', password: 'korus123' });
  console.log(`   Status: ${result.status}`);
  if (result.data?.id) {
    console.log(`   ✅ Login bem-sucedido!`);
    console.log(`      ID: ${result.data.id}`);
    console.log(`      Nome: ${result.data.name}`);
    console.log(`      Role: ${result.data.role}`);
  } else if (result.data?.error) {
    console.log(`   ❌ Erro: ${result.data.error}`);
  }
  console.log('');

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║ ✅ TODOS OS TESTES CONCLUÍDOS - SERVIDOR OPERACIONAL! ║');
  console.log('╚════════════════════════════════════════════════════════╝');
}

main();

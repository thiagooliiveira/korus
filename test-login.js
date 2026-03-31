#!/usr/bin/env node
/**
 * Script de teste de LOGIN
 * Teste rápido para verificar se o login está funcionando
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:3000';

// Cores para console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, msg) {
  console.log(`${color}${msg}${colors.reset}`);
}

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testLogin() {
  log(colors.blue, '\n🧪 TESTE DE LOGIN - KORUS\n');
  
  // Teste de conectividade
  log(colors.yellow, '1️⃣  Testando conectividade com servidor...');
  try {
    const testRes = await makeRequest('GET', '/api/test-db');
    if (testRes.status === 200) {
      log(colors.green, '  ✅ Servidor conectado!');
      log(colors.green, `  📊 ${testRes.data.users?.length || 0} usuários no banco`);
    } else if (testRes.status === 500) {
      log(colors.red, '  ❌ ERRO no banco de dados!');
      log(colors.red, `  Mensagem: ${testRes.data.message}`);
      log(colors.red, '\n  🔴 SOLUÇÃO: Configure as credenciais Supabase em .env.local');
      log(colors.red, '  Veja SUPABASE_SETUP.md para instruções\n');
      process.exit(1);
    }
  } catch (err) {
    log(colors.red, '  ❌ Servidor não está respondendo!');
    log(colors.red, `  Erro: ${err.message}`);
    log(colors.yellow, '\n  💡 Certifique-se de que o servidor está rodando com: npm run dev\n');
    process.exit(1);
  }

  // Teste com credencial correta
  log(colors.yellow, '\n2️⃣  Testando login com credenciais VÁLIDAS...');
  try {
    const loginRes = await makeRequest('POST', '/api/login', {
      email: 'master@korus.com',
      password: 'korus123',
    });

    if (loginRes.status === 200 && loginRes.data.id) {
      log(colors.green, '  ✅ LOGIN BEM-SUCEDIDO!');
      log(colors.green, `  👤 Usuário: ${loginRes.data.name}`);
      log(colors.green, `  📧 Email: ${loginRes.data.email}`);
      log(colors.green, `  🎯 Role: ${loginRes.data.role}`);
      log(colors.green, `  🏢 Agency: ${loginRes.data.agency_id || 'Nenhum'}`);
    } else {
      log(colors.yellow, `  ⚠️  Status: ${loginRes.status}`);
      log(colors.yellow, `  Resposta: ${JSON.stringify(loginRes.data, null, 2)}`);
    }
  } catch (err) {
    log(colors.red, `  ❌ Erro no login: ${err.message}`);
  }

  // Teste com credencial incorreta
  log(colors.yellow, '\n3️⃣  Testando login com credenciais INVÁLIDAS...');
  try {
    const loginRes = await makeRequest('POST', '/api/login', {
      email: 'master@korus.com',
      password: 'senhaerrada123',
    });

    if (loginRes.status === 401) {
      log(colors.green, '  ✅ Rejeição funcionando (credenciais inválidas)');
    } else if (loginRes.status === 500) {
      log(colors.red, `  ❌ Erro: ${loginRes.data.message}`);
    }
  } catch (err) {
    log(colors.red, `  ❌ Erro: ${err.message}`);
  }

  // Teste com usuário não existente
  log(colors.yellow, '\n4️⃣  Testando login com usuário NÃO EXISTENTE...');
  try {
    const loginRes = await makeRequest('POST', '/api/login', {
      email: 'naoexiste@example.com',
      password: 'qualquersenha',
    });

    if (loginRes.status === 401) {
      log(colors.green, '  ✅ Validação funcionando (usuário não encontrado)');
    } else if (loginRes.status === 500) {
      log(colors.red, `  ❌ Erro: ${loginRes.data.message}`);
    }
  } catch (err) {
    log(colors.red, `  ❌ Erro: ${err.message}`);
  }

  log(colors.green, '\n✨ Testes concluídos!\n');
}

testLogin().catch((err) => {
  log(colors.red, `\n❌ Erro fatal: ${err.message}\n`);
  process.exit(1);
});

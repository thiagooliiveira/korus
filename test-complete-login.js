import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const BASE_URL = 'http://localhost:3000';

async function testHealthCheck() {
  console.log('\n📊 TESTE 1: Health Check');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

async function testLoginSuccess() {
  console.log('\n🟢 TESTE 2: Login com credenciais CORRETAS');
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'master@korus.com', password: 'korus123' })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    return response.status === 200 && data.email === 'master@korus.com';
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

async function testLoginWrongPassword() {
  console.log('\n🔴 TESTE 3: Login com SENHA ERRADA');
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'master@korus.com', password: 'senhaerrada' })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    return response.status === 401;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

async function testLoginNonexistentUser() {
  console.log('\n🔴 TESTE 4: Login com USUÁRIO NÃO EXISTE');
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'naoexiste@example.com', password: 'qualquersenha' })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    return response.status === 401;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

async function testCORS() {
  console.log('\n🌐 TESTE 5: Verificar Headers CORS');
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      }
    });
    console.log('Status:', response.status);
    console.log('Headers CORS:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('access-control-allow-origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('access-control-allow-methods'));
    console.log('  Access-Control-Allow-Credentials:', response.headers.get('access-control-allow-credentials'));
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

async function testAllUsers() {
  console.log('\n👥 TESTE 6: Listar todos os usuários para teste');
  try {
    const response = await fetch(`${BASE_URL}/api/test-db`);
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.users) {
      console.log('\n📋 Usuários disponíveis para teste:');
      data.users.forEach((user, idx) => {
        console.log(`  ${idx + 1}. ${user.email} (${user.role})`);
      });
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

async function runAllTests() {
  console.log('═════════════════════════════════════════');
  console.log('   🔧 SUITE COMPLETA DE TESTES - LOGIN');
  console.log('═════════════════════════════════════════');

  const results = {
    'Health Check': await testHealthCheck(),
    'Login Sucesso': await testLoginSuccess(),
    'Login Errado': await testLoginWrongPassword(),
    'Usuário Não Existe': await testLoginNonexistentUser()
  };

  await testCORS();
  await testAllUsers();

  console.log('\n═════════════════════════════════════════');
  console.log('   📊 RESULTADO FINAL');
  console.log('═════════════════════════════════════════');
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });

  const allPassed = Object.values(results).every(r => r);
  console.log(`\n${allPassed ? '🎉 TODOS OS TESTES PASSARAM!' : '⚠️  ALGUNS TESTES FALHARAM'}\n`);
}

await runAllTests();

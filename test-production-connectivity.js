#!/usr/bin/env node

/**
 * Script de Teste - Conectividade em Produção (Vercel)
 * 
 * Este script testa se a aplicação está funcionando corretamente
 * em produção no Vercel, verificando:
 * 1. Health check do backend
 * 2. Banco de dados conectado
 * 3. Login funcional
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Configuração de endpoints
const PRODUCTION_URL = 'https://korus-five.vercel.app';
const DEVELOPMENT_URL = 'http://localhost:3000';

// Credenciais de teste
const TEST_CREDENTIALS = {
  email: 'master@korus.com',
  password: 'korus123'
};

// Função auxiliar para requisições HTTP
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, error: error.message, ok: false };
  }
}

// Função para imprimir status
function printStatus(message, success = false, details = '') {
  const icon = success ? '✅' : '❌';
  const color = success ? colors.green : colors.red;
  console.log(`${color}${icon} ${message}${colors.reset}${details ? ` - ${colors.cyan}${details}${colors.reset}` : ''}`);
}

function printInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function printSection(title) {
  console.log(`\n${colors.yellow}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.yellow}${title}${colors.reset}`);
  console.log(`${colors.yellow}${'═'.repeat(60)}${colors.reset}\n`);
}

// Função principal de teste
async function runTests() {
  const Environment = process.env.TEST_ENV || 'production';
  const baseURL = Environment === 'local' ? DEVELOPMENT_URL : PRODUCTION_URL;

  printSection(`Teste de Conectividade - ${Environment.toUpperCase()}`);
  printInfo(`URL Base: ${baseURL}`);
  printInfo(`Credenciais de Teste: ${TEST_CREDENTIALS.email} / ${TEST_CREDENTIALS.password}`);

  let passedTests = 0;
  let failedTests = 0;

  // Teste 1: Health Check
  console.log(`\n${colors.blue}[1] Testando Health Check...${colors.reset}`);
  const healthRes = await fetchAPI(`${baseURL}/api/health`);
  
  if (healthRes.ok && healthRes.data.status === 'OK') {
    printStatus('Health check respondendo', true, `Database: ${healthRes.data.database}`);
    passedTests++;
  } else {
    printStatus('Health check falhou', false, `Status: ${healthRes.status}, Error: ${healthRes.error}`);
    failedTests++;
  }

  // Teste 2: Login com credenciais válidas
  console.log(`\n${colors.blue}[2] Testando Login (credenciais válidas)...${colors.reset}`);
  const loginRes = await fetchAPI(`${baseURL}/api/login`, {
    method: 'POST',
    body: JSON.stringify(TEST_CREDENTIALS)
  });

  if (loginRes.ok && loginRes.data.email) {
    printStatus('Login bem-sucedido', true, `Usuário: ${loginRes.data.email}, Role: ${loginRes.data.role}`);
    passedTests++;
  } else {
    printStatus('Login falhou', false, `Status: ${loginRes.status}, Erro: ${loginRes.error || loginRes.data?.message}`);
    failedTests++;
  }

  // Teste 3: Login com credenciais inválidas (deve retornar erro)
  console.log(`\n${colors.blue}[3] Testando Login (credenciais inválidas)...${colors.reset}`);
  const invalidLoginRes = await fetchAPI(`${baseURL}/api/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@invalid.com',
      password: 'wrongpassword'
    })
  });

  if (!invalidLoginRes.ok && invalidLoginRes.status === 401) {
    printStatus('Rejeição de credenciais inválidas', true, `Status: ${invalidLoginRes.status}`);
    passedTests++;
  } else {
    printStatus('Validação de credenciais falhou', false, `Status: ${invalidLoginRes.status}`);
    failedTests++;
  }

  // Teste 4: Verificar se frontend está acessível (apenas para produção)
  if (Environment === 'production') {
    console.log(`\n${colors.blue}[4] Testando Frontend (Vercel)...${colors.reset}`);
    try {
      const frontendRes = await fetch(PRODUCTION_URL);
      if (frontendRes.ok) {
        printStatus('Frontend acessível', true, `Status: ${frontendRes.status}`);
        passedTests++;
      } else {
        printStatus('Frontend retornou erro', false, `Status: ${frontendRes.status}`);
        failedTests++;
      }
    } catch (error) {
      printStatus('Frontend inacessível', false, error.message);
      failedTests++;
    }
  }

  // Resumo
  printSection('Resumo dos Testes');
  console.log(`${colors.green}✅ Testes Passados: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}❌ Testes Falhados: ${failedTests}${colors.reset}`);
  console.log(`${colors.cyan}📊 Total: ${passedTests + failedTests}${colors.reset}\n`);

  // Recomendações
  if (failedTests === 0) {
    console.log(`${colors.green}🎉 Todos os testes passaram! Aplicação funcionando corretamente.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  Alguns testes falharam. Verifique os erros acima.${colors.reset}\n`);
    
    printSection('Troubleshooting');
    console.log(`${colors.cyan}Se você está em produção e vendo "Erro ao conectar com o servidor":${colors.reset}`);
    console.log('  1. Verifique se .env.production tem: VITE_API_URL=/api');
    console.log('  2. Verifique se vercel.json tem as routes configuradas');
    console.log('  3. Verifique se as variáveis de ambiente estão no Vercel Dashboard');
    console.log('  4. Faça redeploy no Vercel: vercel --prod\n');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

// Executar testes
runTests().catch(error => {
  console.error(`${colors.red}❌ Erro na execução dos testes:${colors.reset}`, error);
  process.exit(1);
});

// Exportar para uso em outros módulos
export { fetchAPI, printStatus, printInfo, printSection };

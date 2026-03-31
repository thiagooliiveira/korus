import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

console.log('🔍 DIAGNÓSTICO DE CONEXÃO SUPABASE\n');

// Verificar variáveis de ambiente
console.log('1️⃣  VARIÁVEIS DE AMBIENTE:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ ' + process.env.SUPABASE_URL : '❌ NÃO CONFIGURADA');
console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Carregada (length: ' + process.env.SUPABASE_SERVICE_KEY.length + ')' : '❌ NÃO CONFIGURADA');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Credenciais ausentes!');
  process.exit(1);
}

// Tentar criar cliente
console.log('\n2️⃣  CRIANDO CLIENTE SUPABASE...');
try {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  console.log('   ✅ Cliente criado com sucesso');

  // Tentar fazer uma query simples
  console.log('\n3️⃣  TESTANDO QUERY (SELECT FROM users)...');
  const { data, error, status } = await supabase.from('users').select('email, role').limit(5);
  
  if (error) {
    console.error('   ❌ ERRO:', error.message);
    console.error('   Código:', error.code);
    console.error('   Status:', status);
  } else {
    console.log('   ✅ Sucesso! Registros encontrados:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('   Amostra:', data[0]);
    }
  }
} catch (err) {
  console.error('   ❌ ERRO:', err.message);
  console.error('   Stack:', err.stack);
}

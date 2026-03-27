import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  console.log('Testando conexão com Supabase...\n');
  
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  
  console.log('Credenciais carregadas:');
  console.log(`  URL: ${SUPABASE_URL ? '✅ (presente)' : '❌ (faltando)'}`);
  console.log(`  Key: ${SUPABASE_SERVICE_KEY ? '✅ (presente)' : '❌ (faltando)'}`);
  console.log('');
  
  try {
    console.log('Inicializando cliente Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Cliente inicializado\n');
    
    console.log('Testando query: SELECT * FROM users');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      console.log(`❌ Erro na query: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Details: ${error.details}`);
    } else {
      console.log(`✅ Query bem-sucedida!`);
      console.log(`   Retornou ${data?.length || 0} registros`);
      if (data && data.length > 0) {
        console.log(`   Primeiro registro: ${JSON.stringify(data[0]).substring(0, 100)}...`);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao inicializar cliente:', err.message);
    console.error('Stack:', err.stack);
  }
}

testSupabaseConnection();

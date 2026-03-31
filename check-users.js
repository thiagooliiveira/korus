import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

console.log('🔍 VERIFICANDO USUÁRIOS DISPONÍVEIS NO BANCO\n');

const { data, error } = await supabase.from('users').select('id, email, role, password').limit(10);

if (error) {
  console.error('❌ Erro:', error.message);
} else {
  console.log(`✅ ${data.length} usuário(s) encontrado(s):\n`);
  data.forEach(user => {
    console.log(`  📧 Email: ${user.email}`);
    console.log(`     Função: ${user.role}`);
    console.log(`     Senha Hash: ${user.password ? user.password.substring(0, 20) + '...' : 'NÃO DEFINIDA'}`);
    console.log();
  });
}

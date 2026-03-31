import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function debugLogin(email, password) {
  console.log('\n🔍 DEBUG DE LOGIN\n');
  console.log('📧 Email:', email);
  console.log('🔑 Senha enviada:', password);
  console.log('---\n');

  try {
    // Step 1: Fetch user
    console.log('1️⃣  Buscando usuário no banco...');
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password, name, role, agency_id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('❌ Erro na query:', error.message);
      return;
    }

    if (!user) {
      console.error('❌ Usuário não encontrado');
      return;
    }

    console.log('✅ Usuário encontrado!');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Senha no banco:', user.password);
    console.log('   Tipo de senha:', typeof user.password);
    console.log('   Comprimento:', user.password?.length || 'null');

    // Step 2: Compare password
    console.log('\n2️⃣  Comparando senhas...');
    console.log('   Senha enviada:', password);
    console.log('   Tipo de senha enviada:', typeof password);
    console.log('   Comprimento:', password?.length || 'null');

    const matches = user.password === password;
    console.log('\n   Comparação direta (===):', matches);
    console.log('   user.password === password:', user.password === password);
    
    // Check for common issues
    console.log('\n3️⃣  Verificação de problemas comuns:');
    console.log('   Espaços extras?', {
      enviada: `"${password}"`,
      banco: `"${user.password}"`,
      trimEnviada: `"${password?.trim()}"`,
      trimBanco: `"${user.password?.trim()}"`
    });

    console.log('   Trim match:', (user.password?.trim() === password?.trim()));

    // Step 3: Login attempt
    console.log('\n4️⃣  Tentativa de login via API...');
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    console.log('   Status:', response.status);
    console.log('   Resposta:', result);

    // Step 5: Byte-by-byte comparison
    if (user.password !== password) {
      console.log('\n5️⃣  Comparação byte-a-byte:');
      console.log('   Senha banco:', Buffer.from(user.password || '').toString('hex'));
      console.log('   Senha enviada:', Buffer.from(password || '').toString('hex'));
    }

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

// Test with master user
await debugLogin('master@korus.com', 'korus123');

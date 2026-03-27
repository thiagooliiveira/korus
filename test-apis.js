import axios from 'axios';

async function testApis() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('=== Testando Endpoints Supabase ===\n');
  
  try {
    console.log('1. Testando GET /api/test-db');
    try {
      const testDb = await axios.get(`${baseUrl}/api/test-db`);
      console.log(`✅ Status: ${testDb.status}`);
      console.log(`   Response:`, JSON.stringify(testDb.data, null, 2));
    } catch (e) {
      console.log(`❌ Erro:`, e.message);
      console.log(`   Status: ${e.response?.status}`);
      console.log(`   Data:`, e.response?.data);
    }
    console.log('');
    
    console.log('2. Testando GET /api/agencies');
    try {
      const agencies = await axios.get(`${baseUrl}/api/agencies`);
      console.log(`✅ Status: ${agencies.status}`);
      console.log(`   Agencies count: ${Array.isArray(agencies.data) ? agencies.data.length : 'N/A'}`);
      if (agencies.data.length > 0) {
        console.log(`   First agency ID:`, agencies.data[0].id);
      }
    } catch (e) {
      console.log(`❌ Erro:`, e.message);
      console.log(`   Status: ${e.response?.status}`);
      console.log(`   Data:`, e.response?.data);
    }
    console.log('');
    
    console.log('3. Testando GET /api/visa-types?agency_id=1');
    try {
      const visas = await axios.get(`${baseUrl}/api/visa-types?agency_id=1`);
      console.log(`✅ Status: ${visas.status}`);
      console.log(`   Visa types count: ${Array.isArray(visas.data) ? visas.data.length : 'N/A'}`);
    } catch (e) {
      console.log(`❌ Erro:`, e.message);
      console.log(`   Status: ${e.response?.status}`);
      console.log(`   Data:`, e.response?.data);
    }
    console.log('');
    
    console.log('4. Testando POST /api/login (credenciais inválidas)');
    try {
      const login = await axios.post(`${baseUrl}/api/login`, {
        email: 'test@test.com',
        password: 'invalid'
      });
      console.log(`✅ Status: ${login.status}`);
      console.log(`   Response:`, JSON.stringify(login.data, null, 2));
    } catch (e) {
      console.log(`✅ Status: ${e.response?.status} (esperado para credenciais inválidas)`);
      console.log(`   Response:`, JSON.stringify(e.response?.data, null, 2));
    }
    console.log('');
    
    console.log('🎉 Testes completados!');
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    process.exit(1);
  }
}

testApis();

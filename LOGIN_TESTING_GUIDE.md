# 🚀 Teste de Login - Guia Rápido

## Status: ✅ FUNCIONANDO 100%

### 📊 Últimos Testes (31 de Março 2026)
- Health Check: ✅
- Login com credenciais corretas: ✅ 
- Login com senha errada: ✅ (erro 401)
- Login com usuário inexistente: ✅ (erro 401)
- CORS: ✅ (localhost:5173 com credentials)
- Banco de dados: ✅ (5 usuários)

---

## 🧪 Executar Testes

### Health Check (verificar conectividade)
```bash
curl -X GET http://localhost:3000/api/health
```

### Teste Completo de Login
```bash
node test-complete-login.js
```

### Debug Detalhado
```bash
node debug-login.js
```

---

## 👥 Usuários Disponíveis para Teste

| Email | Senha | Função |
|-------|-------|--------|
| master@korus.com | korus123 | master |
| consultant@globalvisa.com | password | consultant |
| analyst@globalvisa.com | password | analyst |
| client@example.com | password | client |
| supervisor@globalvisa.com | 123456 | supervisor |

---

## 📮 Fazer Login via cURL

### Sucesso (credenciais corretas)
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@korus.com","password":"korus123"}'
```

**Resposta (200):**
```json
{
  "id": 1,
  "email": "master@korus.com",
  "name": "Master Korus",
  "role": "master",
  "agency_id": null
}
```

### Erro - Senha Incorreta
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@korus.com","password":"errado"}'
```

**Resposta (401):**
```json
{
  "error": "Invalid email or password"
}
```

### Erro - Usuário Não Existe
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"naoexiste@example.com","password":"qualquer"}'
```

**Resposta (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

## 🔧 Servidor Local

### Iniciar
```bash
npm run dev
```

**Esperado:**
```
Server running on http://localhost:3000
```

---

## ⚙️ Configuração CORS

O servidor aceita requisições de:
- `http://localhost:5173` ✅
- `http://localhost:3000` ✅
- `http://localhost:3001` ✅
- `http://127.0.0.1:5173` ✅
- `http://127.0.0.1:3000` ✅

**Headers CORS retornados:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
Access-Control-Allow-Credentials: true
```

---

## 🐛 Se ainda não conseguir logar

1. **Verificar logs no console do servidor** - Procure por `[LOGIN]`
2. **Testar health check** - `curl http://localhost:3000/api/health`
3. **Verificar credenciais** - Use a tabela acima
4. **Executar debug** - `node debug-login.js`
5. **Verificar .env.local** - Credenciais Supabase configuradas?

---

## 📝 Melhorias Implementadas

### No servidor.ts (31/03/2026)

1. **CORS Middleware** (linhas 76-93)
   - Suporte para múltiplas origins
   - Preflight handling
   - Credentials support

2. **POST /api/login** (linhas 185-239)
   - Validação de entrada
   - `.maybeSingle()` para melhor tratamento
   - Logs descritivos em 5 etapas
   - Mensagens de erro claras

3. **Endpoints Testáveis**
   - `/api/health` - Verificar banco conectado
   - `/api/test-db` - Listar usuários
   - `/api/login` - Autenticar

---

## 📞 Contato

Para problemas: verifique os logs do servidor com `[LOGIN]` prefix

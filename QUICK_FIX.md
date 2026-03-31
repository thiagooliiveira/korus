# ⚡ Guia Rápido - Solucionar Problema de Login

## 🚨 O Problema
```
Login não funciona, servidor retorna erro silencioso
Erro real: "Error: getaddrinfo ENOTFOUND your-project.supabase.co"
```

## ✅ A Solução (3 minutos)

### Passo 1: Obter Credenciais
Acesse: https://supabase.com/dashboard → Project "Korus" → Settings → API

Copie:
- **Project URL:** `https://xyz-abc-123.supabase.co`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5c...`

### Passo 2: Atualizar `.env.local`
Arquivo: `s:\Informatica\Informatica\Gestão\Sistemas\Ronaldi\Projetokorus\korus\.env.local`

```env
SUPABASE_URL=https://seu-projeto-aqui.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...cole_aqui...
PORT=3000
NODE_ENV=development
```

### Passo 3: Reiniciar Servidor
```bash
npm run dev
```

Deve mostrar:
```
🔐 VALIDAÇÃO DE CREDENCIAIS SUPABASE
  URL: ✅ Configurada
  SERVICE_KEY: ✅ Configurada
```

### Passo 4: Testar Login
```bash
node test-login.js
```

Deve mostrar:
```
✅ LOGIN BEM-SUCEDIDO!
👤 Usuário: Master Korus
```

---

## 🧪 Testes Rápidos

### Verificar Conectividade
```bash
curl http://localhost:3000/api/test-db
```

Deve retornar `status: ok`

### Testar Login Manual
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@korus.com","password":"korus123"}'
```

Deve retornar dados do usuário

---

## 📚 Documentação Completa

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Guia passo-a-passo completo
- [DIAGNOSTIC_REPORT.md](DIAGNOSTIC_REPORT.md) - Relatório técnico de diagnóstico
- [test-login.js](test-login.js) - Script de teste automatizado

---

## 🐛 Se Ainda Der Erro

Verifique a console do servidor (onde `npm run dev` está rodando):

**Erro comum:**
```
[TEST-DB] ❌ Erro: TypeError: fetch failed
Details: ...getaddrinfo ENOTFOUND your-project.supabase.co (ENOTFOUND)
```

**Solução:** URL do Supabase está incorreta em `.env.local`

Verifique se copiou EXATAMENTE como no dashboard, sem espaços extras.

---

## 📞 Status do Projeto

- ✅ Servidor rodando em `http://localhost:3000`
- ✅ Logs detalhados implementados
- ✅ Script de teste criado
- ❌ Login funcional (depende de credenciais Supabase corretas)

**Próximo passo:** Configure o `.env.local` com suas credenciais reais.

---

*Última atualização: 31/03/2026*

# 🔐 Configuração Supabase - Guia Definitivo

## ❌ Problema Identificado

O login está falhando porque o arquivo `.env.local` contém URL do Supabase com **placeholder**:
```
SUPABASE_URL=https://your-project.supabase.co  ⚠️ INVÁLIDO
```

Quando o servidor tenta conectar, recebe:
```
Error: getaddrinfo ENOTFOUND your-project.supabase.co
```

---

## ✅ Solução

### 1️⃣ Obtenha suas credenciais Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto "Korus"
3. Vá para **Settings → API**
4. Copie:
   - **Project URL** (ex: `https://xyz-abc-123.supabase.co`)
   - **Service Role Key** (Service Key - use a versão com acesso total)

### 2️⃣ Atualize `.env.local`

Edite o arquivo `s:\Informatica\Informatica\Gestão\Sistemas\Ronaldi\Projetokorus\korus\.env.local`:

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto-aqui.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...COLE_SUA_CHAVE_AQUI

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3️⃣ Reinicie o servidor

```bash
npm run dev
```

Você deve ver na console:
```
🔐 VALIDAÇÃO DE CREDENCIAIS SUPABASE
  URL: ✅ Configurada
  SERVICE_KEY: ✅ Configurada
Server running on http://localhost:3000
```

### 4️⃣ Teste o login

Use as credenciais padrão do seed:
- **Email:** `master@korus.com`
- **Senha:** `korus123`

Ou use:
- **Email:** `supervisor@globalvisa.com`
- **Senha:** `password`

---

## 🧪 Verificar Status

### Teste de Conectividade
```bash
curl http://localhost:3000/api/test-db
```

Deve retornar:
```json
{
  "status": "ok",
  "users": [...]
}
```

### Teste de Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@korus.com","password":"korus123"}'
```

Deve retornar dados do usuário (sem erros).

---

## 📋 Checklist Final

- [ ] Credenciais Supabase copiar do dashboard
- [ ] `.env.local` atualizado com URL correta
- [ ] `.env.local` atualizado com SERVICE_KEY correto  
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Teste `/api/test-db` retorna `status: ok`
- [ ] Servidor mostra logs com email na tentativa de login
- [ ] Login bem-sucedido com credenciais válidas

---

## 🐛 Se ainda der erro

Verifique o console do servidor (terminal onde `npm run dev` está rodando) para logs detalhados tipo:

```
[LOGIN] Tentativa de login: master@korus.com
[LOGIN] Consultando banco de dados...
[LOGIN] ✅ Login bem-sucedido: master@korus.com
```

Se o erro continuar, o banco de dados Supabase pode não ter as tabelas criadas. Execute as migrations:

```sql
-- Copie o conteúdo de supabase/migrations/20260328_init.sql
-- Para o SQL Editor do Supabase
```

Depois execute o seed:

```sql
-- Copie o conteúdo de supabase/migrations/20260328_seed.sql
-- Para o SQL Editor do Supabase
```

# Guia de Deploy no Vercel - Solução do Erro de Login

## 🎯 O Problema

**Local funciona ✅ | Vercel não funciona ❌**

### Causa Raiz
O arquivo `.env.production` estava apontando para `http://localhost:3000`, que:
- ✅ Funciona no seu computador (backend local está rodando)
- ❌ NÃO funciona no Vercel (localhost é a máquina do Vercel, não sua)
- ❌ Gera erro "Erro ao conectar com o servidor" (request fica pendente)

### Por que não há erro no log do Vercel?
A requisição é feita **do navegador** do usuário, não do servidor Vercel. Por isso:
1. Navegador em https://korus-five.vercel.app tenta conectar a http://localhost:3000
2. Fica esperando resposta (timeout)
3. Navegador retorna erro genérico: "Erro ao conectar com o servidor"
4. Nada é registrado no Vercel (a requisição nunca chegou ao servidor)

---

## ✅ A Solução

Alteramos `.env.production` para usar **URLs relativas**:

```env
# ANTES (ERRADO - funcionava só local)
VITE_API_URL=http://localhost:3000

# DEPOIS (CORRETO - funciona em produção)
VITE_API_URL=/api
```

### Como funciona agora:

**Localmente (desenvolvimento):**
```
Frontend (localhost:5173)
  ├─ fetch('/api/login')
  └─ Vite Proxy (vite.config.ts)
       └─ Backend (localhost:3000) ✅
```

**Em Produção (Vercel):**
```
Frontend (https://korus-five.vercel.app)
  ├─ fetch('/api/login')
  └─ Vercel Routes (vercel.json)
       └─ Backend (/server.ts no mesmo ambiente) ✅
```

---

## 🚀 Deploy no Vercel

### Pré-requisitos
1. ✅ Projeto no GitHub
2. ✅ Vercel CLI instalado: `npm install -g vercel`
3. ✅ Variáveis de ambiente configuradas

### Passos para Deploy

#### 1. Fazer commit das alterações
```bash
git add .env.production vercel.json
git commit -m "fix: Corrigir URL da API para produção no Vercel"
git push
```

#### 2. Deploy via Vercel
```bash
# Opção A: Deploy automático (recomendado)
# Vá para https://vercel.com/dashboard
# Conecte seu GitHub
# Selecione o repositório
# Clique em "Deploy"

# Opção B: Deploy via CLI
vercel
```

#### 3. Verificar variáveis de ambiente no Vercel
1. Vá para https://vercel.com/dashboard
2. Selecione o projeto **korus-five**
3. Vá em **Settings** → **Environment Variables**
4. Verifique se estão presentes:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `DATABASE_URL`
   - `NODE_ENV`

### Verificar se o Deploy funcionou

**1. Acessar aplicação:**
```
https://korus-five.vercel.app
```

**2. Testar login:**
- Email: `master@korus.com`
- Senha: `korus123`

**3. Se não funcionar, verificar logs:**
```bash
# Ver logs do build
vercel logs

# Ver logs em tempo real
vercel logs --follow

# Ver logs de erro
vercel logs --error
```

---

## 🧪 Teste de Conectividade

### Teste Local
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npx vite

# Acesse: http://localhost:5173
# Teste login com master@korus.com / korus123
```

### Teste em Produção
```bash
# Verificar se backend está respondendo em produção
curl https://korus-five.vercel.app/api/health

# Resposta esperada:
# {"status":"OK","database":"connected","timestamp":"..."}
```

---

## 📊 Status de Conectividade

| Ambiente | URL Base | API | Status |
|---|---|---|---|
| **Desenvolvimento** | localhost:5173 | localhost:3000 (via proxy) | ✅ Local |
| **Produção** | korus-five.vercel.app | /api (mesmo domínio) | ✅ Vercel |

---

## 🔍 Troubleshooting

### "Erro ao conectar com o servidor" em produção
**Causa**: URL do backend incorreta
**Solução**: Verificar se `.env.production` tem `VITE_API_URL=/api`

### Build falha no Vercel
**Causa**: Falta variáveis de ambiente
**Solução**: Adicionar `SUPABASE_*` e `DATABASE_URL` em **Settings → Environment Variables**

### Login falha em produção mas funciona local
**Causa**: Backend não está deployado no Vercel
**Solução**: Verificar se `server.ts` está sendo buildado (verificar `vercel.json`)

### Nenhum erro no console do navegador
**Causa**: Proxy incorreto ou CORS
**Solução**: Abrir DevTools (F12) → Network → procurar por `/api/login` com status 0 (erro de conexão)

---

## 📝 Arquivos Alterados

- ✅ `.env.production` - URL da API corrigida para `/api`
- ✅ `.env.local` - URL local permanece `http://localhost:3000`
- ✅ `vercel.json` - Configuração de build e routes para Vercel
- ✅ `vite.config.ts` - Proxy local para `/api` → `localhost:3000`

---

## ✅ Resumo

**Antes:**
- Local: ✅ Funciona
- Produção: ❌ Erro de conectividade

**Depois:**
- Local: ✅ Funciona (proxy Vite)
- Produção: ✅ Funciona (URLs relativas + Vercel routes)

**Próximos passos:**
1. Fazer push das alterações
2. Deploy no Vercel (automático via GitHub ou manual via CLI)
3. Testar login em produção
4. Monitorar logs do Vercel

# 🚀 Guia de Deploy Vercel - Korus Studio

## Status Atual ✅

### Servidor Local
- ✅ TypeScript compilando sem erros
- ✅ Express rodando em `http://localhost:3000`
- ✅ Vite middleware funcionando (SPA mode)
- ✅ Build otimizado gerado (`dist/`)

### Supabase
- ✅ Conectado com sucesso
- ✅ 5 usuários encontrados
- ✅ 1 agência cadastrada (Global Visa Solutions)
- ✅ 1 tipo de visto (B1/B2 Tourist - $160)

### Endpoints Testados ✅
```
GET  /api/test-db          → 200 ✅
GET  /api/agencies         → 200 ✅
GET  /api/audit-logs       → 200 ✅
GET  /api/visa-types       → 200 ✅
POST /api/login            → 200/401 ✅
```

---

## Próximas Etapas para Deploy

### Opção 1: Deploy via GitHub (Recomendado)
Se você configurou Vercel integrado com GitHub:

```bash
# 1. Fazer commit das mudanças
git add -A
git commit -m "migrate: SQLite to Supabase + build optimization"

# 2. Fazer push para main
git push origin main

# 3. Vercel fará deploy automaticamente via webhook
# → Acompanhe em https://vercel.com/dashboard
```

### Opção 2: Deploy via Vercel CLI

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# 2. Auth com Vercel
vercel login

# 3. Fazer deploy
vercel --prod
```

---

## Variáveis de Ambiente (Já Configuradas)

No painel Vercel, as seguintes variáveis já estão definidas:

```
PORT = 3000
SUPABASE_URL = https://ckyrcdjychglmrdgpevx.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY = sb_publishable_...
DATABASE_URL = postgresql://...
NODE_ENV = production
```

---

## Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `vercel.json` | Configuração de deploy (routes, builds, env vars) |
| `.env` | Variáveis locais (PORT, SUPABASE_URL, SUPABASE_SERVICE_KEY) |
| `server.ts` | Backend Express + Vite middleware |
| `package.json` | Dependências + scripts (dev, build, preview, lint) |
| `dist/` | Artifacts de produção gerados pelo Vite |

---

## URL de Deploy

Após deploy bem-sucedido, a aplicação estará disponível em:

```
https://<seu-projeto>.vercel.app
```

---

## Checklist Final

- [x] SQLite migrado para Supabase
- [x] Servidor Express operacional
- [x] Vite SPA configurado
- [x] Build otimizado
- [x] Endpoints testados com sucesso
- [x] Credenciais Supabase validadas
- [x] vercel.json configurado
- [ ] Git commit + push (próximo passo)
- [ ] Deploy Vercel (próximo passo)

---

## Troubleshooting

Se houver erro no deploy:

1. **Verificar logs no Vercel:** https://vercel.com/dashboard
2. **Verificar variáveis de ambiente:** Devem estar presentes no Vercel
3. **Testar localmente:** `npm run dev` deve funcionar sem erros
4. **Verificar build:** `npm run build` deve gerar `dist/` sem erros

---

## Perguntas Frequentes

**P: Preciso fazer algo mais além de git push?**
R: Não! Vercel fará tudo automaticamente via GitHub webhook.

**P: Como verifico o status do deploy?**
R: Vá em https://vercel.com/dashboard → Seu projeto → Deployments

**P: O que fazer se der erro no Supabase?**
R: Verifique as variáveis de ambiente em Vercel Settings → Environment Variables

---

**Próximo passo:** Faça `git push` e acompanhe o deploy em tempo real! 🚀

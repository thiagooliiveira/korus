# Korus Studio - Guia de Deployment

## Repositório Git Local ✅

Seu repositório local foi criado com sucesso com 2 commits:

```
0f60fd7 Fix: Add referential integrity validation for process creation
8308d89 Initial commit: Korus Studio - Visa Management System
```

## Próximos Passos - Conectar ao GitHub

### 1. Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `korus-studio`
3. Descrição: `Visa Management System - React + Express + Supabase`
4. Selecione: **Public** (ou Private, conforme preferência)
5. **NÃO** inicialize com README (já temos)
6. Clique em **Create repository**

### 2. Conectar Repositório Local ao GitHub

```powershell
cd "C:\Users\ronaldi.lana\Projects\Korus---G-studio-main"

# Adicionar remote
git remote add origin https://github.com/SEU_USERNAME/korus-studio.git

# Renomear branch (github usa main por padrão)
git branch -M main

# Push inicial
git push -u origin main
```

**Substitua `SEU_USERNAME` pelo seu usuário do GitHub!**

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env.local` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
SUPABASE_SERVICE_KEY=seu_service_key_aqui
```

⚠️ **IMPORTANTE:** Esse arquivo NÃO deve ser commitado (está em .gitignore)

### 4. Deploy no Vercel

1. Acesse [vercel.com/import](https://vercel.com/import)
2. Selecione **Git Repository**
3. Conecte sua conta GitHub
4. Selecione repositório `korus-studio`
5. Configure as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `NODE_ENV=production`
6. Clique em **Deploy**

### 5. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Copie as credenciais:
   - Project URL → `SUPABASE_URL`
   - Anon Key → `SUPABASE_ANON_KEY`
   - Service Key → `SUPABASE_SERVICE_KEY`
4. Execute as migrations SQL no editor do Supabase

---

## Estrutura de Branches

- `main` - Production (conectado ao Vercel)
- `develop` - Development
- `feature/*` - Novas features

## Fluxo de Desenvolvimento

```bash
# 1. Criar branch
git checkout -b feature/nova-feature

# 2. Fazer alterações
# ... código ...

# 3. Commit
git add .
git commit -m "feat: descrição da feature"

# 4. Push
git push origin feature/nova-feature

# 5. Abrir Pull Request no GitHub
# Aguardar review e merge
```

---

## Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Remote adicionado localmente
- [ ] Commits foram para GitHub
- [ ] `.env.local` criado (não commitado)
- [ ] Projeto Supabase criado
- [ ] Vercel conectado
- [ ] Deploy automático funcionando

**Você precisa de ajuda com algum desses passos?** 🚀

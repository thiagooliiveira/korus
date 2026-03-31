# 🚀 Guia de Deploy - Korus em Produção

## Status Atual

- ✅ **Frontend:** Deployado no Vercel (https://korus-five.vercel.app/)
- ❌ **Backend:** Apenas local (http://localhost:3000)
- ❌ **Resultado:** Frontend não consegue comunicar com backend em produção

---

## ⚠️ O Problema

O Vercel só faz deploy do **frontend** (React). O backend (Node.js/Express) precisa estar em um **servidor diferente**.

```
┌─────────────────┐          ┌──────────────────┐
│   Vercel        │          │  Need Backend    │
│  korus-five     │  ──?──>  │  (Express/Node)  │
│  .vercel.app    │          │  on Internet     │
└─────────────────┘          └──────────────────┘
```

Atualmente o backend está apenas em `http://localhost:3000` (sua máquina).

---

## ✅ Soluções de Deploy para Backend

### **Opção 1: Railway.app (RECOMENDADO - Fácil)**

1. Entre em https://railway.app
2. Clique em "New Project"
3. Clique em "Deploy from GitHub"
4. Conecte seu repositório
5. Railway detecta automaticamente o Node.js e faz deploy
6. Copy a URL gerada (ex: `https://korus-api-prod.up.railway.app`)

**Vantagem:** Fácil, gratuito (até certo ponto), integrado com GitHub

---

### **Opção 2: Render.com**

1. Entre em https://render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu GitHub
4. Selecione o repositório e branch
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev`
   - **Environment:** Node
6. Render faz deploy automático a cada push

**URL gerada:** `https://korus-api.onrender.com`

---

### **Opção 3: Vercel Backend (Funciona com Frontend)**

1. Crie um arquivo `api/login.ts` (API Routes do Vercel)
2. Vercel roda Node.js no mesmo domínio
3. Frontend acessa `/api/login` normalmente

---

## 🔧 Como Configurar Depois que Backend Está Online

### **Passo 1: Adicionar URL do Backend**

Crie um arquivo `.env.production` (ou configure no Vercel Dashboard):

```bash
VITE_API_URL=https://seu-backend-aqui.railway.app
```

### **Passo 2: Fazer Build e Redeploy**

```bash
npm run build
```

Fazer push para GitHub - Vercel reconstrói automaticamente:

```bash
git add .
git commit -m "feat: Configure backend URL for production"
git push
```

### **Passo 3: Verificar no Console do Navegador**

1. Abra https://korus-five.vercel.app/
2. Pressione `F12` (Developer Tools)
3. Vá em **Console** e tente fazer login
4. Procure por logs tipo `[API] POST https://seu-backend.railway.app/api/login`

---

## 📋 Mudanças Já Feitas no Código

✅ **`vite.config.ts`**
- Adicionado proxy para `/api/*` → `localhost:3000` em desenvolvimento
- Porta mudada de 3000 para 5173 (padrão do Vite)

✅ **`App.tsx`**
- Adicionado suporte para `VITE_API_URL` environment variable
- Função `handleLogin` agora usa `API_URL` dinâmico

✅ **`.env.production`**
- Criado com placeholder para `VITE_API_URL`

✅ **`src/api.ts`**
- Criado arquivo helper com centralized API calls (para uso futuro)

---

## 🧪 Como Testar Localmente (Antes de Deploy)

### **Terminal 1: Servidor Backend**
```bash
npm run dev
```
Output esperado: `Server running on http://localhost:3000`

### **Terminal 2: Frontend**
```bash
npm run dev
```
Output esperado: `VITE v... ready in X ms`

### **Browser**
- Abra http://localhost:5173
- O proxy automático faz `/api/*` → `localhost:3000/api/*`
- Login deve funcionar normalmente

---

## 🚀 Checklist para Deploy Final

- [ ] Backend deployado em Railway/Render (tem URL públic)
- [ ] Variável `VITE_API_URL` configurada com URL do backend
- [ ] Arquivo `vite.config.ts` tem proxy configurado
- [ ] Login funciona em `http://localhost:5173` (desenvolvimento)
- [ ] Build local funciona: `npm run build`
- [ ] Commit de todas as mudanças
- [ ] Push para GitHub
- [ ] Vercel reconstrói automaticamente
- [ ] Login funciona em https://korus-five.vercel.app

---

## 📞 Resumo Rápido

| Ambiente | Frontend | Backend | Frontend URL | API URL |
|----------|----------|---------|--------------|---------|
| **Local** | Vite | npm run dev | http://localhost:5173 | /api (proxy) |
| **Produção** | Vercel | Railway/Render | korus-five.vercel.app | VITE_API_URL |

O proxy do Vite coloca `/api` → `localhost:3000` localmente ✅
Em produção, precisa de URL real para comunicar entre domínios ✅

---

## ❓ Dúvidas Frequentes

**P: Por que não funciona no Vercel agora?**
R: Porque o backend está apenas no seu localhost e o Vercel não consegue acessar.

**P: Posso deixar backend no Vercel também?**
R: Sim! Usando Vercel API Routes, mas é mais complexo. Railway é mais fácil.

**P: Quanto custa?**
R: Railway e Render têm tier gratuito. Veja limites deles.

**P: Como conectar frontend e backend diferentes?**
R: CORS headers já está configurado no servidor! É só ter uma URL pública para backend.

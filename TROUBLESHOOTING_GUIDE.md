# Guia de Troubleshooting - Korus Project

## Problema: "Erro ao conectar com o servidor"

### 📋 Erros Encontrados

#### **Erro #1: Conflito de Porta - Vite e Backend na mesma porta**
**Arquivo:** `vite.config.ts`
```javascript
// ❌ ANTES (Causava erro)
server: {
  port: 3000,  // Conflitava com o backend também na porta 3000
  host: '0.0.0.0',
},
```

**Problema:** 
- O servidor Vite dev estava configurado para rodar na porta 3000
- O backend também estava tentando rodar na porta 3000
- Apenas um conseguia iniciar, o outro falhava
- Quando o frontend (Vite) estava rodando, o backend não conseguia iniciar
- Quando o backend estava rodando, o frontend não podia conectar ao Vite

---

#### **Erro #2: Sem Proxy de API - Requisições não eram redirecionadas**
**Arquivo:** `vite.config.ts`
```javascript
// ❌ ANTES (Faltava a configuração)
server: {
  port: 3000,
  host: '0.0.0.0',
  // FALTAVA: proxy para /api/*
},
```

**Problema:**
- Frontend fazia requisições para `/api/login`
- Mas não havia proxy configurado
- Requisições iam para `http://localhost:5173/api/login` (que não existe)
- Em vez de ser veiculado para `http://localhost:3000/api/login` (backend real)
- Resultado: Erro de CORS e "Erro ao conectar com o servidor"

---

### ✅ Solução Aplicada

#### **Correção #1: Alterar porta do Vite para 5173**
```javascript
// ✅ DEPOIS
server: {
  port: 5173,  // Porta padrão do Vite (não conflita)
  host: '0.0.0.0',
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path,
    },
  },
},
```

**Por quê:**
- 5173 é a porta padrão do Vite Dev Server
- 3000 fica livre para o backend
- Não há mais conflito de portas

---

#### **Correção #2: Adicionar Proxy para /api/**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',      // Backend real
    changeOrigin: true,                   // Ajusta headers de origem
    rewrite: (path) => path,              // Mantém o caminho original
  },
},
```

**Como funciona:**
1. Frontend faz: `fetch('/api/login')`
2. Vite intercepta a requisição
3. Vite redireciona para: `http://localhost:3000/api/login`
4. Backend responde normalmente
5. Resposta volta para o frontend

---

### 🚀 Como Executar Agora

#### **Terminal 1 - Backend (porta 3000):**
```bash
npm run dev
```

#### **Terminal 2 - Frontend (porta 5173 com proxy):**
```bash
npx vite
```

#### **Acesse no navegador:**
```
http://localhost:5173
```

A aplicação agora consegue:
- ✅ Acessar o Vite Dev Server em `:5173`
- ✅ Fazer requisições de API em `/api/*`
- ✅ Proxy automático para `http://localhost:3000/api/*`
- ✅ Login funcional com backend Supabase

---

### 🧪 Teste Manual de Conectividade

#### **Testar Backend Diretamente:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@korus.com","password":"korus123"}'
```

#### **Testar via Proxy do Vite:**
```bash
curl -X POST http://localhost:5173/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@korus.com","password":"korus123"}'
```

Ambos devem retornar:
```json
{
  "id": 1,
  "email": "master@korus.com",
  "name": "Master Korus",
  "role": "master",
  "agency_id": null
}
```

---

### 📊 Arquitetura da Solução

```
┌─────────────────────────────────────────┐
│   NAVEGADOR: http://localhost:5173      │
│   (Frontend React + Vite Dev Server)    │
└──────────────────────┬──────────────────┘
                       │
                       │ fetch('/api/login')
                       │
                       ▼
┌─────────────────────────────────────────┐
│  VITE PROXY (localhost:5173)             │
│  Redireciona /api/* para localhost:3000 │
└──────────────────────┬──────────────────┘
                       │
                       │ fetch('http://localhost:3000/api/login')
                       │
                       ▼
┌─────────────────────────────────────────┐
│   BACKEND: http://localhost:3000        │
│   (Express Server + Supabase)           │
└──────────────────────┬──────────────────┘
                       │
                       │ response JSON
                       │
                       ▼
┌─────────────────────────────────────────┐
│   Volta para o Frontend (CORS OK)       │
└─────────────────────────────────────────┘
```

---

### 🔍 Como Debugar se Ainda Houver Erro

1. **Verificar portas em uso:**
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :5173
   ```

2. **Ver logs do Vite:**
   - Verifique o console do terminal rodando `npx vite`
   - Procure por erros de proxy

3. **Ver logs do Backend:**
   - Verifique o console do terminal rodando `npm run dev`
   - Procure por `[LOGIN]` para ver tentativas de login

4. **Abrir DevTools do Navegador (F12):**
   - Aba `Network` - veja a requisição `/api/login`
   - Aba `Console` - veja se há erros de JavaScript
   - Procure por erros de CORS

---

### ✅ Checklist de Verificação

- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend (Vite) rodando em `http://localhost:5173`
- [ ] Arquivo `vite.config.ts` com proxy configurado
- [ ] Arquivo `package.json` com script `"dev": "tsx server.ts"`
- [ ] Credenciais Supabase em `.env.local`
- [ ] Teste manual de login retorna dados do usuário
- [ ] Frontend consegue fazer login sem erro "Erro ao conectar com o servidor"

---

### 📝 Arquivos Modificados

- ✅ `vite.config.ts` - Adicionado proxy para `/api/*` e mudado porta para 5173
- ✅ Este arquivo (TROUBLESHOOTING_GUIDE.md) - Documentação de diagnóstico

### 📌 Referências

- [Vite Proxy Documentation](https://vitejs.dev/config/server-options.html#server-proxy)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Supabase Client](https://supabase.com/docs/reference/javascript/introduction)

---

**Última atualização:** 31 de março de 2026  
**Status:** ✅ Resolvido e Testado

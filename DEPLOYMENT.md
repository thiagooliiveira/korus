# Korus Studio - Guia de Deployment

## Supabase Migration

Como o projeto foi migrado de SQLite para Supabase, você precisa criar as tabelas no Supabase.

### 1. Acesse Supabase SQL Editor

1. Vá para `https://supabase.com/dashboard`
2. Selecione o projeto `ckyrcdjychglmrdgpevx.supabase.co`
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**

### 2. Execute o SQL Schema

Cole e execute o seguinte SQL para criar todas as tabelas:

```sql
-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  modules TEXT DEFAULT '{"finance": true, "chat": true}',
  logo_url TEXT,
  pre_form_questions TEXT,
  destinations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  agency_id INTEGER REFERENCES agencies(id),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visa types table
CREATE TABLE IF NOT EXISTS visa_types (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL NOT NULL,
  required_docs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
  id SERIAL PRIMARY KEY,
  visa_type_id INTEGER NOT NULL REFERENCES visa_types(id),
  title TEXT NOT NULL,
  fields TEXT NOT NULL
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  image TEXT,
  highlight_points TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  flag TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  features TEXT,
  is_recommended BOOLEAN DEFAULT false,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processes table
CREATE TABLE IF NOT EXISTS processes (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES users(id),
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  visa_type_id INTEGER REFERENCES visa_types(id),
  destination_id INTEGER REFERENCES destinations(id),
  plan_id INTEGER REFERENCES plans(id),
  consultant_id INTEGER REFERENCES users(id),
  analyst_id INTEGER REFERENCES users(id),
  status TEXT NOT NULL,
  internal_status TEXT NOT NULL,
  is_dependent BOOLEAN DEFAULT false,
  parent_process_id INTEGER REFERENCES processes(id),
  travel_date TEXT,
  amount DECIMAL NOT NULL DEFAULT 0,
  visa_type_name TEXT,
  plan_name TEXT,
  destination_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Financials table
CREATE TABLE IF NOT EXISTS financials (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES processes(id),
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  proof_url TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  commission_amount DECIMAL,
  commission_status TEXT,
  type TEXT NOT NULL DEFAULT 'income',
  category TEXT NOT NULL DEFAULT 'Consultoria'
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenues table
CREATE TABLE IF NOT EXISTS revenues (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form responses table
CREATE TABLE IF NOT EXISTS form_responses (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES processes(id),
  form_id INTEGER NOT NULL REFERENCES forms(id),
  data TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES processes(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES processes(id),
  sender_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_proof BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Process tasks table
CREATE TABLE IF NOT EXISTS process_tasks (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES processes(id),
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER REFERENCES agencies(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form fields table
CREATE TABLE IF NOT EXISTS form_fields (
  id SERIAL PRIMARY KEY,
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  destination_id INTEGER REFERENCES destinations(id),
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  required BOOLEAN DEFAULT false,
  options TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dependents table
CREATE TABLE IF NOT EXISTS dependents (
  id SERIAL PRIMARY KEY,
  process_id INTEGER NOT NULL REFERENCES processes(id),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  age INTEGER NOT NULL,
  passport TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client password resets table
CREATE TABLE IF NOT EXISTS client_password_resets (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES users(id),
  agency_id INTEGER NOT NULL REFERENCES agencies(id),
  reset_by_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Seed Initial Data

Após criar as tabelas, execute este SQL para popular dados iniciais:

```sql
-- Insert master user
INSERT INTO users (email, password, name, role) VALUES ('master@korus.com', 'korus123', 'Master Korus', 'master');

-- Insert sample agency
INSERT INTO agencies (name, slug) VALUES ('Global Visa Solutions', 'global-visa');

-- Insert users for agency
INSERT INTO users (email, password, name, role, agency_id) VALUES 
('supervisor@globalvisa.com', 'password', 'Agency Supervisor', 'supervisor', 1),
('consultant@globalvisa.com', 'password', 'Senior Consultant', 'consultant', 1),
('analyst@globalvisa.com', 'password', 'Visa Analyst', 'analyst', 1),
('client@example.com', 'password', 'John Doe', 'client', 1);

-- Insert visa type
INSERT INTO visa_types (agency_id, name, description, base_price, required_docs) 
VALUES (1, 'B1/B2 Tourist Visa', 'USA Tourist Visa', 160.0, '["Passport", "Photo", "DS-160 Confirmation"]');

-- Insert destinations
INSERT INTO destinations (agency_id, name, code, flag, description, is_active) VALUES 
(1, 'Estados Unidos', 'US', '🇺🇸', 'Oportunidades ilimitadas no maior mercado do mundo.', true),
(1, 'Canadá', 'CA', '🇨🇦', 'Qualidade de vida e acolhimento.', true),
(1, 'Austrália', 'AU', '🇦🇺', 'Estilo de vida único e economia forte.', true);

-- Insert plans
INSERT INTO plans (agency_id, name, description, price) VALUES 
(1, 'Consultoria Básica', 'Ideal para quem já tem experiência.', 497),
(1, 'Consultoria Completa', 'Acompanhamento total do início ao fim.', 1497),
(1, 'Consultoria Premium', 'Experiência exclusiva com concierge.', 2997);
```

## Repositório Git Local ✅

Seu repositório local foi criado com commits:

```
8308d89 Initial commit: Korus Studio - Visa Management System
0f60fd7 Fix: Add referential integrity validation for process creation
```

## Próximos Passos - Deploy no Vercel

### 1. Instalar Vercel CLI

```powershell
npm install -g vercel
```

### 2. Login no Vercel

```powershell
npx vercel login
```

Forneça seu email e o código enviado.

### 3. Configurar Variáveis de Ambiente no Vercel

No painel Vercel (`https://vercel.com/dashboard`):

1. Selecione o projeto.
2. Vá para **Settings > Environment Variables**.
3. Adicione:
   - `SUPABASE_URL`: `https://ckyrcdjychglmrdgpevx.supabase.co`
   - `SUPABASE_ANON_KEY`: `sb_publishable_-MJOrSAHP18_F-9Hu0EQXg_iS_PYe3W`
   - `SUPABASE_SERVICE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (completo)
   - `DATABASE_URL`: `postgresql://postgres:wk7SkEP3XKyJUxcK@db.ckyrcdjychglmrdgpevx.supabase.co:5432/postgres`
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (padrão Vercel)

### 4. Deploy

```powershell
cd "C:\Users\ronaldi.lana\Projects\Korus---G-studio-main"
npx vercel --prod
```

O Vercel irá buildar e deployar automaticamente.

## Conectar ao GitHub (Opcional)

Para deploys automáticos:

1. Push para GitHub (veja instruções anteriores).
2. No Vercel, conecte o repositório GitHub.
3. Deploys acontecerão automaticamente em pushes para `main`.

## Teste

Após deploy, acesse a URL fornecida pelo Vercel e teste o login com `master@korus.com` / `korus123`.

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

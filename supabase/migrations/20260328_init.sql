-- Supabase migration snapshot gerado manualmente em 28/03/2026
-- Este arquivo representa o estado atual do schema, para inicialização do histórico de migrations

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

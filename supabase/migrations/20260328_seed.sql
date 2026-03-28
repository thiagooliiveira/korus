-- Seed inicial para Supabase - 28/03/2026
-- Popula dados básicos para testes e validação do login

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

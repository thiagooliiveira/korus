import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import { createClient } from '@supabase/supabase-js';
import path from "path";
import { fileURLToPath } from "url";
// multer e fs removidos para produção serverless



const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

// Database initialization moved to Supabase dashboard
// All tables should be created manually in Supabase

// Round Robin Helper
async function getNextConsultant(agencyId: number) {
  const { data: consultants, error } = await supabase.from('users').select('id').eq('role', 'consultant').eq('agency_id', agencyId);
  if (error || !consultants || consultants.length === 0) return null;
  
  // Simplified: pick first consultant (for full round-robin, would need more complex query)
  return consultants[0].id;
}

async function getAuditUserId(agencyId?: number | string | null) {
  const parsedAgencyId = agencyId ? Number(agencyId) : null;

  if (parsedAgencyId) {
    const { data: supervisor, error } = await supabase.from('users').select('id').eq('agency_id', parsedAgencyId).eq('role', 'supervisor').limit(1).single();
    if (supervisor) {
      return supervisor.id;
    }
  }

  const { data: master, error } = await supabase.from('users').select('id').eq('role', 'master').order('id', { ascending: true }).limit(1).single();
  return master?.id || 1;
}

async function isFinanceModuleEnabledForAgency(agencyId?: number | string | null) {
  const parsedAgencyId = agencyId ? Number(agencyId) : null;
  if (!parsedAgencyId) return true;

  const { data: agency, error } = await supabase.from('agencies').select('modules').eq('id', parsedAgencyId).single();
  if (error || !agency) return false;

  try {
    const modules = JSON.parse(agency.modules || '{}');
    return Boolean(modules.finance);
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT);
  if (!PORT) {
    throw new Error("PORT environment variable is required");
  }

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  app.use((req, _res, next) => {
    if (req.url.startsWith('/xapi/')) {
      req.url = req.url.replace('/xapi/', '/api/');
    }
    next();
  });

  // API Routes

  // Nova rota: upload direto para Supabase Storage
  app.post("/api/upload-logo", express.json({limit: '10mb'}), async (req: any, res) => {
    try {
      // Espera receber { file: base64, filename: string, mimetype: string }
      const { file, filename, mimetype } = req.body;
      if (!file || !filename || !mimetype) {
        return res.status(400).json({ error: "Missing file, filename or mimetype" });
      }
      // Decodifica base64
      const buffer = Buffer.from(file, 'base64');
      // Upload para Supabase Storage (bucket: 'logos')
      const { data, error } = await supabase.storage.from('logos').upload(filename, buffer, {
        contentType: mimetype,
        upsert: true
      });
      if (error) return res.status(500).json({ error: error.message });
      // Gera URL pública
      const { data: publicUrl } = supabase.storage.from('logos').getPublicUrl(filename);
      res.json({ url: publicUrl.publicUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/test-db", async (req, res) => {
    try {
      const { data: users, error } = await supabase.from('users').select('email, role');
      if (error) throw error;
      res.json({ status: "ok", users });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data: user, error } = await supabase.from('users').select('*').ilike('email', email).eq('password', password).single();
      if (error || !user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/visa-types", async (req, res) => {
    const { agency_id } = req.query;
    try {
      const { data: visas, error } = await supabase.from('visa_types').select('*').eq('agency_id', agency_id);
      if (error) throw error;
      res.json(visas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // TODO: Implement /api/processes/start later

  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { data: logs, error } = await supabase.from('audit_logs').select(`
        *,
        users!left(name),
        agencies!left(name)
      `).order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      // Map to match the expected format
      const formattedLogs = logs.map(log => ({
        ...log,
        user_name: log.users?.name,
        agency_name: log.agencies?.name
      }));
      res.json(formattedLogs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/agencies", async (req, res) => {
    try {
      const { data: agencies, error } = await supabase.from('agencies').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      res.json(agencies);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/agencies/:id", async (req, res) => {
    try {
      const { data: agency, error } = await supabase.from('agencies').select('*').eq('id', req.params.id).single();
      if (error || !agency) {
        return res.status(404).json({ error: "Agência não encontrada" });
      }
      res.json(agency);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/agencies", async (req, res) => {
    console.log('Recebendo requisição para criar agência:', req.body);
    const { name, slug, has_finance, admin_name, admin_email, admin_password } = req.body;
    
    try {
      const modules = JSON.stringify({ finance: has_finance, chat: true });
      const { data: agency, error: agencyError } = await supabase.from('agencies').insert({ name, slug, modules }).select('id').single();
      if (agencyError) throw agencyError;
      const agencyId = agency.id;

      let auditUserId = await getAuditUserId(null);

      if (admin_email && admin_password) {
        const { data: adminUser, error: adminError } = await supabase.from('users').insert({
          email: admin_email,
          password: admin_password,
          name: admin_name || `Admin ${name}`,
          role: 'supervisor',
          agency_id: agencyId
        }).select('id').single();
        if (adminError) throw adminError;
        auditUserId = adminUser.id;
      }

      await supabase.from('audit_logs').insert({ agency_id: agencyId, user_id: auditUserId, action: 'agency_created', details: `Agência criada: ${name}` });

      res.json({ id: agencyId });
    } catch (e: any) {
      if (e.message && e.message.includes("duplicate key")) {
        if (e.message.includes("email")) {
          res.status(400).json({ error: "Email do administrador já cadastrado" });
        } else if (e.message.includes("slug")) {
          res.status(400).json({ error: "Slug da agência já existe" });
        } else {
          res.status(500).json({ error: "Erro ao criar agência" });
        }
      } else {
        res.status(500).json({ error: "Erro ao criar agência" });
      }
    }
  });

  app.put("/api/agencies/:id", async (req, res) => {
    console.log(`Recebendo requisição para atualizar agência ${req.params.id}:`, req.body);
    const { name, slug, has_finance } = req.body;
    const modules = JSON.stringify({ finance: has_finance, chat: true });
    try {
      const { error } = await supabase.from('agencies').update({ name, slug, modules }).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) {
      if (e.message && e.message.includes("duplicate key")) {
        res.status(400).json({ error: "Slug da agência já existe" });
      } else {
        res.status(500).json({ error: "Erro ao atualizar agência" });
      }
    }
  });

  app.delete("/api/agencies/:id", async (req, res) => {
    const agencyId = Number(req.params.id);

    if (!agencyId) {
      return res.status(400).json({ error: "ID de agência inválido" });
    }

    try {
      // Simple delete - in production, consider cascading deletes in Supabase
      const { error } = await supabase.from('agencies').delete().eq('id', agencyId);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: "Erro ao deletar agência" });
    }
  });

  app.get("/api/agencies/by-slug/:slug", async (req, res) => {
    try {
      const { data: agency, error } = await supabase.from('agencies').select('*').eq('slug', req.params.slug).single();
      if (error || !agency) {
        return res.status(404).json({ error: "Agency not found" });
      }
      res.json(agency);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/agencies/:id/settings", async (req, res) => {
    const { name, logo_url, pre_form_questions } = req.body;
    try {
      const { error } = await supabase.from('agencies').update({ name, logo_url, pre_form_questions }).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // NOTE: Rotas abaixo foram temporariamente removidas durante migração SQLite → Supabase
  // Será necessário migrar: Destinations, Plans, Forms, Passengers, Dependents, Tasks, etc.
  // Por enquanto, mantemos apenas rotas core migradas para Supabase.

  // Vite middleware for development - ONLY import in development mode
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("Failed to initialize Vite in development mode:", err);
      // Continue with static serving as fallback
      app.use(express.static(path.join(__dirname, "dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
      });
    }
  } else {
    // Production: serve static files from dist
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  return app;
}

const app = await startServer();

if (process.env.NODE_ENV !== "production") {
  app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  });
}

export default serverless(app);

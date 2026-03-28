# Supabase Migrations e Seed

Este diretório foi criado para iniciar o versionamento do schema do banco de dados via Supabase CLI.

## Como usar

1. **Sincronize o schema atual:**
   - Execute o SQL de `20260328_init.sql` no Supabase SQL Editor para garantir que o schema está igual ao do projeto.
2. **Popule dados iniciais:**
   - Execute o SQL de `20260328_seed.sql` para inserir dados de teste.
3. **Inicialize o histórico de migrations:**
   - Rode `supabase db init` e depois `supabase db commit` para criar o histórico no Supabase.
   - Ou, se já estiver usando CLI, rode `supabase db repair` para registrar o snapshot.

> **Atenção:**
> O erro `relation "supabase_migrations.schema_migrations" does not exist` ocorre porque o banco foi criado manualmente. Após rodar os comandos acima, o dashboard e CLI do Supabase passarão a gerenciar migrations normalmente.

## Próximos passos
- Use `supabase db push` para futuras alterações de schema.
- Sempre versionar novas migrations neste diretório.

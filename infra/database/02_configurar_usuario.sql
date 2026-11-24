-- Cria o usuario da aplicacao sem privilegios administrativos.
-- A senha deve ser configurada separadamente e nunca versionada.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_roles
        WHERE rolname = 'monitoramento_app'
    ) THEN
        CREATE ROLE monitoramento_app WITH LOGIN;
    END IF;
END $$;

GRANT CONNECT ON DATABASE monitoramento_academico
TO monitoramento_app;

GRANT USAGE ON SCHEMA public
TO monitoramento_app;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO monitoramento_app;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO monitoramento_app;

-- Configurar a senha manualmente pelo psql:
-- \password monitoramento_app
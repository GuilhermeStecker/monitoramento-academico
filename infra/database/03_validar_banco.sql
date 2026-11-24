-- Validacao do banco de dados apos implantacao na AWS.
-- Consultas de verificacao sem alterar os dados.

-- Verifica o banco e o usuario conectado.
SELECT current_database(), current_user;

-- Verifica a quantidade de tabelas.
-- Resultado esperado na implantacao inicial: 16.
SELECT COUNT(*) AS total_tabelas
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- Lista as tabelas existentes.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verifica os registros importados.
SELECT 'aluno' AS tabela, COUNT(*) AS total FROM aluno
UNION ALL
SELECT 'professor', COUNT(*) FROM professor
UNION ALL
SELECT 'turma', COUNT(*) FROM turma
UNION ALL
SELECT 'disciplina', COUNT(*) FROM disciplina
UNION ALL
SELECT 'usuario', COUNT(*) FROM usuario;

-- Verifica as sequencias de IDs.
SELECT sequencename, last_value
FROM pg_sequences
WHERE schemaname = 'public'
ORDER BY sequencename;

-- Verifica as permissoes do usuario da aplicacao.
SELECT table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'monitoramento_app'
AND table_schema = 'public'
ORDER BY table_name, privilege_type;
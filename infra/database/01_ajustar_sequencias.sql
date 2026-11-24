-- Ajusta as sequencias de IDs apos a importacao do banco.
-- Evita conflitos de chave primaria em novos registros.

DO $$
DECLARE
    r RECORD;
    max_id BIGINT;
BEGIN
    FOR r IN
        SELECT table_schema, table_name, column_name,
            pg_get_serial_sequence(
                format('%I.%I', table_schema, table_name),
                column_name
            ) AS seq
        FROM information_schema.columns
        WHERE table_schema = 'public'
    LOOP
        IF r.seq IS NOT NULL THEN
            EXECUTE format(
                'SELECT MAX(%I) FROM %I.%I',
                r.column_name,
                r.table_schema,
                r.table_name
            ) INTO max_id;

            PERFORM setval(
                r.seq::regclass,
                COALESCE(max_id, 1),
                max_id IS NOT NULL
            );
        END IF;
    END LOOP;
END $$;
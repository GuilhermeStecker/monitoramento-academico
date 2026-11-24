# Implantação do banco de dados na AWS

## 1. Objetivo

Disponibilizar o banco de dados do projeto Monitoramento Acadêmico em ambiente de nuvem, garantindo persistência dos dados, segurança de acesso e integração com o backend.

## 2. Infraestrutura utilizada

| Recurso | Configuração |
|---|---|
| Plataforma | Amazon Web Services |
| Ambiente | AWS Academy Learner Lab |
| Serviço de banco | Amazon RDS |
| SGBD | PostgreSQL 17.11 |
| Região | us-east-1 |
| Instância | db.t3.micro |
| Armazenamento | 20 GiB — gp3 |
| Disponibilidade | Single-AZ |
| Acesso público | Desabilitado |
| Porta | 5432 |
| Banco | monitoramento_academico |
| Instância auxiliar | Amazon EC2 |
| Sistema operacional | Amazon Linux 2023 |

## 3. Arquitetura

O banco de dados foi implantado no Amazon RDS com acesso privado. Uma instância EC2 foi utilizada para realizar a importação dos dados, executar comandos administrativos e validar a conectividade.

A arquitetura prevista para integração da aplicação é:

Frontend (Vercel) → API Backend → PostgreSQL (Amazon RDS).

O frontend não deverá acessar diretamente o banco de dados.

## 4. Procedimento de implantação

1. Criação da instância PostgreSQL no Amazon RDS.
2. Configuração dos grupos de segurança.
3. Instalação do cliente PostgreSQL na EC2.
4. Clonagem do repositório GitHub.
5. Importação do arquivo monitoramento_academico.sql.
6. Ajuste das sequências de identificadores.
7. Criação do usuário exclusivo da aplicação.
8. Configuração das permissões.
9. Validação da estrutura e dos dados importados.

## 5. Segurança

- Banco de dados sem acesso público.
- Acesso à porta 5432 restrito ao grupo de segurança autorizado.
- Conexão criptografada utilizando TLS.
- Usuário administrativo separado do usuário da aplicação.
- Permissões de leitura e escrita concedidas ao usuário da aplicação.
- Restrição do acesso SSH à instância EC2.
- Senhas não armazenadas no repositório.

## 6. Configuração para integração

O backend deverá utilizar variáveis de ambiente para armazenar as informações de conexão.

| Parâmetro | Valor |
|---|---|
| Host | Endpoint privado do Amazon RDS |
| Porta | 5432 |
| Database | monitoramento_academico |
| Usuário | monitoramento_app |
| Senha | Fornecida por canal seguro |
| SSL | Obrigatório |

Os nomes das variáveis devem corresponder à implementação do backend.

O ambiente de execução do backend deverá possuir conectividade autorizada com a rede privada do banco.

## 7. Scripts de infraestrutura

Os scripts estão organizados no diretório infra/database:

- 01_ajustar_sequencias.sql: sincronização das sequências com os identificadores existentes.
- 02_configurar_usuario.sql: criação do usuário da aplicação e concessão de permissões.
- 03_validar_banco.sql: verificação da estrutura, registros, sequências e permissões.

Os scripts administrativos devem ser executados por um usuário autorizado, após a importação inicial. A senha da aplicação deve ser configurada separadamente.

## 8. Resultados da validação

| Verificação | Resultado |
|---|---|
| Conexão com PostgreSQL | Sucesso |
| Conexão criptografada | TLS 1.3 |
| Tabelas importadas | 16 |
| Alunos cadastrados | 4 |
| Professores cadastrados | 2 |
| Turmas cadastradas | 1 |
| Disciplinas cadastradas | 2 |
| Usuários cadastrados | 6 |
| Ajuste das sequências | Executado |
| Consulta com usuário da aplicação | Sucesso |
| Permissões sobre as tabelas | 64 |

As 64 permissões correspondem às operações SELECT, INSERT, UPDATE e DELETE nas 16 tabelas.

A integração completa com o backend e os testes funcionais de escrita permanecem como etapas posteriores.

## 9. Versionamento

Branch de infraestrutura: infra/deploy-postgresql-aws.

Commits realizados:

- aaf5471 — fix(db): adiciona script de ajuste das sequencias apos importacao
- 995f4d5 — feat(db): adiciona configuracao de usuario e permissoes do backend
- 7b987c0 — test(db): adiciona script de validacao do banco na AWS

A contribuição foi enviada ao GitHub por meio de uma branch específica e submetida a Pull Request.

## 10. Recuperação do ambiente

Em caso de necessidade de reconstrução do ambiente:

1. Criar uma nova instância PostgreSQL compatível.
2. Configurar a rede e os grupos de segurança.
3. Criar o banco monitoramento_academico.
4. Importar o arquivo SQL versionado.
5. Executar os scripts administrativos de infraestrutura.
6. Configurar uma nova senha para a aplicação.
7. Executar o script de validação.
8. Atualizar as variáveis de ambiente do backend.

O arquivo SQL versionado permite recuperar o estado inicial do banco, mas não substitui backups atualizados dos dados da aplicação.

## 11. Limitações do ambiente

A infraestrutura utiliza o AWS Academy Learner Lab, estando sujeita aos limites de créditos, duração das sessões e políticas de disponibilidade dos recursos.

## 12. Conclusão

A implantação do PostgreSQL no Amazon RDS foi realizada com sucesso, incluindo importação dos dados, configuração de segurança, criação do usuário da aplicação e validação do acesso.

A infraestrutura encontra-se preparada para a próxima etapa de integração com o backend, mediante configuração da conectividade de rede.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Monitoramento Acadêmico funcionando!'
  });
});

// Listar alunos
app.get('/alunos', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT
        id_aluno,
        id_usuario,
        nome_completo,
        data_nascimento,
        data_ingresso,
        matricula_escolar
       FROM aluno
       ORDER BY id_aluno`
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar alunos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar alunos' });
  }
});

// Listar professores
app.get('/professores', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT
        id_professor,
        id_usuario,
        nome_completo,
        data_contratacao,
        formacao
       FROM professor
       ORDER BY id_professor`
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar professores:', erro);
    res.status(500).json({ erro: 'Erro ao buscar professores' });
  }
});

// Listar turmas
app.get('/turmas', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT
        id_turma,
        id_curso,
        id_periodo,
        nome_turma,
        turno
       FROM turma
       ORDER BY id_turma`
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar turmas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar turmas' });
  }
});

// Listar disciplinas
app.get('/disciplinas', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT
        id_disciplina,
        nome_disciplina,
        descricao,
        carga_horaria
       FROM disciplina
       ORDER BY id_disciplina`
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar disciplinas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar disciplinas' });
  }
});

// Listar notas dos alunos
app.get('/notas', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT
        aa.id_aluno_avaliacao,
        aa.id_aluno,
        a.nome_completo AS nome_aluno,
        aa.id_avaliacao,
        aa.nota,
        aa.observacao,
        aa.data_registro
       FROM aluno_avaliacao aa
       INNER JOIN aluno a
         ON aa.id_aluno = a.id_aluno
       ORDER BY aa.id_aluno, aa.id_avaliacao`
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar notas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar notas' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

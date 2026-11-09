
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

// Listar alunos cadastrados
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

    res.status(500).json({
      erro: 'Erro ao buscar alunos'
    });
  }
});

// Listar professores cadastrados
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

    res.status(500).json({
      erro: 'Erro ao buscar professores'
    });
  }
});

// Listar turmas cadastradas
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

    res.status(500).json({
      erro: 'Erro ao buscar turmas'
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

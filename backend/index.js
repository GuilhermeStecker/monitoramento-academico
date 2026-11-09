require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Monitoramento Acadêmico funcionando!'
  });
});

// Listar alunos cadastrados
app.get('/alunos', async (req, res) => {
  try {
const resultado = await db.query(
  'SELECT id_aluno, id_usuario, nome_completo, data_nascimento, data_ingresso, matricula_escolar FROM aluno ORDER BY id_aluno'
);

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar alunos:', erro);
    res.status(500).json({
      erro: 'Erro ao buscar alunos'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
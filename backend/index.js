
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

// Cadastrar nota de aluno
app.post('/notas', async (req, res) => {
  try {
    const { id_aluno, id_avaliacao, nota, observacao } = req.body;

    if (
      !Number.isInteger(id_aluno) ||
      id_aluno <= 0 ||
      !Number.isInteger(id_avaliacao) ||
      id_avaliacao <= 0
    ) {
      return res.status(400).json({
        erro: 'Informe IDs válidos de aluno e avaliação'
      });
    }

    if (
      typeof nota !== 'number' ||
      !Number.isFinite(nota) ||
      nota < 0
    ) {
      return res.status(400).json({
        erro: 'A nota deve ser um número maior ou igual a zero'
      });
    }

    if (
      observacao !== undefined &&
      observacao !== null &&
      typeof observacao !== 'string'
    ) {
      return res.status(400).json({
        erro: 'A observação deve ser um texto'
      });
    }

    const aluno = await db.query(
      'SELECT id_aluno FROM aluno WHERE id_aluno = $1',
      [id_aluno]
    );

    if (aluno.rowCount === 0) {
      return res.status(404).json({
        erro: 'Aluno não encontrado'
      });
    }

    const avaliacao = await db.query(
      'SELECT valor_total FROM avaliacao WHERE id_avaliacao = $1',
      [id_avaliacao]
    );

    if (avaliacao.rowCount === 0) {
      return res.status(404).json({
        erro: 'Avaliação não encontrada'
      });
    }

    const valorTotal = Number(avaliacao.rows[0].valor_total);

    if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
      return res.status(422).json({
        erro: 'A avaliação possui um valor total inválido'
      });
    }

    if (nota > valorTotal) {
      return res.status(400).json({
        erro: `A nota não pode ultrapassar ${valorTotal}`
      });
    }

    const resultado = await db.query(
      `INSERT INTO aluno_avaliacao
        (id_aluno, id_avaliacao, nota, observacao)
       VALUES ($1, $2, $3, $4)
       RETURNING
        id_aluno_avaliacao,
        id_aluno,
        id_avaliacao,
        nota,
        observacao,
        data_registro`,
      [id_aluno, id_avaliacao, nota, observacao ?? null]
    );

    return res.status(201).json({
      mensagem: 'Nota cadastrada com sucesso',
      nota: resultado.rows[0]
    });

  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({
        erro: 'Este aluno já possui nota para essa avaliação'
      });
    }

    if (erro.code === '23503') {
      return res.status(400).json({
        erro: 'Aluno ou avaliação inválidos'
      });
    }

    if (erro.code === '23514' || erro.code === '23502') {
      return res.status(400).json({
        erro: 'Os dados da nota não atendem às regras do banco'
      });
    }

    console.error('Erro ao cadastrar nota:', erro);

    return res.status(500).json({
      erro: 'Erro ao cadastrar nota'
    });
  }
});

// Listar frequência dos alunos
app.get('/frequencias', async (req, res) => {
  try {
    const resultado = await db.query(
      `SELECT
        f.id_frequencia,
        f.id_aula,
        f.id_aluno,
        a.nome_completo AS nome_aluno,
        f.presente,
        f.justificativa,
        f.data_registro
       FROM frequencia f
       INNER JOIN aluno a
         ON f.id_aluno = a.id_aluno
       ORDER BY f.id_aluno, f.id_aula`
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar frequências:', erro);
    res.status(500).json({ erro: 'Erro ao buscar frequências' });
  }
});

// Indicadores acadêmicos por aluno
app.get('/indicadores/alunos', async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT
        a.id_aluno,
        a.nome_completo AS nome_aluno,

        (
          SELECT ROUND(
            SUM(
              (aa.nota / NULLIF(av.valor_total, 0))
              * 10 * av.peso
            ) / NULLIF(SUM(av.peso), 0),
            2
          )
          FROM aluno_avaliacao aa
          INNER JOIN avaliacao av
            ON aa.id_avaliacao = av.id_avaliacao
          WHERE aa.id_aluno = a.id_aluno
        ) AS media_notas,

        (
          SELECT ROUND(
            COUNT(*) FILTER (WHERE f.presente = true)
            * 100.0 / NULLIF(COUNT(*), 0),
            2
          )
          FROM frequencia f
          WHERE f.id_aluno = a.id_aluno
        ) AS percentual_frequencia

      FROM aluno a
      ORDER BY a.id_aluno
    `);

    const indicadores = resultado.rows.map((aluno) => {
      const media = aluno.media_notas === null
        ? null
        : Number(aluno.media_notas);

      const frequencia = aluno.percentual_frequencia === null
        ? null
        : Number(aluno.percentual_frequencia);

      return {
        id_aluno: aluno.id_aluno,
        nome_aluno: aluno.nome_aluno,
        media_notas: media,
        percentual_frequencia: frequencia,
        alerta_frequencia: frequencia === null
          ? null
          : frequencia < 75
      };
    });

    res.json(indicadores);
  } catch (erro) {
    console.error('Erro ao calcular indicadores:', erro);

    res.status(500).json({
      erro: 'Erro ao calcular indicadores acadêmicos'
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

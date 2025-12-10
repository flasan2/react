const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3001;

// middlewares
app.use(cors());
app.use(express.json());

/////////////////////////////TESTE  DE CONEXÃO//////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.send('API funcionando!');
});


///////////////////////////////////////POST/////////////////////////////////////////////////////////////////
// Rota para receber dados do formulário
app.post('/api/clientes', async (req, res) => {
  const { nome, cpf, telefone, email } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO clientes (nome, cpf, telefone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, cpf, telefone, email]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir cliente:', error);
    return res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
});



//////////////////////////////////////////////////GET///////////////////////////////////////////////////////////
// Rota para listar todos os clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes ORDER BY id DESC'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});



/////////////////////////////////////////EDITAR/////////////////////////////////////////////////////////////////////////
app.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, email } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'UPDATE clientes SET nome = $1, cpf = $2, telefone = $3, email = $4 WHERE id = $5 RETURNING *',
      [nome, cpf, telefone, email,id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

//////////////////////////////////////////DELETE//////////////////////////////////////////////////////////////////////
app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM clientes WHERE id = $1',
      [id]
    );

    // rowCount diz quantas linhas foram afetadas
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.status(204).send(); // 204 = sem conteúdo, deu certo
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

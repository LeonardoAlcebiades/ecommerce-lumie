const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DO BANCO (Ajuste com suas credenciais do pgAdmin)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lumie_db', // NOME DO SEU BANCO NO PGADMIN
  password: 'SUA_SENHA_AQUI',
  port: 5432,
});

// ==========================================
// ROTA: PRODUTOS (VITRINE DINÂMICA)
// ==========================================
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await pool.query('SELECT * FROM produtos ORDER BY id ASC');
    res.json(produtos.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ROTAS DO CHATBOT (ANTERIORES)
// ==========================================
app.get('/api/chat/historico', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM mensagens_chat ORDER BY data_criacao ASC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/chat/enviar', async (req, res) => {
  const { mensagem } = req.body;
  try {
    await pool.query('INSERT INTO mensagens_chat (mensagem, remetente) VALUES ($1, $2)', [mensagem, 'user']);
    const respostaBot = "Obrigado por contatar a Lumie! Como posso ajudar?";
    await pool.query('INSERT INTO mensagens_chat (mensagem, remetente) VALUES ($1, $2)', [respostaBot, 'bot']);
    res.json({ resposta: respostaBot });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ==========================================
// ROTAS DE CLIENTES (ANTERIORES)
// ==========================================
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
    res.json(clientes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clientes', async (req, res) => {
  const { nome, email, cpf, telefone } = req.body;
  try {
    const novo = await pool.query(
      'INSERT INTO clientes (nome, email, cpf, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, cpf, telefone]
    );
    res.json(novo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar cliente." });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clientes WHERE id = $1', [req.params.id]);
    res.json({ message: "Excluído." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Servidor Lumie rodando em http://localhost:${PORT}`));
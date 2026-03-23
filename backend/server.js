const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS
const clientesRoutes = require('./routes/clientes');
app.use('/clientes', clientesRoutes);

// TESTE
app.get('/teste', async (req, res) => {
  const result = await db.query('SELECT * FROM clientes');
  res.json(result.rows);
});

// INICIAR SERVIDOR (SEMPRE POR ÚLTIMO)
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});

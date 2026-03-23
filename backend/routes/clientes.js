const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE
router.post('/', async (req, res) => {
  const { nome, email, telefone } = req.body;

  const result = await db.query(
    'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, telefone]
  );

  res.json(result.rows[0]);
});

// READ
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM clientes');
  res.json(result.rows);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  const result = await db.query(
    'UPDATE clientes SET nome=$1, email=$2, telefone=$3 WHERE id=$4 RETURNING *',
    [nome, email, telefone, id]
  );

  res.json(result.rows[0]);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await db.query('DELETE FROM clientes WHERE id=$1', [id]);

  res.json({ message: 'Cliente deletado' });
});

module.exports = router;

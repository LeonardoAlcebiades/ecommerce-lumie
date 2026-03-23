const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '226112',
  port: 5432,
});

module.exports = pool;

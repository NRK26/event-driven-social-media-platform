const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log(' Postgres connected');
  } catch (err) {
    console.error(' Postgres connection failed:', err);
  }
};

module.exports = {
  pool,
  connectDB,
};
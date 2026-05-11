const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Perfect for Neon
  }
});

if (process.env.NODE_ENV !== 'test') {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Database connection failed:', err.stack);
    } else {
      console.log('✅ PostgreSQL Database Connected Successfully');
      release(); // Gives the connection back to the pool
    }
  });
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
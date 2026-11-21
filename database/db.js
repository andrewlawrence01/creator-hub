
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

pool.on('error', (error) => {
    console.error('Unexpected PostgreSQL error:', {
        message: error.message,
        code: error.code
    });
});

export default pool;
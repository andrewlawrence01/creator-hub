import 'dotenv/config';
import express from 'express';
import pool from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.send('Welcome to CreatorHub!');
});

// Test PostgreSQL connection
app.get('/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS current_time');

        res.status(200).json({
            status: 'success',
            message: 'CreatorHub is connected to PostgreSQL!',
            databaseTime: result.rows[0].current_time
        });
    } catch (error) {
    console.error('POSTGRESQL CONNECTION DIAGNOSTICS:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        severity: error.severity
    });

    res.status(500).json({
        status: 'error',
        message: 'Unable to connect to the database.'
    });
}
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorHub is running on port ${PORT}`);
});
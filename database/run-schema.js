import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import pool from './db.js';

async function runSchema() {
    try {
        const schema = await readFile(
            new URL('./schema.sql', import.meta.url),
            'utf8'
        );

        await pool.query(schema);

        console.log('CreatorHub database schema created successfully!');
    } catch (error) {
        console.error('Database schema error:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

runSchema();
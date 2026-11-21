
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import pool from './db.js';

async function runContentSchema() {
    try {
        const schema = await readFile(
            new URL('./content-schema.sql', import.meta.url),
            'utf8'
        );

        await pool.query(schema);

        console.log(
            'CreatorHub content management tables created successfully!'
        );
    } catch (error) {
        console.error('Content schema error:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

runContentSchema();
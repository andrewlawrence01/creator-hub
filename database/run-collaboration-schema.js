import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import pool from './db.js';

async function runCollaborationSchema() {
    try {
        const schema = await readFile(
            new URL('./collaboration-schema.sql', import.meta.url),
            'utf8'
        );

        await pool.query(schema);

        console.log(
            'CreatorHub collaboration tables created successfully!'
        );
    } catch (error) {
        console.error('Collaboration schema error:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

runCollaborationSchema();
import 'dotenv/config';
import pool from './db.js';

async function fixConstraint() {
    try {
        await pool.query(`
            ALTER TABLE content_items
            ADD CONSTRAINT uq_content_items_workspace
            UNIQUE (content_id, workspace_id);
        `);

        console.log('Content item constraint added successfully!');
    } catch (error) {
        console.error('Constraint update failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

fixConstraint();
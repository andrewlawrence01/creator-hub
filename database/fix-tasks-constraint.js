import 'dotenv/config';
import pool from './db.js';

async function fixTasksConstraint() {
    try {
        await pool.query(`
            ALTER TABLE tasks
            ADD CONSTRAINT uq_tasks_workspace
            UNIQUE (task_id, workspace_id);
        `);

        console.log('Tasks workspace constraint added successfully!');

        const result = await pool.query(`
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = 'tasks'
              AND constraint_type = 'UNIQUE';
        `);

        console.table(result.rows);

    } catch (error) {
        console.error('Tasks constraint error:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

fixTasksConstraint();
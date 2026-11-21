import pool from './db.js';

async function verifySchema() {
    try {
        const result = await pool.query(
            `SELECT table_name
             FROM information_schema.tables
             WHERE table_schema = 'public'
             ORDER BY table_name`
        );

        console.log('\nCreatorHub Database Tables:');
        console.table(result.rows);

        console.log(`Total tables found: ${result.rowCount}`);
    } catch (error) {
        console.error('Verification failed:', error.message);
    } finally {
        await pool.end();
    }
}

verifySchema();
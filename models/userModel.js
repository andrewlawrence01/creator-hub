import pool from '../database/db.js';

// Find a user by email address
async function getUserByEmail(email) {
    const result = await pool.query(
        `SELECT
            user_id,
            first_name,
            last_name,
            email,
            password_hash,
            global_role
         FROM users
         WHERE email = $1`,
        [email.toLowerCase()]
    );

    return result.rows[0];
}

// Create a new user and personal workspace
async function createUser(firstName, lastName, email, passwordHash) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Create the user account
        const userResult = await client.query(
            `INSERT INTO users (
                first_name,
                last_name,
                email,
                password_hash
            )
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, first_name, last_name, email, global_role`,
            [firstName, lastName, email.toLowerCase(), passwordHash]
        );

        const user = userResult.rows[0];

        // Create the user's personal workspace
        const workspaceResult = await client.query(
            `INSERT INTO workspaces (
                workspace_name,
                workspace_type
            )
            VALUES ($1, 'personal')
            RETURNING workspace_id`,
            [`${firstName}'s Workspace`]
        );

        const workspaceId = workspaceResult.rows[0].workspace_id;

        // Make the user the owner of their workspace
        await client.query(
            `INSERT INTO workspace_members (
                workspace_id,
                user_id,
                workspace_role
            )
            VALUES ($1, $2, 'owner')`,
            [workspaceId, user.user_id]
        );

        await client.query('COMMIT');

        return user;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export default {
    getUserByEmail,
    createUser
};
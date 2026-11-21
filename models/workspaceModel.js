
import pool from '../database/db.js';

// Get all workspaces belonging to a user
async function getWorkspacesByUser(userId) {
    const result = await pool.query(
        `SELECT
            w.workspace_id,
            w.workspace_name,
            w.workspace_type,
            w.organization_id,
            o.organization_name,
            wm.workspace_role
         FROM workspace_members wm
         INNER JOIN workspaces w
            ON wm.workspace_id = w.workspace_id
         LEFT JOIN organizations o
            ON w.organization_id = o.organization_id
         WHERE wm.user_id = $1
         ORDER BY w.workspace_id ASC`,
        [userId]
    );

    return result.rows;
}

// Create a new workspace
async function createWorkspace(userId, workspaceName, workspaceType) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let organizationId = null;

        // Create an organization when requested
        if (workspaceType === 'organization') {
            const organizationResult = await client.query(
                `INSERT INTO organizations (
                    organization_name,
                    created_by
                )
                VALUES ($1, $2)
                RETURNING organization_id`,
                [workspaceName, userId]
            );

            organizationId = organizationResult.rows[0].organization_id;
        }

        // Create the workspace
        const workspaceResult = await client.query(
            `INSERT INTO workspaces (
                organization_id,
                workspace_name,
                workspace_type
            )
            VALUES ($1, $2, $3)
            RETURNING workspace_id`,
            [organizationId, workspaceName, workspaceType]
        );

        const workspaceId = workspaceResult.rows[0].workspace_id;

        // Make the creator the workspace owner
        await client.query(
            `INSERT INTO workspace_members (
                workspace_id,
                user_id,
                workspace_role
            )
            VALUES ($1, $2, 'owner')`,
            [workspaceId, userId]
        );

        await client.query('COMMIT');

        return {
            workspace_id: workspaceId,
            workspace_name: workspaceName,
            workspace_type: workspaceType
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
}

export default {
    getWorkspacesByUser,
    createWorkspace
};
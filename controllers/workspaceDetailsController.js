import workspaceModel from '../models/workspaceModel.js';

// Display workspace details
async function showWorkspaceDetails(req, res) {
    const workspaceId = Number(req.params.workspaceId);
    const userId = req.session.user.user_id;

    // Validate workspace ID
    if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
        return res.status(400).send('Invalid workspace ID.');
    }

    try {
        // Retrieve workspace only if the user is a member
        const workspace = await workspaceModel.getWorkspaceById(
            workspaceId,
            userId
        );

        // Prevent unauthorized workspace access
        if (!workspace) {
            return res.status(404).send('Workspace not found.');
        }

        res.render('workspaces/details', {
            user: req.session.user,
            workspace
        });

    } catch (error) {
        console.error('Workspace details error:', error.message);

        res.status(500).send(
            'Unable to load workspace details. Please try again.'
        );
    }
}

export default {
    showWorkspaceDetails
};
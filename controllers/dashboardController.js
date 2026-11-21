import workspaceModel from '../models/workspaceModel.js';

// Display user dashboard
async function showDashboard(req, res) {
    try {
        const user = req.session.user;

        // Retrieve the user's workspaces
        const workspaces = await workspaceModel.getWorkspacesByUser(
            user.user_id
        );

        res.render('dashboard', {
            user,
            workspaces
        });

    } catch (error) {
        console.error('Dashboard error:', error.message);

        res.status(500).send(
            'Unable to load your dashboard. Please try again.'
        );
    }
}

export default {
    showDashboard
};
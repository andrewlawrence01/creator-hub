import { validationResult } from 'express-validator';
import workspaceModel from '../models/workspaceModel.js';

// Display workspace creation page
function showCreateWorkspace(req, res) {
    res.render('workspaces/create', {
        errors: [],
        formData: {}
    });
}

// Process workspace creation
async function createWorkspace(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('workspaces/create', {
            errors: errors.array(),
            formData: req.body
        });
    }

    const { workspace_name, workspace_type } = req.body;

    try {
        await workspaceModel.createWorkspace(
            req.session.user.user_id,
            workspace_name.trim(),
            workspace_type
        );

        return res.redirect('/dashboard?workspace=created');

    } catch (error) {
        console.error('Workspace creation error:', error.message);

        return res.status(500).render('workspaces/create', {
            errors: [
                { msg: 'Unable to create your workspace. Please try again.' }
            ],
            formData: req.body
        });
    }
}

export default {
    showCreateWorkspace,
    createWorkspace
};
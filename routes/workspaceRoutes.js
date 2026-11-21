import express from 'express';
import { body } from 'express-validator';

import workspaceController from '../controllers/workspaceController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Require authentication for all workspace routes
router.use(requireAuth);

// Display workspace creation page
router.get(
    '/create',
    workspaceController.showCreateWorkspace
);

// Validate workspace creation
const workspaceValidation = [
    body('workspace_name')
        .trim()
        .notEmpty()
        .withMessage('Workspace name is required.')
        .isLength({ max: 100 })
        .withMessage('Workspace name cannot exceed 100 characters.'),

    body('workspace_type')
        .isIn(['personal', 'organization'])
        .withMessage('Please select a valid workspace type.')
];

// Process workspace creation
router.post(
    '/create',
    workspaceValidation,
    workspaceController.createWorkspace
);

export default router;
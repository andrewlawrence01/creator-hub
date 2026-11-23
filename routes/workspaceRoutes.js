import express from 'express';
import { body } from 'express-validator';

import workspaceController from '../controllers/workspaceController.js';
import workspaceDetailsController from '../controllers/workspaceDetailsController.js';

import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// All workspace routes require authentication
router.use(requireAuth);

// Display workspace creation page
router.get('/create', workspaceController.showCreateWorkspace);

// Validate workspace creation form
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

// Create a workspace
router.post(
    '/create',
    workspaceValidation,
    workspaceController.createWorkspace
);

// Display individual workspace details
router.get(
    '/:workspaceId',
    workspaceDetailsController.showWorkspaceDetails
);

export default router;
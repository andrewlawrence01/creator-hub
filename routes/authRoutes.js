import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import sessionController from '../controllers/sessionController.js';

const router = express.Router();

// Registration validation rules
const registrationValidation = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required.')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters.'),

    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required.')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters.'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email address is too long.'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must contain at least 8 characters.')
];

// Login validation rules
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
];

// Registration routes
router.get('/register', authController.showRegister);

router.post(
    '/register',
    registrationValidation,
    authController.registerUser
);

// Login routes
router.get('/login', sessionController.showLogin);

router.post(
    '/login',
    loginValidation,
    sessionController.loginUser
);

// Logout route
router.post('/logout', sessionController.logoutUser);

export default router;
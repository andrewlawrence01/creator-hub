import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../models/userModel.js';

// Display registration page
function showRegister(req, res) {
    res.render('auth/register', {
        errors: [],
        formData: {}
    });
}

// Process new user registration
async function registerUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('auth/register', {
            errors: errors.array(),
            formData: req.body
        });
    }

    const { first_name, last_name, email, password } = req.body;

    try {
        // Check whether the email is already registered
        const existingUser = await userModel.getUserByEmail(email);

        if (existingUser) {
            return res.status(409).render('auth/register', {
                errors: [{ msg: 'An account with this email already exists.' }],
                formData: req.body
            });
        }

        // Securely hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create the user account and personal workspace
        await userModel.createUser(
            first_name.trim(),
            last_name.trim(),
            email.trim(),
            passwordHash
        );

        // Redirect to login after successful registration
        return res.redirect('/auth/login');

    } catch (error) {
        console.error('Registration error:', error.message);

        return res.status(500).render('auth/register', {
            errors: [{ msg: 'Something went wrong while creating your account.' }],
            formData: req.body
        });
    }
}

export default {
    showRegister,
    registerUser
};
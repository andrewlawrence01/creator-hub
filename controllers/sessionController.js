import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../models/userModel.js';

// Display login page
function showLogin(req, res) {
    res.render('auth/login', {
        errors: [],
        formData: {}
    });
}

// Process user login
async function loginUser(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('auth/login', {
            errors: errors.array(),
            formData: req.body
        });
    }

    const { email, password } = req.body;

    try {
        // Find the account
        const user = await userModel.getUserByEmail(email);

        // Verify account and password
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).render('auth/login', {
                errors: [
                    { msg: 'Invalid email address or password.' }
                ],
                formData: { email }
            });
        }

        // Regenerate session to prevent session fixation
        await new Promise((resolve, reject) => {
            req.session.regenerate(error => {
                if (error) reject(error);
                else resolve();
            });
        });

        // Store authenticated user information
        req.session.user = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            global_role: user.global_role
        };

        // Save session before redirecting
        await new Promise((resolve, reject) => {
            req.session.save(error => {
                if (error) reject(error);
                else resolve();
            });
        });

        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).render('auth/login', {
            errors: [
                { msg: 'Something went wrong while signing you in.' }
            ],
            formData: { email }
        });
    }
}

// Log out user
async function logoutUser(req, res) {
    try {
        await new Promise((resolve, reject) => {
            req.session.destroy(error => {
                if (error) reject(error);
                else resolve();
            });
        });

        res.clearCookie('creatorhub.sid');
        return res.redirect('/auth/login');

    } catch (error) {
        console.error('Logout error:', error.message);
        return res.status(500).send('Unable to log out. Please try again.');
    }
}

export default {
    showLogin,
    loginUser,
    logoutUser
};
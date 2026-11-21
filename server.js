import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import pool from './database/db.js';

import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';

import requireAuth from './middleware/requireAuth.js';
import dashboardController from './controllers/dashboardController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Trust Render's reverse proxy in production
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// EJS configuration
app.set('view engine', 'ejs');
app.set('views', './views');

// PostgreSQL session store
const PgSession = connectPgSimple(session);

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required.');
}

app.use(session({
    name: 'creatorhub.sid',
    store: new PgSession({
        pool,
        tableName: 'user_sessions',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

// Authentication routes
app.use('/auth', authRoutes);

// Workspace routes
app.use('/workspaces', workspaceRoutes);

// Automatically redirect visitors
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    return res.redirect('/auth/login');
});

// Protected dashboard
app.get(
    '/dashboard',
    requireAuth,
    dashboardController.showDashboard
);

// PostgreSQL connection health check
app.get('/health/db', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT NOW() AS current_time'
        );

        res.status(200).json({
            status: 'success',
            message: 'CreatorHub is connected to PostgreSQL!',
            databaseTime: result.rows[0].current_time
        });

    } catch (error) {
        console.error('POSTGRESQL CONNECTION DIAGNOSTICS:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            severity: error.severity
        });

        res.status(500).json({
            status: 'error',
            message: 'Unable to connect to the database.'
        });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorHub is running on port ${PORT}`);
});
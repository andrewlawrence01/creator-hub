-- =========================================
-- CREATORHUB DATABASE SCHEMA
-- Stage 1: Users and Workspaces
-- =========================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    global_role VARCHAR(30) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WORKSPACES
CREATE TABLE IF NOT EXISTS workspaces (
    workspace_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(organization_id)
        ON DELETE CASCADE,
    workspace_name VARCHAR(150) NOT NULL,
    workspace_type VARCHAR(30) NOT NULL DEFAULT 'personal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS workspace_members (
    membership_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(workspace_id)
        ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id)
        ON DELETE CASCADE,
    workspace_role VARCHAR(30) NOT NULL DEFAULT 'viewer',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workspace_id, user_id)
);
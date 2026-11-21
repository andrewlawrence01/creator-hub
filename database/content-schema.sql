-- =========================================
-- CREATORHUB DATABASE SCHEMA
-- Stage 2: Projects and Content
-- =========================================

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL
        REFERENCES workspaces(workspace_id)
        ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL,
    description TEXT,
    project_status VARCHAR(30) NOT NULL DEFAULT 'planning'
        CHECK (project_status IN (
            'planning',
            'active',
            'on_hold',
            'completed',
            'archived'
        )),
    start_date DATE,
    target_date DATE,
    created_by INTEGER NOT NULL
        REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (project_id, workspace_id)
);

-- CONTENT ITEMS
CREATE TABLE IF NOT EXISTS content_items (
    content_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL
        REFERENCES workspaces(workspace_id)
        ON DELETE CASCADE,
    project_id INTEGER,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(30) NOT NULL
        CHECK (content_type IN (
            'video',
            'short_video',
            'social_post',
            'podcast',
            'article',
            'blog',
            'other'
        )),
    content_status VARCHAR(30) NOT NULL DEFAULT 'idea'
        CHECK (content_status IN (
            'idea',
            'draft',
            'in_progress',
            'review',
            'approved',
            'scheduled',
            'published',
            'archived'
        )),
    due_date DATE,
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    created_by INTEGER NOT NULL
        REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id, workspace_id)
        REFERENCES projects(project_id, workspace_id)
        ON DELETE SET NULL (project_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_workspace
    ON projects(workspace_id);

CREATE INDEX IF NOT EXISTS idx_content_workspace
    ON content_items(workspace_id);

CREATE INDEX IF NOT EXISTS idx_content_project
    ON content_items(project_id);

CREATE INDEX IF NOT EXISTS idx_content_status
    ON content_items(content_status);
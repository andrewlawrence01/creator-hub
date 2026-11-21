-- =========================================
-- CREATORHUB DATABASE SCHEMA
-- Stage 3: Tasks, Comments, and Collaboration
-- =========================================

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL
        REFERENCES workspaces(workspace_id)
        ON DELETE CASCADE,
    project_id INTEGER,
    content_id INTEGER,
    assigned_to INTEGER
        REFERENCES users(user_id)
        ON DELETE SET NULL,
    task_title VARCHAR(200) NOT NULL,
    description TEXT,
    task_status VARCHAR(30) NOT NULL DEFAULT 'todo'
        CHECK (task_status IN (
            'todo',
            'in_progress',
            'review',
            'completed',
            'blocked'
        )),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    created_by INTEGER NOT NULL
        REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id, workspace_id)
        REFERENCES projects(project_id, workspace_id),

    FOREIGN KEY (content_id, workspace_id)
        REFERENCES content_items(content_id, workspace_id),

    CHECK (project_id IS NOT NULL OR content_id IS NOT NULL),
    
    UNIQUE (task_id, workspace_id)
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL
        REFERENCES workspaces(workspace_id)
        ON DELETE CASCADE,
    project_id INTEGER,
    content_id INTEGER,
    task_id INTEGER,
    user_id INTEGER NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id, workspace_id)
        REFERENCES projects(project_id, workspace_id),

    FOREIGN KEY (content_id, workspace_id)
        REFERENCES content_items(content_id, workspace_id),

    FOREIGN KEY (task_id, workspace_id)
        REFERENCES tasks(task_id, workspace_id),

    CHECK (
        project_id IS NOT NULL
        OR content_id IS NOT NULL
        OR task_id IS NOT NULL
    )
);

-- CONTENT HISTORY
CREATE TABLE IF NOT EXISTS content_history (
    history_id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL
        REFERENCES content_items(content_id)
        ON DELETE CASCADE,
    changed_by INTEGER NOT NULL
        REFERENCES users(user_id),
    change_description TEXT NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTENT PLATFORMS
CREATE TABLE IF NOT EXISTS content_platforms (
    platform_id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL
        REFERENCES content_items(content_id)
        ON DELETE CASCADE,
    platform_name VARCHAR(50) NOT NULL,
    platform_url VARCHAR(500),
    publishing_status VARCHAR(30) NOT NULL DEFAULT 'planned'
        CHECK (publishing_status IN (
            'planned',
            'scheduled',
            'published',
            'failed'
        )),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (content_id, platform_name)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_workspace
    ON tasks(workspace_id);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned
    ON tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_comments_workspace
    ON comments(workspace_id);

CREATE INDEX IF NOT EXISTS idx_history_content
    ON content_history(content_id);

CREATE INDEX IF NOT EXISTS idx_platforms_content
    ON content_platforms(content_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_tasks_workspace'
    ) THEN
        ALTER TABLE tasks
        ADD CONSTRAINT uq_tasks_workspace
        UNIQUE (task_id, workspace_id);
    END IF;
END $$;
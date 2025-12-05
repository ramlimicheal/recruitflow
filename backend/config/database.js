const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'recruitflow',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Database connected:', res.rows[0]);
    }
});

// Create tables
const createTablesSQL = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Recruiter',
    team_id INTEGER,
    avatar_url TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Clients table
  CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    health_score INTEGER DEFAULT 50,
    status VARCHAR(50) DEFAULT 'Active',
    last_contact TIMESTAMP,
    open_positions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    logo_url TEXT,
    account_manager_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Candidates table
  CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(255) NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    stage VARCHAR(100) NOT NULL,
    days_in_stage INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_url TEXT,
    expected_salary DECIMAL(12, 2),
    estimated_fee DECIMAL(12, 2),
    probability INTEGER DEFAULT 50,
    tags TEXT[],
    owner_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Stage history
  CREATE TABLE IF NOT EXISTS stage_history (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    previous_stage VARCHAR(100),
    new_stage VARCHAR(100),
    notes TEXT,
    moved_by_id INTEGER REFERENCES users(id),
    moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tasks table
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    due_date DATE,
    candidate_id INTEGER REFERENCES candidates(id),
    client_id INTEGER REFERENCES clients(id),
    task_type VARCHAR(50),
    assigned_to_id INTEGER REFERENCES users(id),
    created_by_id INTEGER REFERENCES users(id),
    is_auto_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Interviews table
  CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    candidate_name VARCHAR(255),
    client_name VARCHAR(255),
    role VARCHAR(255),
    interview_date TIMESTAMP,
    interview_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    feedback_score DECIMAL(3, 1),
    feedback_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Chat channels
  CREATE TABLE IF NOT EXISTS chat_channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel_type VARCHAR(50) DEFAULT 'team',
    created_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Chat messages
  CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id),
    message_text TEXT NOT NULL,
    mentions TEXT[],
    attachments TEXT[],
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Activity log
  CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    performed_by_id INTEGER REFERENCES users(id),
    changes JSONB,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Notifications
  CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(100),
    related_entity_type VARCHAR(100),
    related_entity_id INTEGER,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Automation rules
  CREATE TABLE IF NOT EXISTS automation_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(100),
    condition_value INTEGER,
    action VARCHAR(100),
    task_title VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Indexes
  CREATE INDEX IF NOT EXISTS idx_candidates_owner ON candidates(owner_id);
  CREATE INDEX IF NOT EXISTS idx_candidates_stage ON candidates(stage);
  CREATE INDEX IF NOT EXISTS idx_candidates_client ON candidates(client_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel_id);
  CREATE INDEX IF NOT EXISTS idx_activities_performed_by ON activities(performed_by_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
`;

// Initialize database
const initializeDatabase = async () => {
    try {
        await pool.query(createTablesSQL);
        console.log('Database tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

// Call on start
initializeDatabase();

module.exports = pool;
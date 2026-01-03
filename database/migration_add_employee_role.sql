-- Migration to add employee_id and role fields to users table
-- Run this SQL in your database to update the existing schema

-- Add employee_id column (nullable initially)
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id TEXT;

-- Add role column with default value
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Employee';

-- Add unique constraint to employee_id (after adding the column)
ALTER TABLE users ADD CONSTRAINT users_employee_id_unique UNIQUE (employee_id);

-- Update existing users to have Employee role if not set
UPDATE users SET role = 'Employee' WHERE role IS NULL OR role = '';

-- Optional: Create an admin user (update with your details)
-- INSERT INTO users (employee_id, email, password_hash, role) 
-- VALUES ('ADMIN001', 'admin@company.com', 'your_hashed_password_here', 'Admin')
-- ON CONFLICT (email) DO NOTHING;
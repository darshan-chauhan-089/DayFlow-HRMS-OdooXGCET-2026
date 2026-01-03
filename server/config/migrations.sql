-- Migration to add missing fields to tables

-- Add avatar field to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);

-- Add new profile sections
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS what_i_love_about_my_job TEXT,
ADD COLUMN IF NOT EXISTS interests_and_hobbies TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT;


-- Verify users table has company fields (should already exist)
-- If not, uncomment and run these:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS company_logo VARCHAR(500);

-- Create uploads directory structure record (optional tracking)
CREATE TABLE IF NOT EXISTS uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('logo', 'avatar', 'document') NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

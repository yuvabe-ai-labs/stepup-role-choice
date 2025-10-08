-- Add image_url column to courses table for storing course images
ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add index for better query performance on filters
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_status_created ON courses(status, created_at DESC);

-- Add industry column to units table for filtering
ALTER TABLE units ADD COLUMN IF NOT EXISTS industry TEXT;
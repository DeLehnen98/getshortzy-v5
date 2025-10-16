-- Database Migration for Phase 4: Clip Generation
-- Run this SQL on your production database (Neon)

-- Add new fields to Project table
ALTER TABLE "Project" 
ADD COLUMN IF NOT EXISTS "analyzedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "metadata" JSONB;

-- Add new fields to Clip table
ALTER TABLE "Clip"
ADD COLUMN IF NOT EXISTS "startTime" INTEGER,
ADD COLUMN IF NOT EXISTS "endTime" INTEGER,
ADD COLUMN IF NOT EXISTS "fileSize" INTEGER,
ADD COLUMN IF NOT EXISTS "processedAt" TIMESTAMP(3);

-- Update existing clips to have default values (optional)
UPDATE "Clip" SET "startTime" = 0 WHERE "startTime" IS NULL;
UPDATE "Clip" SET "endTime" = "duration" WHERE "endTime" IS NULL;

-- Create indexes for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS "Clip_startTime_idx" ON "Clip"("startTime");
CREATE INDEX IF NOT EXISTS "Clip_endTime_idx" ON "Clip"("endTime");
CREATE INDEX IF NOT EXISTS "Clip_processedAt_idx" ON "Clip"("processedAt");
CREATE INDEX IF NOT EXISTS "Project_analyzedAt_idx" ON "Project"("analyzedAt");

-- Verify migration
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Clip' 
    AND column_name IN ('startTime', 'endTime', 'fileSize', 'processedAt')
ORDER BY column_name;

SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Project' 
    AND column_name IN ('analyzedAt', 'metadata')
ORDER BY column_name;


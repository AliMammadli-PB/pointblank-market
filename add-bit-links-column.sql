-- Add bitDownloadLinks column to Settings table
-- This will store versioned download links as JSON: { "v1": "link1", "v2": "link2" }

-- Add column to Settings table
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "bitDownloadLinks" JSONB DEFAULT '{}'::jsonb;

-- Add comment
COMMENT ON COLUMN "Settings"."bitDownloadLinks" IS 'Versioned download links for Bit/PBAZGOLD as JSON object';


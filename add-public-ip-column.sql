-- Add public_ip column to hackusers table
ALTER TABLE "hackusers" ADD COLUMN IF NOT EXISTS "public_ip" TEXT;


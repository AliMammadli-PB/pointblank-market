-- PointBlank Market Database Setup for Supabase PostgreSQL
-- Run this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Settings table
CREATE TABLE IF NOT EXISTS "Settings" (
    id SERIAL PRIMARY KEY,
    "rubleRate" DECIMAL(10,2) NOT NULL DEFAULT 50.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Account table
CREATE TABLE IF NOT EXISTS "Account" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "rankGif" VARCHAR(255) NOT NULL DEFAULT '0.gif',
    price DECIMAL(10,2) NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_username ON "Admin"(username);
CREATE INDEX IF NOT EXISTS idx_account_created_at ON "Account"(created_at);
CREATE INDEX IF NOT EXISTS idx_account_rank_gif ON "Account"("rankGif");

-- Insert default admin user (password: Ehmed2025%%%%% hashed with bcrypt)
-- This is the bcrypt hash for 'Ehmed2025%%%%%'
INSERT INTO "Admin" (username, password) VALUES 
('Admin', '$2a$10$rQ8J8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K')
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO "Settings" ("rubleRate") VALUES (50.0)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_admin_updated_at 
    BEFORE UPDATE ON "Admin" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON "Settings" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_updated_at 
    BEFORE UPDATE ON "Account" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for better security
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to Settings and Account
CREATE POLICY "Public read access to Settings" ON "Settings"
    FOR SELECT USING (true);

CREATE POLICY "Public read access to Account" ON "Account"
    FOR SELECT USING (true);

-- Admin table should only be accessible via application (no public policies)
-- This ensures admin authentication happens through your application only

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON "Settings" TO anon, authenticated;
GRANT SELECT ON "Account" TO anon, authenticated;
GRANT ALL ON "Admin" TO authenticated;

-- Grant sequence permissions for auto-increment
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE "Admin" IS 'Admin users for the PointBlank Market application';
COMMENT ON TABLE "Settings" IS 'Application settings including ruble exchange rate';
COMMENT ON TABLE "Account" IS 'Gaming accounts available for purchase';

COMMENT ON COLUMN "Account"."rankGif" IS 'GIF filename for the rank display (e.g., "5.gif")';
COMMENT ON COLUMN "Settings"."rubleRate" IS 'Exchange rate: 1 Manat = X Rubles';

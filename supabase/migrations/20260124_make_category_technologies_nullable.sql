-- Migration: make category and technologies nullable on projects table
-- Generated: 2026-01-24

ALTER TABLE projects
    ALTER COLUMN category DROP NOT NULL;

-- Ensure role is nullable (no-op if already nullable)
ALTER TABLE projects
    ALTER COLUMN role DROP NOT NULL;

-- Allow technologies to be NULL (remove default and drop not null if present)
ALTER TABLE projects
    ALTER COLUMN technologies DROP DEFAULT;
ALTER TABLE projects
    ALTER COLUMN technologies DROP NOT NULL;

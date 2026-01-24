-- Migration: make outcome nullable on projects table
-- Generated: 2026-01-24

ALTER TABLE projects
    ALTER COLUMN outcome DROP NOT NULL;

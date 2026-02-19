-- Phase 10.1: Daily.co Video Integration
-- Adds videoRoomUrl column to group_sessions table

ALTER TABLE group_sessions ADD COLUMN videoRoomUrl VARCHAR(500) DEFAULT NULL;

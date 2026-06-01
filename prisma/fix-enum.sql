-- Update existing writing_challenges rows to use new enum values before schema push
UPDATE "writing_challenges" SET "status" = 'UPCOMING' WHERE "status" = 'UPCOMING';

-- First delete all existing challenge data so enum can be cleanly swapped
DELETE FROM "daily_poems";
DELETE FROM "writing_challenge_registrations";
DELETE FROM "writing_challenges";

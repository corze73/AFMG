/*
  # Add previous_club column to players table

  1. Changes
    - Add `previous_club` column to `players` table
    - Column is optional (nullable) text field
    - No default value required as we handle N/A display in the frontend

  2. Notes
    - This allows tracking of players' previous club affiliations
    - Field is visible to both public users and administrators
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'previous_club'
  ) THEN
    ALTER TABLE players ADD COLUMN previous_club text;
  END IF;
END $$;
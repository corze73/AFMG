/*
  # Add bio field to players table

  1. Changes
    - Add `bio` column to players table (text, optional)
    - Bio field for short player descriptions (max 50 words)

  2. Security
    - No changes to existing RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'bio'
  ) THEN
    ALTER TABLE players ADD COLUMN bio text;
  END IF;
END $$;
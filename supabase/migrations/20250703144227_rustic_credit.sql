/*
  # Create players table

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `position` (text, required)
      - `preferred_foot` (text, required - left/right/both)
      - `current_club` (text, optional)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `players` table
    - Add policy for authenticated users to manage players
*/

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  preferred_foot text NOT NULL CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
  current_club text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage players"
  ON players
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
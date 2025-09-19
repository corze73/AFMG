/*
  # Update players table policies for public visibility

  1. Security Changes
    - Allow public users to read player data
    - Restrict write operations to authenticated users only
    - Enable public viewing of player profiles on home page
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can manage players" ON players;

-- Create separate policies for read and write operations
CREATE POLICY "Anyone can view players"
  ON players
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage players"
  ON players
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
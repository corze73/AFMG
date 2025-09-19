/*
  # Add profile image support for admins

  1. Changes
    - Add `profile_image_url` column to profiles table
    - Allow admins to upload and manage their profile images

  2. Security
    - Existing RLS policies will handle access control
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_image_url text;
  END IF;
END $$;
/*
  # Create storage bucket for player images

  1. Storage Setup
    - Create 'player-images' bucket for storing profile photos
    - Enable public access for viewing images
    - Set up RLS policies for secure upload/delete operations

  2. Security
    - Public can view images
    - Only authenticated users can upload/delete images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-images', 'player-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public can view player images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'player-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload player images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'player-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update player images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'player-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete player images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'player-images');
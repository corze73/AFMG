/*
  # Set up player-images storage bucket and policies

  1. Storage Setup
    - Create `player-images` bucket if it doesn't exist
    - Enable public access for the bucket
    
  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to images
    - Allow authenticated users to delete their own uploads
*/

-- Create the player-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-images', 'player-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'player-images');

-- Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'player-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'player-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'player-images');
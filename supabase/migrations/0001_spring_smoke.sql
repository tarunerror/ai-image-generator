/*
  # Create generations table for AI image generation history

  1. New Tables
    - `generations`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt` (text)
      - `image_url` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `generations` table
    - Add policies for authenticated users to:
      - Insert their own generations
      - Read their own generations
*/

CREATE TABLE generations (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users NOT NULL,
  prompt text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own generations
CREATE POLICY "Users can insert their own generations"
  ON generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own generations
CREATE POLICY "Users can read their own generations"
  ON generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
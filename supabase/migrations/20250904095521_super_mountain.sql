/*
  # Create quick_quotes table

  1. New Tables
    - `quick_quotes`
      - `id` (uuid, primary key)
      - `source` (text, default 'KodomBranchOne')
      - `external_reference_id` (text, optional)
      - `vehicle_data` (jsonb, stores vehicle information)
      - `request_data` (jsonb, stores full request payload)
      - `api_response` (jsonb, stores API response)
      - `quote_id` (text, stores quote ID from API)
      - `premium` (numeric, stores premium amount)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quick_quotes` table
    - Add policy for public insert access
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS quick_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'KodomBranchOne',
  external_reference_id text DEFAULT '',
  vehicle_data jsonb DEFAULT '{}',
  request_data jsonb DEFAULT '{}',
  api_response jsonb,
  quote_id text,
  premium numeric,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quick_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on quick_quotes"
  ON quick_quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read on quick_quotes"
  ON quick_quotes
  FOR SELECT
  TO anon
  USING (true);
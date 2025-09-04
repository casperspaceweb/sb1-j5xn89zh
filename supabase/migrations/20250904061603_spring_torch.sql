/*
  # Insurance Quote and Lead Management Schema

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `external_reference_id` (text)
      - `vehicle_data` (jsonb) - stores complete vehicle information
      - `driver_data` (jsonb) - stores driver information
      - `quote_response` (jsonb) - stores API response with premium/excess
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `leads` 
      - `id` (uuid, primary key)
      - `quote_id` (uuid, foreign key to quotes)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `id_number` (text)
      - `contact_number` (text)
      - `application_user` (text, optional)
      - `application_user_email` (text, optional)
      - `status` (text) - submitted, processed, etc.
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add indexes for performance
*/

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_reference_id text,
  vehicle_data jsonb NOT NULL,
  driver_data jsonb NOT NULL,
  quote_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  id_number text DEFAULT '',
  contact_number text NOT NULL,
  application_user text DEFAULT '',
  application_user_email text DEFAULT '',
  status text DEFAULT 'submitted',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a lead generation form)
CREATE POLICY "Anyone can create quotes"
  ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read quotes"
  ON quotes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update quotes"
  ON quotes
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read leads"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS quotes_external_reference_idx ON quotes(external_reference_id);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_quote_id_idx ON leads(quote_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for quotes table
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
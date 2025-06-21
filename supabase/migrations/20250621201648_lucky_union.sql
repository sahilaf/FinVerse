/*
  # Create Finance Table for Budget Management

  1. New Tables
    - `finance`
      - `id` (uuid, primary key)
      - `user_id` (text, references user)
      - `type` (text, income/expense/savings)
      - `amount` (numeric, monetary amount)
      - `category` (text, budget category)
      - `note` (text, description/note)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `finance` table
    - Add policies for authenticated users to manage their own finance data

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on type for filtering
    - Add index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS finance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense', 'savings')),
  amount numeric(10,2) NOT NULL,
  category text,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE finance ENABLE ROW LEVEL SECURITY;

-- Create policies for finance table
CREATE POLICY "Users can read own finance data"
  ON finance
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own finance data"
  ON finance
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own finance data"
  ON finance
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own finance data"
  ON finance
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_finance_user_id ON finance(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_type ON finance(type);
CREATE INDEX IF NOT EXISTS idx_finance_created_at ON finance(created_at);
CREATE INDEX IF NOT EXISTS idx_finance_user_type ON finance(user_id, type);
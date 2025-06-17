/*
  # Add Chat System Schema

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (text, references user)
      - `type` (text, message type: 'user' or 'ai')
      - `amount` (float8, for any cost tracking if needed)
      - `note` (text, the actual message content)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for authenticated users to read their own messages
    - Add policy for authenticated users to insert their own messages
    - Add policy for authenticated users to update their own messages

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for chronological ordering
*/

-- Create the chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  type text NOT NULL CHECK (type IN ('user', 'ai')),
  amount float8 DEFAULT 0,
  note text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can read own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own chat messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON chat_messages(user_id, created_at);
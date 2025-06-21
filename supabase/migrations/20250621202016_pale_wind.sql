/*
  # Fix finance table ID column default value

  1. Changes
    - Add default UUID generation to the finance table's id column
    - Ensure the id column automatically generates UUIDs for new records

  2. Security
    - No changes to existing RLS policies
    - Maintains all existing constraints and indexes
*/

-- Add default UUID generation to the finance table's id column
ALTER TABLE finance ALTER COLUMN id SET DEFAULT gen_random_uuid();
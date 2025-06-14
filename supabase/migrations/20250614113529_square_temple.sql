/*
  # Fix profiles table RLS policies

  1. Security Updates
    - Drop existing INSERT policy that's causing issues
    - Create new INSERT policy that allows authenticated users to create their own profile
    - Update existing policies to use proper auth functions
    - Ensure all policies work correctly with Supabase auth

  2. Policy Changes
    - INSERT: Allow authenticated users to create profiles with their own user ID
    - SELECT: Allow users to view their own profile
    - UPDATE: Allow users to update their own profile

  This fixes the RLS policy violations that prevent user registration and profile access.
*/

-- Drop the existing problematic INSERT policy
DROP POLICY IF EXISTS "Enable insert for users creating their own profile" ON profiles;

-- Create a new INSERT policy that properly allows authenticated users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update the SELECT policy to use the correct auth function
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Update the UPDATE policy to use the correct auth function and target role
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
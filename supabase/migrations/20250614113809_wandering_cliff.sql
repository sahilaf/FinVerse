/*
  # Fix profiles table INSERT policy

  1. Security Changes
    - Drop the existing INSERT policy that uses `uid()` 
    - Create a new INSERT policy that uses `auth.uid()` for proper authentication
    - This allows authenticated users to create their own profile during sign-up

  The issue was that the policy was using `uid()` instead of `auth.uid()`, 
  which prevented new users from creating their profiles during registration.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy with correct auth function
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
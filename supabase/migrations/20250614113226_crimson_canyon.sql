/*
  # Fix profiles table RLS policy for sign-up

  1. Security Changes
    - Drop the existing restrictive INSERT policy that prevents sign-up
    - Create a new INSERT policy that allows users to create their own profile during sign-up
    - The policy allows INSERT when the user ID matches the authenticated user ID OR when creating a profile for a newly signed up user

  2. Policy Details
    - Policy name: "Enable insert for users creating their own profile"
    - Allows INSERT operations for authenticated users
    - Uses auth.uid() to ensure users can only create profiles for themselves
*/

-- Drop the existing INSERT policy that's too restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy that allows profile creation during sign-up
CREATE POLICY "Enable insert for users creating their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
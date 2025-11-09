-- Add admin role to user
-- Run this in Supabase SQL Editor

-- Method 1: Set role to 'admin'
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"admin"'
)
WHERE email = 'demo@flightschool.com';

-- Method 2: Set role to 'super_admin' (uncomment to use)
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(
--   raw_user_meta_data, 
--   '{role}', 
--   '"super_admin"'
-- )
-- WHERE email = 'demo@flightschool.com';

-- Verify the role was set
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'school_name' as school_name
FROM auth.users 
WHERE email = 'demo@flightschool.com';


-- Create Test Users for Supabase Auth
-- Run this in Supabase SQL Editor to create test accounts

-- Note: Supabase Auth manages passwords securely, so we can't directly insert them.
-- Instead, you have two options:

-- OPTION 1: Use Supabase Dashboard to create users manually
-- Go to: Authentication > Users > Add User
-- Create these test accounts:
-- - Email: demo@flightschool.com, Password: demo123456
-- - Email: admin@phoenixflight.com, Password: admin123456

-- OPTION 2: Use the signup form in the app (recommended)
-- Just sign up through /signup with any email

-- OPTION 3: Disable email confirmation for testing (Development Only)
-- This allows you to sign up without verifying email

-- To disable email confirmation in Supabase:
-- 1. Go to Authentication > Settings
-- 2. Scroll to "Email Auth"
-- 3. Toggle OFF "Enable email confirmations"
-- 4. Now you can sign up and immediately sign in

-- After creating auth users, you can optionally link them to school_admins table
-- This would be done after the user signs up through the app

-- Example: Link auth user to a school
-- INSERT INTO school_admins (school_id, auth_user_id, role, permissions)
-- VALUES (
--   (SELECT id FROM schools WHERE slug = 'phoenix-flight-academy' LIMIT 1),
--   'your-auth-user-uuid-here',
--   'admin',
--   ARRAY['manage_bookings', 'view_analytics', 'manage_weather_alerts']
-- );

-- For now, just use the Sign Up form to create an account!


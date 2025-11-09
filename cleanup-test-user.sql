-- Clean up test user that was created without school_admins record
-- This will allow you to re-register with the same email after fixing RLS

-- Find the user ID for the test email
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'adminpho@phoenixaviation.com';

-- Delete the user (this will cascade and delete any related records)
-- Uncomment the line below after confirming the user ID above
-- DELETE FROM auth.users WHERE email = 'adminpho@phoenixaviation.com';


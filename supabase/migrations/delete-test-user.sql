-- Delete the test user that was created without school_admins record
-- This will allow you to re-register with the same email after fixing RLS

DELETE FROM auth.users WHERE email = 'adminpho@phoenixaviation.com';

-- Verify deletion
SELECT id, email FROM auth.users WHERE email = 'adminpho@phoenixaviation.com';

-- Success message (if the SELECT returns empty)
SELECT 'Test user deleted successfully! You can now sign up again.' as message;


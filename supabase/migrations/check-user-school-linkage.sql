-- Check all users and their school linkage
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role,
  u.raw_user_meta_data->>'contact_name' as contact_name,
  sa.school_id,
  s.name as school_name
FROM auth.users u
LEFT JOIN school_admins sa ON u.id = sa.user_id
LEFT JOIN schools s ON sa.school_id = s.id
ORDER BY u.created_at DESC;


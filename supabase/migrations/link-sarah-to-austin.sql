-- Link test@austinflight.com (Sarah Johnson) to Austin Flight School

INSERT INTO school_admins (user_id, school_id, role, is_primary)
VALUES (
  '9eba8eed-d663-4448-9e54-576f5f5e081d',  -- test@austinflight.com (Sarah Johnson)
  '33333333-3333-3333-3333-333333333333',  -- Austin Flight School
  'admin',
  true
)
ON CONFLICT (user_id, school_id) DO NOTHING;

-- Verify the linkage
SELECT 
  u.email,
  u.raw_user_meta_data->>'contact_name' as contact_name,
  sa.school_id,
  s.name as school_name,
  sa.role,
  sa.is_primary
FROM auth.users u
JOIN school_admins sa ON u.id = sa.user_id
JOIN schools s ON sa.school_id = s.id
WHERE u.id = '9eba8eed-d663-4448-9e54-576f5f5e081d';

-- Success message
SELECT 'Sarah Johnson linked to Austin Flight School!' as message;


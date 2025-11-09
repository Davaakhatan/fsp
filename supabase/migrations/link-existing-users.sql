-- Link existing school admin users to their schools

-- First, let's see what schools we have available
SELECT id, name, city, state FROM schools ORDER BY name;

-- Link test@austinflight.com (Sarah Johnson) to a school
-- You need to pick the correct school_id from the list above
-- Example: If Austin Flight Academy has id '33333333-3333-3333-3333-333333333333'

-- Uncomment and modify this after choosing the correct school:
/*
INSERT INTO school_admins (user_id, school_id, role, is_primary)
VALUES (
  '9eba8eed-d663-4448-9e54-576f5f5e081d',  -- test@austinflight.com
  '33333333-3333-3333-3333-333333333333',  -- Replace with actual school_id
  'admin',
  true
)
ON CONFLICT (user_id, school_id) DO NOTHING;
*/

-- After running the above, verify the linkage:
-- SELECT * FROM school_admins WHERE user_id = '9eba8eed-d663-4448-9e54-576f5f5e081d';


-- Check which schools the inquiries are for
SELECT 
  s.name as school_name,
  COUNT(i.id) as inquiry_count
FROM inquiries i
JOIN schools s ON i.school_id = s.id
GROUP BY s.id, s.name
ORDER BY inquiry_count DESC;

-- Also show the full details
SELECT 
  i.id,
  i.student_name,
  i.student_email,
  i.status,
  i.created_at,
  s.id as school_id,
  s.name as school_name
FROM inquiries i
JOIN schools s ON i.school_id = s.id
ORDER BY i.created_at DESC;


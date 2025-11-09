-- Check if any inquiries were submitted
SELECT 
  i.id,
  i.student_name,
  i.student_email,
  i.program_interest,
  i.status,
  i.created_at,
  s.name as school_name
FROM inquiries i
JOIN schools s ON i.school_id = s.id
ORDER BY i.created_at DESC
LIMIT 10;

-- Also check the count
SELECT COUNT(*) as total_inquiries FROM inquiries;


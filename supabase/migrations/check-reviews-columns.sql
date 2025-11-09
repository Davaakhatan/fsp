-- Check the actual columns in the reviews table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reviews' 
ORDER BY ordinal_position;


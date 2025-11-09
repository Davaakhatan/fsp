-- Simplest possible RLS - disable it temporarily to test
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled on reviews table for testing' as message;


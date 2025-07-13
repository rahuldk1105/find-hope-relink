-- Add the current authenticated user to the users table if they don't exist
INSERT INTO public.users (id, email, name, phone, role)
SELECT 
  'c55c5cd2-0787-47ae-8682-106ab924efbe',
  'shankar72ind@gmail.com',
  'Test User',
  NULL,
  'relative'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE id = 'c55c5cd2-0787-47ae-8682-106ab924efbe'
);
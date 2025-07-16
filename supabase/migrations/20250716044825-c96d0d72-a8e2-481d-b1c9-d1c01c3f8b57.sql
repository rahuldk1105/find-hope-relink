-- Add the authenticated user to the users table if they don't exist
INSERT INTO public.users (id, email, name, phone, role)
SELECT
  '840746aa-88df-4ed9-a2ad-3d66bd876016',
  'rahuldk1105@gmail.com',
  'User',
  NULL,
  'relative'
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE id = '840746aa-88df-4ed9-a2ad-3d66bd876016'
);
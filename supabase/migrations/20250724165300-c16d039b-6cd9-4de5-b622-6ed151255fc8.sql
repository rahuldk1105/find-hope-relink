-- Create system user for automated facial recognition scans
INSERT INTO public.users (id, name, email, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'System Scanner', 'system@facial-recognition.ai', 'police')
ON CONFLICT (id) DO NOTHING;
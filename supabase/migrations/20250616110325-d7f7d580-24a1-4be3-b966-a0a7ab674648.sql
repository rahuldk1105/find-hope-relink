
-- Create storage bucket for scan images
INSERT INTO storage.buckets (id, name, public) VALUES ('scan-images', 'scan-images', true);

-- Create RLS policies for scan-images bucket
CREATE POLICY "Police can upload scan images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'scan-images' AND auth.role() = 'authenticated');

CREATE POLICY "Police can view scan images" ON storage.objects
FOR SELECT USING (bucket_id = 'scan-images');

-- Add RLS policies for missing_persons table
ALTER TABLE missing_persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Police can view all missing persons" ON missing_persons
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Police can update missing persons status" ON missing_persons
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Relatives can view their reports" ON missing_persons
FOR SELECT TO authenticated USING (reporter_id = auth.uid());

CREATE POLICY "Relatives can insert their reports" ON missing_persons
FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

-- Add RLS policies for scan_attempts table
ALTER TABLE scan_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Police can insert scan attempts" ON scan_attempts
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Police can view scan attempts" ON scan_attempts
FOR SELECT TO authenticated USING (true);

-- Add RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON users
FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON users
FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Create storage bucket for missing person photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('missing-person-photos', 'missing-person-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for missing-person-photos bucket
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'missing-person-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view missing person photos" ON storage.objects
FOR SELECT USING (bucket_id = 'missing-person-photos');

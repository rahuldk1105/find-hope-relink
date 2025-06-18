
-- Add action column to scan_attempts table if it doesn't exist
ALTER TABLE scan_attempts ADD COLUMN IF NOT EXISTS action TEXT DEFAULT 'scanned';

-- Add location and time details for scan attempts
ALTER TABLE scan_attempts ADD COLUMN IF NOT EXISTS found_location TEXT;
ALTER TABLE scan_attempts ADD COLUMN IF NOT EXISTS found_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE scan_attempts ADD COLUMN IF NOT EXISTS found_person_name TEXT;
ALTER TABLE scan_attempts ADD COLUMN IF NOT EXISTS estimated_age INTEGER;

-- Create RLS policies for missing_persons (only if they don't exist)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'missing_persons' 
        AND policyname = 'Anyone can view missing persons'
    ) THEN
        CREATE POLICY "Anyone can view missing persons" ON missing_persons
          FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'missing_persons' 
        AND policyname = 'Authenticated users can insert missing persons'
    ) THEN
        CREATE POLICY "Authenticated users can insert missing persons" ON missing_persons
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'missing_persons' 
        AND policyname = 'Users can update their own reports'
    ) THEN
        CREATE POLICY "Users can update their own reports" ON missing_persons
          FOR UPDATE USING (reporter_id = auth.uid());
    END IF;
END $$;

-- Create RLS policies for scan_attempts (only if they don't exist)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scan_attempts' 
        AND policyname = 'Police can view all scan attempts'
    ) THEN
        CREATE POLICY "Police can view all scan attempts" ON scan_attempts
          FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scan_attempts' 
        AND policyname = 'Police can insert scan attempts'
    ) THEN
        CREATE POLICY "Police can insert scan attempts" ON scan_attempts
          FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Enable realtime for missing_persons
ALTER TABLE missing_persons REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE missing_persons;

-- Enable realtime for scan_attempts  
ALTER TABLE scan_attempts REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE scan_attempts;

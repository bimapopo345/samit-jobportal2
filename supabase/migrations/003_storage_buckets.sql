-- Create storage buckets via SQL (requires storage schema)
-- Note: In production, you might need to create these via Supabase Dashboard

-- Insert bucket configurations (if storage.buckets table exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('org-legal', 'org-legal', false, 10485760, ARRAY['application/pdf']), -- 10MB, PDF only
  ('resumes', 'resumes', false, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']), -- 5MB
  ('org-logos', 'org-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']), -- 2MB
  ('job-assets', 'job-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']), -- 5MB
  ('class-assets', 'class-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']) -- 5MB
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for org-legal bucket (private)
CREATE POLICY "Organizations can upload legal documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'org-legal' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Organizations can view own legal documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'org-legal' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Organizations can update own legal documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'org-legal' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Organizations can delete own legal documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'org-legal' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for resumes bucket (private)
CREATE POLICY "Users can upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own resumes" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own resumes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for org-logos bucket (public)
CREATE POLICY "Anyone can view organization logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'org-logos');

CREATE POLICY "Organizations can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'org-logos' AND 
    EXISTS (
      SELECT 1 FROM organizations
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Organizations can update their logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'org-logos' AND 
    EXISTS (
      SELECT 1 FROM organizations
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Organizations can delete their logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'org-logos' AND 
    EXISTS (
      SELECT 1 FROM organizations
      WHERE owner_id = auth.uid()
    )
  );

-- Storage policies for job-assets bucket (public)
CREATE POLICY "Anyone can view job assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'job-assets');

CREATE POLICY "Organizations can upload job assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'job-assets' AND 
    EXISTS (
      SELECT 1 FROM organizations
      WHERE owner_id = auth.uid() AND verification_status = 'verified'
    )
  );

CREATE POLICY "Organizations can update job assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'job-assets' AND 
    EXISTS (
      SELECT 1 FROM organizations
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Organizations can delete job assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'job-assets' AND 
    EXISTS (
      SELECT 1 FROM organizations
      WHERE owner_id = auth.uid()
    )
  );

-- Storage policies for class-assets bucket (public)
CREATE POLICY "Anyone can view class assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'class-assets');

CREATE POLICY "Admins can manage class assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'class-assets' AND 
    is_admin()
  );

CREATE POLICY "Admins can update class assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'class-assets' AND 
    is_admin()
  );

CREATE POLICY "Admins can delete class assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'class-assets' AND 
    is_admin()
  );

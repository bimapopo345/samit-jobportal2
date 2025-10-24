-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_legal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns organization
CREATE OR REPLACE FUNCTION owns_organization(org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organizations
    WHERE id = org_uuid AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is member of organization
CREATE OR REPLACE FUNCTION is_org_member(org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE org_id = org_uuid AND profile_id = auth.uid()
  ) OR owns_organization(org_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- PROFILES POLICIES
-- ===========================================
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================================
-- ORGANIZATIONS POLICIES
-- ===========================================
CREATE POLICY "Public can view verified organizations" ON organizations
  FOR SELECT USING (verification_status = 'verified' OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "Organization owners can update their org" ON organizations
  FOR UPDATE USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "Lembaga role users can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'lembaga'
    )
  );

CREATE POLICY "Organization owners can delete their org" ON organizations
  FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- ===========================================
-- ORGANIZATION LEGAL DOCS POLICIES
-- ===========================================
CREATE POLICY "Organization owners and admins can view legal docs" ON organization_legal_docs
  FOR SELECT USING (
    is_org_member(org_id) OR is_admin()
  );

CREATE POLICY "Organization owners can upload legal docs" ON organization_legal_docs
  FOR INSERT WITH CHECK (
    owns_organization(org_id)
  );

CREATE POLICY "Organization owners can update legal docs" ON organization_legal_docs
  FOR UPDATE USING (
    owns_organization(org_id)
  );

CREATE POLICY "Organization owners can delete legal docs" ON organization_legal_docs
  FOR DELETE USING (
    owns_organization(org_id) OR is_admin()
  );

-- ===========================================
-- RESUMES POLICIES
-- ===========================================
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Organizations can view applicant resumes" ON resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.cv_url = resumes.file_url
        AND (owns_organization(j.org_id) OR is_org_member(j.org_id))
    )
  );

CREATE POLICY "Users can upload resumes" ON resumes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (user_id = auth.uid());

-- ===========================================
-- JOBS POLICIES
-- ===========================================
CREATE POLICY "Public can view active jobs from verified orgs" ON jobs
  FOR SELECT USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM organizations o
      WHERE o.id = jobs.org_id AND o.verification_status = 'verified'
    )
  );

CREATE POLICY "Organization members can view all their jobs" ON jobs
  FOR SELECT USING (
    is_org_member(org_id) OR is_admin()
  );

CREATE POLICY "Organization owners can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    owns_organization(org_id) AND
    EXISTS (
      SELECT 1 FROM organizations
      WHERE id = org_id AND verification_status = 'verified'
    )
  );

CREATE POLICY "Organization owners can update jobs" ON jobs
  FOR UPDATE USING (
    owns_organization(org_id) OR is_admin()
  );

CREATE POLICY "Organization owners can delete jobs" ON jobs
  FOR DELETE USING (
    owns_organization(org_id) OR is_admin()
  );

-- ===========================================
-- APPLICATIONS POLICIES
-- ===========================================
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (applicant_id = auth.uid());

CREATE POLICY "Organizations can view applications for their jobs" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = applications.job_id 
        AND (is_org_member(j.org_id) OR is_admin())
    )
  );

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (
    applicant_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN organizations o ON j.org_id = o.id
      WHERE j.id = job_id 
        AND j.is_active = true 
        AND o.verification_status = 'verified'
    )
  );

CREATE POLICY "Organizations can update application status" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = applications.job_id 
        AND (owns_organization(j.org_id) OR is_admin())
    )
  );

-- ===========================================
-- CLASSES POLICIES
-- ===========================================
CREATE POLICY "Public can view active classes" ON classes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all classes" ON classes
  FOR ALL USING (is_admin());

-- ===========================================
-- CLASS ENROLLMENTS POLICIES
-- ===========================================
CREATE POLICY "Users can view own enrollments" ON class_enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON class_enrollments
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can enroll in classes" ON class_enrollments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id AND is_active = true
    )
  );

CREATE POLICY "Users can update own enrollments" ON class_enrollments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all enrollments" ON class_enrollments
  FOR ALL USING (is_admin());

-- ===========================================
-- ORGANIZATION MEMBERS POLICIES
-- ===========================================
CREATE POLICY "Organization members can view members" ON organization_members
  FOR SELECT USING (
    is_org_member(org_id) OR is_admin()
  );

CREATE POLICY "Organization owners can add members" ON organization_members
  FOR INSERT WITH CHECK (
    owns_organization(org_id) OR is_admin()
  );

CREATE POLICY "Organization owners can update members" ON organization_members
  FOR UPDATE USING (
    owns_organization(org_id) OR is_admin()
  );

CREATE POLICY "Organization owners can remove members" ON organization_members
  FOR DELETE USING (
    owns_organization(org_id) OR is_admin()
  );

-- ===========================================
-- ACTIVITY LOGS POLICIES
-- ===========================================
CREATE POLICY "Users can view own activity" ON activity_logs
  FOR SELECT USING (actor_id = auth.uid() OR is_admin());

CREATE POLICY "System can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated;

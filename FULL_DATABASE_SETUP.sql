-- ============================================
-- SAMIT JOB PORTAL - FULL DATABASE SETUP
-- Copy SEMUA ini ke Supabase SQL Editor dan RUN
-- ============================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (Wajib ada untuk auth!)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'lembaga', 'admin')),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  socials JSONB DEFAULT '{}',
  default_cv_id UUID,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. AUTO CREATE PROFILE ON SIGNUP (PENTING!)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  address TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  founded_year INTEGER,
  employee_count VARCHAR(50),
  industry VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view organizations" ON organizations
  FOR SELECT USING (true);

CREATE POLICY "Owners can update their org" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Lembaga can create org" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'lembaga')
  );

-- ============================================
-- 4. ORGANIZATION LEGAL DOCS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.organization_legal_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE organization_legal_docs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  employment_type TEXT CHECK (employment_type IN ('fulltime', 'parttime', 'intern', 'contract')),
  location_type TEXT CHECK (location_type IN ('onsite', 'remote', 'hybrid')),
  category TEXT CHECK (category IN ('dalam-negeri', 'jepang', 'ex-jepang')),
  jlpt_required TEXT CHECK (jlpt_required IN ('N5', 'N4', 'N3', 'N2', 'N1', NULL)),
  is_gijinkoku BOOLEAN DEFAULT false,
  is_nihongo_gakkou BOOLEAN DEFAULT false,
  is_intensive_class_partner BOOLEAN DEFAULT false,
  location_city VARCHAR(100),
  location_prefecture VARCHAR(100),
  location_country VARCHAR(100) DEFAULT 'Japan',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'JPY',
  show_salary BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  application_deadline DATE,
  start_date DATE,
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active jobs" ON jobs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Org owners can manage jobs" ON jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM organizations WHERE id = jobs.org_id AND owner_id = auth.uid())
  );

-- ============================================
-- 6. RESUMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  is_default BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (user_id = auth.uid());

-- Add foreign key to profiles
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS fk_default_cv,
  ADD CONSTRAINT fk_default_cv 
  FOREIGN KEY (default_cv_id) 
  REFERENCES resumes(id) 
  ON DELETE SET NULL;

-- ============================================
-- 7. APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cv_url TEXT NOT NULL,
  cover_letter TEXT,
  answers JSONB DEFAULT '{}',
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interview', 'rejected', 'hired')),
  status_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, applicant_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (applicant_id = auth.uid());

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Orgs can view applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs j
      JOIN organizations o ON j.org_id = o.id
      WHERE j.id = applications.job_id AND o.owner_id = auth.uid()
    )
  );

-- ============================================
-- 8. CLASSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  class_type TEXT CHECK (class_type IN ('kaiwa', 'intensif', 'jlpt')),
  jlpt_level TEXT CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1', NULL)),
  instructor_name VARCHAR(255),
  instructor_bio TEXT,
  syllabus JSONB DEFAULT '[]',
  start_date DATE,
  end_date DATE,
  schedule TEXT,
  duration_hours INTEGER,
  max_students INTEGER,
  enrolled_count INTEGER DEFAULT 0,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'JPY',
  requirements TEXT,
  materials TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active classes" ON classes
  FOR SELECT USING (is_active = true);

-- ============================================
-- 9. CLASS ENROLLMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
  notes TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  UNIQUE(class_id, user_id)
);

ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own enrollments" ON class_enrollments
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- 10. ORGANIZATION MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, profile_id)
);

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 12. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_jobs_org_id ON jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);

-- ============================================
-- 13. UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 14. STORAGE BUCKETS (Run manually if needed)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public, file_size_limit)
-- VALUES 
--   ('org-legal', 'org-legal', false, 10485760),
--   ('resumes', 'resumes', false, 5242880),
--   ('org-logos', 'org-logos', true, 2097152),
--   ('job-assets', 'job-assets', true, 5242880),
--   ('class-assets', 'class-assets', true, 5242880)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 15. SAMPLE DATA (Optional - Uncomment to use)
-- ============================================
-- Sample admin user (change the ID to your user ID from Auth)
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR-USER-ID-HERE';

-- Sample Organization
-- INSERT INTO organizations (owner_id, slug, display_name, description, verification_status)
-- SELECT id, 'test-company', 'Test Company', 'This is a test company', 'verified'
-- FROM profiles WHERE role = 'lembaga' LIMIT 1;

-- Sample Job
-- INSERT INTO jobs (org_id, slug, title, description, employment_type, location_type, category, is_active)
-- SELECT id, 'test-job-1', 'Software Engineer', 'We are hiring!', 'fulltime', 'onsite', 'dalam-negeri', true
-- FROM organizations LIMIT 1;

-- ============================================
-- 16. STORAGE BUCKETS
-- ============================================
-- Note: Run these commands in the Supabase Dashboard SQL Editor
-- Storage buckets can't be created via regular SQL migration

-- Create storage bucket for resumes (if not exists)
-- Go to Storage in Supabase Dashboard and create bucket: 'resumes' (public)

-- Create storage bucket for legal documents (if not exists)  
-- Go to Storage in Supabase Dashboard and create bucket: 'legal-documents' (public)

-- ============================================
-- DONE! Database ready to use
-- ============================================

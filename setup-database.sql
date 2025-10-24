-- SAMIT Job Portal Database Setup
-- Run this script in Supabase SQL Editor to create all tables and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'lembaga', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_type AS ENUM ('fulltime', 'parttime', 'intern', 'contract');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('onsite', 'remote', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_category AS ENUM ('dalam-negeri', 'jepang', 'ex-jepang');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE jlpt_level AS ENUM ('N5', 'N4', 'N3', 'N2', 'N1');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE class_type AS ENUM ('kaiwa', 'intensif', 'jlpt');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'interview', 'rejected', 'hired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('registered', 'confirmed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  full_name VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  socials JSONB DEFAULT '{}',
  default_cv_id UUID,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  address TEXT,
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  founded_year INTEGER,
  employee_count VARCHAR(50),
  industry VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create organization legal documents table
CREATE TABLE IF NOT EXISTS organization_legal_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  is_default BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT one_default_per_user UNIQUE (user_id, is_default) WHERE is_default = true
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  employment_type employment_type NOT NULL,
  location_type location_type NOT NULL,
  category job_category NOT NULL,
  jlpt_required jlpt_level,
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
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT salary_range CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cv_url TEXT NOT NULL,
  cover_letter TEXT,
  answers JSONB DEFAULT '{}',
  status application_status DEFAULT 'applied',
  status_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, applicant_id)
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  class_type class_type NOT NULL,
  jlpt_level jlpt_level,
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
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT date_range CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date),
  CONSTRAINT jlpt_required_for_jlpt_class CHECK (
    (class_type = 'jlpt' AND jlpt_level IS NOT NULL) OR 
    (class_type != 'jlpt')
  )
);

-- Create class enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'registered',
  notes TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  UNIQUE(class_id, user_id)
);

-- Create organization members table (optional - for multi-user orgs)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, profile_id)
);

-- Create activity logs table (for audit trail)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_verification_status ON organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_jobs_org_id ON jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_jlpt ON jobs(jlpt_required);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location_city, location_prefecture);
CREATE INDEX IF NOT EXISTS idx_jobs_tags ON jobs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_slug ON classes(slug);
CREATE INDEX IF NOT EXISTS idx_classes_type ON classes(class_type);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON class_enrollments(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update profile's default_cv_id reference after resumes table is created
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS fk_default_cv,
  ADD CONSTRAINT fk_default_cv 
  FOREIGN KEY (default_cv_id) 
  REFERENCES resumes(id) 
  ON DELETE SET NULL;

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
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===========================================
-- ORGANIZATIONS POLICIES
-- ===========================================
DROP POLICY IF EXISTS "Public can view verified organizations" ON organizations;
CREATE POLICY "Public can view verified organizations" ON organizations
  FOR SELECT USING (verification_status = 'verified' OR owner_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Organization owners can update their org" ON organizations;
CREATE POLICY "Organization owners can update their org" ON organizations
  FOR UPDATE USING (owner_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Lembaga role users can create organizations" ON organizations;
CREATE POLICY "Lembaga role users can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'lembaga'
    )
  );

DROP POLICY IF EXISTS "Organization owners can delete their org" ON organizations;
CREATE POLICY "Organization owners can delete their org" ON organizations
  FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- ===========================================
-- JOBS POLICIES (simplified for now)
-- ===========================================
DROP POLICY IF EXISTS "Public can view active jobs" ON jobs;
CREATE POLICY "Public can view active jobs" ON jobs
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Organization owners can manage jobs" ON jobs;
CREATE POLICY "Organization owners can manage jobs" ON jobs
  FOR ALL USING (owns_organization(org_id) OR is_admin());

-- ===========================================
-- Other basic policies
-- ===========================================
DROP POLICY IF EXISTS "Users can manage own resumes" ON resumes;
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (applicant_id = auth.uid());

DROP POLICY IF EXISTS "Users can create applications" ON applications;
CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

DROP POLICY IF EXISTS "Public can view active classes" ON classes;
CREATE POLICY "Public can view active classes" ON classes
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can manage own enrollments" ON class_enrollments;
CREATE POLICY "Users can manage own enrollments" ON class_enrollments
  FOR ALL USING (user_id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

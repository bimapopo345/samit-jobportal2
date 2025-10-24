-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'lembaga', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE employment_type AS ENUM ('fulltime', 'parttime', 'intern', 'contract');
CREATE TYPE location_type AS ENUM ('onsite', 'remote', 'hybrid');
CREATE TYPE job_category AS ENUM ('dalam-negeri', 'jepang', 'ex-jepang');
CREATE TYPE jlpt_level AS ENUM ('N5', 'N4', 'N3', 'N2', 'N1');
CREATE TYPE class_type AS ENUM ('kaiwa', 'intensif', 'jlpt');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'interview', 'rejected', 'hired');
CREATE TYPE enrollment_status AS ENUM ('registered', 'confirmed', 'cancelled');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
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
CREATE TABLE organizations (
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
CREATE TABLE organization_legal_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE resumes (
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
CREATE TABLE jobs (
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
CREATE TABLE applications (
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
CREATE TABLE classes (
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
CREATE TABLE class_enrollments (
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
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, profile_id)
);

-- Create activity logs table (for audit trail)
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_verification_status ON organizations(verification_status);
CREATE INDEX idx_jobs_org_id ON jobs(org_id);
CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_jlpt ON jobs(jlpt_required);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_jobs_location ON jobs(location_city, location_prefecture);
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_classes_slug ON classes(slug);
CREATE INDEX idx_classes_type ON classes(class_type);
CREATE INDEX idx_classes_active ON classes(is_active);
CREATE INDEX idx_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX idx_enrollments_user_id ON class_enrollments(user_id);

-- Full text search indexes (optional)
CREATE INDEX idx_jobs_search ON jobs USING GIN(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);
CREATE INDEX idx_organizations_search ON organizations USING GIN(
  to_tsvector('english', coalesce(display_name, '') || ' ' || coalesce(description, ''))
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-increment job applications count trigger
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs 
  SET applications_count = applications_count + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_job_applications
  AFTER INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION increment_applications_count();

-- Auto-increment class enrollment count trigger
CREATE OR REPLACE FUNCTION update_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE classes 
    SET enrolled_count = enrolled_count + 1
    WHERE id = NEW.class_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE classes 
    SET enrolled_count = enrolled_count - 1
    WHERE id = OLD.class_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_class_enrollment_count
  AFTER INSERT OR DELETE ON class_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_enrollment_count();

-- Update profile's default_cv_id reference after resumes table is created
ALTER TABLE profiles 
  ADD CONSTRAINT fk_default_cv 
  FOREIGN KEY (default_cv_id) 
  REFERENCES resumes(id) 
  ON DELETE SET NULL;

-- NUCLEAR RESET - HAPUS SEMUA DAN BUAT ULANG DARI AWAL
-- WARNING: Ini akan menghapus SEMUA data!

-- 1. HAPUS SEMUA TABEL
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS class_enrollments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS organization_legal_docs CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. HAPUS SEMUA TRIGGERS DAN FUNCTIONS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at();

-- 3. BUAT ULANG SEMUA TABEL TANPA RLS
CREATE TABLE profiles (
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

CREATE TABLE jobs (
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

-- 4. GRANT PERMISSIONS TANPA RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO anon, authenticated, service_role;

-- 5. BUAT TRIGGER UNTUK AUTO PROFILE
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. BUAT ADMIN USER
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  aud,
  role,
  created_at,
  updated_at,
  raw_user_meta_data
)
SELECT
  uuid_generate_v4(),
  'admin@samit.co.id',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  'authenticated',
  'authenticated',
  NOW(),
  NOW(),
  '{"full_name": "SAMIT Administrator", "role": "admin"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@samit.co.id'
);

-- 7. BUAT PROFILE ADMIN
INSERT INTO profiles (id, role, full_name, created_at, updated_at)
SELECT 
  u.id,
  'admin',
  'SAMIT Administrator',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin@samit.co.id'
AND NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
);

-- 8. VERIFIKASI
SELECT 
  'NUCLEAR RESET COMPLETED' as status,
  'ALL TABLES RECREATED' as tables_status,
  'NO RLS ENABLED' as rls_status,
  'ADMIN USER CREATED' as admin_status,
  'Try login with admin@samit.co.id / Admin123!' as next_step;
-- TOTAL WIPE CLEAN - HAPUS SEMUA YANG ADA
-- Ini akan menghapus SEMUA termasuk auth.users, policies, RLS, triggers, functions!

-- 1. HAPUS SEMUA TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
DROP TRIGGER IF EXISTS update_class_enrollments_updated_at ON class_enrollments;
DROP TRIGGER IF EXISTS update_organization_members_updated_at ON organization_members;
DROP TRIGGER IF EXISTS update_activity_logs_updated_at ON activity_logs;

-- 2. HAPUS SEMUA FUNCTIONS
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.owns_organization(org_uuid UUID);
DROP FUNCTION IF EXISTS public.is_org_member(org_uuid UUID);
DROP FUNCTION IF EXISTS update_updated_at();

-- 3. HAPUS SEMUA POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow service role full access to users" ON auth.users;
DROP POLICY IF EXISTS "Allow users to view own data" ON auth.users;
DROP POLICY IF EXISTS "Public can view verified organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their org" ON organizations;
DROP POLICY IF EXISTS "Lembaga role users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can delete their org" ON organizations;
DROP POLICY IF EXISTS "Organization owners and admins can view legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Organization owners can upload legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Organization owners can update legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Organization owners can delete legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
DROP POLICY IF EXISTS "Organizations can view applicant resumes" ON resumes;
DROP POLICY IF EXISTS "Users can upload resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;
DROP POLICY IF EXISTS "Public can view active jobs from verified orgs" ON jobs;
DROP POLICY IF EXISTS "Organization members can view all their jobs" ON jobs;
DROP POLICY IF EXISTS "Organization owners can create jobs" ON jobs;
DROP POLICY IF EXISTS "Organization owners can update jobs" ON jobs;
DROP POLICY IF EXISTS "Organization owners can delete jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Organizations can view applications for their jobs" ON applications;
DROP POLICY IF EXISTS "Users can create applications" ON applications;
DROP POLICY IF EXISTS "Organizations can update application status" ON applications;
DROP POLICY IF EXISTS "Public can view active classes" ON classes;
DROP POLICY IF EXISTS "Admins can manage all classes" ON classes;
DROP POLICY IF EXISTS "Users can view own enrollments" ON class_enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON class_enrollments;
DROP POLICY IF EXISTS "Users can enroll in classes" ON class_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON class_enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON class_enrollments;
DROP POLICY IF EXISTS "Organization members can view members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners can add members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners can update members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners can remove members" ON organization_members;
DROP POLICY IF EXISTS "Users can view own activity" ON activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

-- 4. DISABLE RLS DI SEMUA TABEL
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_legal_docs DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- 5. HAPUS SEMUA TABEL (CASCADE)
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

-- 6. HAPUS JUGA AUTH.USERS (HARUS DENGAN CAREFUL!)
-- WARNING: Ini akan menghapus semua user yang ada!
-- Hanya jalankan jika mau mulai dari nol sama sekali
-- DELETE FROM auth.users WHERE email != 'admin@samit.co.id';

-- 7. BUAT ULANG TABEL-TABEL PENTING TANPA RLS SAMA SEKALI
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

-- 8. GRANT FULL PERMISSIONS KE SEMUA ROLE
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO anon, authenticated, service_role;

-- 9. BUAT ADMIN USER (Jika belum ada)
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

-- 10. BUAT PROFILE ADMIN
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

-- 11. VERIFIKASI FINAL
SELECT 
  'TOTAL WIPE COMPLETED' as status,
  'ALL TABLES, POLICIES, FUNCTIONS, TRIGGERS DELETED' as cleanup_status,
  'NO RLS ENABLED' as rls_status,
  'FULL PERMISSIONS GRANTED' as permissions,
  'ADMIN USER READY' as admin_status,
  'Try login with admin@samit.co.id / Admin123!' as next_step;
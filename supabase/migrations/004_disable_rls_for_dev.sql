-- Disable RLS untuk development - bikin hidup lebih mudah!
-- Nanti kalau udah prod baru enable lagi

-- Disable RLS di semua table
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

-- Drop semua policies yang bikin ribet
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON profiles;

DROP POLICY IF EXISTS "Public can view verified organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their org" ON organizations;
DROP POLICY IF EXISTS "Lembaga role users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Admin can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can delete their org" ON organizations;

DROP POLICY IF EXISTS "Public can view active jobs from verified orgs" ON jobs;
DROP POLICY IF EXISTS "Organization members can view all their jobs" ON jobs;
DROP POLICY IF EXISTS "Organization owners can create jobs" ON jobs;
DROP POLICY IF EXISTS "Admin can create jobs without verification" ON jobs;
DROP POLICY IF EXISTS "Organization owners can update jobs" ON jobs;
DROP POLICY IF EXISTS "Organization owners can delete jobs" ON jobs;

-- Drop semua policies lainnya juga
DROP POLICY IF EXISTS "Organization owners and admins can view legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Organization owners can upload legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Organization owners can update legal docs" ON organization_legal_docs;
DROP POLICY IF EXISTS "Organization owners can delete legal docs" ON organization_legal_docs;

DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
DROP POLICY IF EXISTS "Organizations can view applicant resumes" ON resumes;
DROP POLICY IF EXISTS "Users can upload resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;

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

-- Pastikan semua user bisa akses semua table untuk development
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;

-- Comment untuk remind kita nanti
-- TODO: Enable RLS lagi sebelum production deployment!
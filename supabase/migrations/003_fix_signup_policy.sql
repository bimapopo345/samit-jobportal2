-- Fix RLS policy untuk allow profile creation during signup
-- Drop existing policy dan buat yang baru

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policy yang allow insert untuk authenticated users
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tambah policy untuk allow profile creation during signup even jika belum ada profile
CREATE POLICY "Allow profile creation during signup" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND 
    NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

-- Grant additional permissions untuk mengatasi 401 error
GRANT INSERT ON profiles TO authenticated;
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;

-- Add policy untuk organizations creation by admin
DROP POLICY IF EXISTS "Lembaga role users can create organizations" ON organizations;

CREATE POLICY "Lembaga role users can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND (role = 'lembaga' OR role = 'admin')
    )
  );

-- Add policy untuk admin to create organizations
CREATE POLICY "Admin can create organizations" ON organizations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add policy untuk admin job creation bypass verification
DROP POLICY IF EXISTS "Organization owners can create jobs" ON jobs;

CREATE POLICY "Organization owners can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    owns_organization(org_id) AND
    (
      EXISTS (
        SELECT 1 FROM organizations
        WHERE id = org_id AND verification_status = 'verified'
      ) OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Add policy untuk admin to create jobs without org verification
CREATE POLICY "Admin can create jobs without verification" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) AND owns_organization(org_id)
  );
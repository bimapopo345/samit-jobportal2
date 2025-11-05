# 🚀 CARA DISABLE RLS UNTUK DEVELOPMENT

## ❌ Problem: 
RLS (Row Level Security) bikin ribet signup dan development!

## ✅ Solution:
Disable RLS langsung dari Supabase Dashboard

### 📋 LANGKAH-LANGKAH:

1. **Buka Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Login ke project: kkctrcgozasuraxolvok

2. **Masuk ke SQL Editor:**
   - Klik "SQL Editor" di sidebar kiri
   - Klik "New Query"

3. **Copy-paste script ini:**
```sql
-- Disable RLS untuk semua table (development only!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_legal_docs DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
```

4. **Run script:**
   - Klik "Run" atau Ctrl+Enter
   - Tunggu sampai selesai

5. **Test signup:**
   - Buka: http://localhost:3003/auth/sign-up
   - Register dengan: bimapopo345@gmail.com
   - Password: admin123
   - Seharusnya tidak ada error 401 lagi!

---

## 🎯 SETELAH RLS DISABLED:

### Test Flow Admin:
1. **Signup berhasil** → Profile otomatis tercreate
2. **Update role manual:** 
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'bimapopo345@gmail.com';
   ```
3. **Login** → Dashboard admin accessible
4. **Post job** → Muncul di /jobs

### Cleanup nanti:
- **Re-enable RLS sebelum production!**
- File migration ada di: `supabase/migrations/002_rls_policies.sql`

---

## 🔥 SHORTCUT UNTUK TESTING:

Kalau mau lebih cepat, bisa juga:

1. Disable RLS (langkah di atas)
2. Insert admin langsung:
```sql
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at) 
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
  'admin@samit.dev', 
  crypt('admin123', gen_salt('bf')), 
  NOW(), 
  NOW(), 
  NOW()
);

INSERT INTO profiles (id, role, full_name, email) 
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'admin',
  'SAMIT Administrator', 
  'admin@samit.dev'
);
```

3. Login dengan admin@samit.dev / admin123
4. Test posting jobs!

---

## 🎉 HASIL YANG DIHARAPKAN:

✅ Signup tidak error  
✅ Admin bisa login  
✅ Admin bisa post job  
✅ Job muncul di /jobs  
✅ Flow lengkap berfungsi!

**Mari disable RLS dulu, biar bisa fokus ke fitur utama! 🚀**
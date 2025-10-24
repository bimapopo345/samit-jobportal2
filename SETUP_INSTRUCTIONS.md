# SAMIT Job Portal - Setup Instructions

## 🚀 Quick Setup

### 1. Setup Database di Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih project Anda
2. Pergi ke **SQL Editor** (icon terminal di sidebar kiri)
3. Klik **New Query**
4. Copy seluruh isi file `setup-database.sql` 
5. Paste ke SQL Editor
6. Klik **Run** (atau tekan Ctrl+Enter)
7. Tunggu sampai selesai (akan ada notifikasi "Success")

### 2. Setup Storage Buckets

Storage buckets akan otomatis dibuat saat menjalankan SQL script di atas, tapi jika gagal:

1. Pergi ke **Storage** di Supabase Dashboard
2. Create bucket berikut:
   - `org-legal` (Private) - untuk dokumen legal organisasi
   - `resumes` (Private) - untuk CV pelamar  
   - `org-logos` (Public) - untuk logo perusahaan
   - `job-assets` (Public) - untuk gambar lowongan
   - `class-assets` (Public) - untuk gambar kelas

### 3. Verifikasi Setup

1. Cek di **Table Editor** apakah semua tabel sudah terbuat:
   - profiles
   - organizations
   - jobs
   - applications
   - resumes
   - classes
   - class_enrollments
   - dll

2. Cek di **Authentication > Users** untuk melihat user yang sudah register

### 4. Test Aplikasi

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka http://localhost:3000

3. Register sebagai user baru:
   - Pilih role "User" untuk pencari kerja
   - Pilih role "Lembaga" untuk perusahaan

### 5. (Optional) Create Admin User

Untuk membuat admin user, jalankan query ini di SQL Editor:

```sql
-- Ganti USER_ID dengan ID user yang ingin dijadikan admin
-- ID bisa dilihat di Authentication > Users
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_DISINI';
```

## 🔧 Troubleshooting

### Error: "relation profiles does not exist"
- Pastikan sudah run script `setup-database.sql` di SQL Editor

### Error saat login/register
- Cek apakah environment variables sudah benar di `.env.local`
- Pastikan format:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=eyJhbGci... (sama dengan ANON_KEY)
  ```

### Redirect loop di dashboard
- Clear browser cookies
- Coba logout dan login lagi
- Pastikan profile user sudah terbuat di tabel `profiles`

### Data tidak muncul
- Cek RLS policies di Supabase Dashboard > Authentication > Policies
- Pastikan user punya permission untuk access data

## 📝 Test Data (Optional)

Jika ingin menambahkan sample data untuk testing, jalankan script berikut di SQL Editor:

```sql
-- Sample Organizations
INSERT INTO organizations (owner_id, slug, display_name, description, verification_status)
VALUES 
  ((SELECT id FROM profiles WHERE role = 'lembaga' LIMIT 1), 
   'toyota-indonesia', 
   'Toyota Motor Manufacturing Indonesia',
   'Leading automotive manufacturer in Indonesia',
   'verified'),
  ((SELECT id FROM profiles WHERE role = 'lembaga' LIMIT 1),
   'aeon-retail',
   'AEON Retail Japan', 
   'Major retail chain from Japan',
   'verified');

-- Sample Jobs
INSERT INTO jobs (
  org_id, slug, title, description, requirements, benefits,
  employment_type, location_type, category, jlpt_required,
  location_city, salary_min, salary_max, is_active
)
VALUES 
  ((SELECT id FROM organizations WHERE slug = 'toyota-indonesia'),
   'software-engineer-jakarta',
   'Software Engineer',
   'We are looking for a talented Software Engineer to join our IT team.',
   'Bachelor degree in Computer Science\n3+ years experience\nJLPT N3 or above',
   'Health insurance\nPerformance bonus\nTraining opportunities',
   'fulltime', 'onsite', 'dalam-negeri', 'N3',
   'Jakarta', 8000000, 15000000, true),
  ((SELECT id FROM organizations WHERE slug = 'aeon-retail'),
   'store-manager-tokyo',
   'Store Manager - Tokyo',
   'Managing retail store operations in Tokyo.',
   'JLPT N2 required\n5+ years retail experience\nLeadership skills',
   'Housing allowance\nVisa sponsorship\nRelocation support',
   'fulltime', 'onsite', 'jepang', 'N2',
   'Tokyo', 300000, 500000, true);

-- Sample Classes
INSERT INTO classes (
  slug, title, description, class_type, jlpt_level,
  instructor_name, price, is_active
)
VALUES
  ('jlpt-n3-prep-jan-2025',
   'JLPT N3 Preparation - January 2025',
   'Intensive preparation course for JLPT N3 exam',
   'jlpt', 'N3',
   'Tanaka Sensei', 2500000, true),
  ('business-japanese-conversation',
   'Business Japanese Conversation',
   'Learn practical Japanese for business settings',
   'kaiwa', null,
   'Yamada Sensei', 1800000, true);
```

## 🎉 Selesai!

Aplikasi SAMIT Job Portal sekarang siap digunakan. Features yang sudah tersedia:

- ✅ Landing page dengan hero section
- ✅ Job listing dengan filter (kategori, JLPT, lokasi, dll)
- ✅ Job detail page
- ✅ User registration dengan role selection
- ✅ Dashboard untuk user, lembaga, dan admin
- ✅ Profile management untuk user
- ✅ Responsive design (mobile-first)

## 📞 Need Help?

Jika ada masalah atau pertanyaan, silakan hubungi tim development.

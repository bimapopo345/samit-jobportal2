# Dokumentasi Command Authentication Supabase

## 1. Command Signup User Baru
```bash
curl -X POST "https://kkctrcgozasuraxolvok.supabase.co/auth/v1/signup" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3RyY2dvemFzdXJheG9sdm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzAxODEsImV4cCI6MjA3Njk0NjE4MX0.w7nlF4JAvh4DTKx_OfSYQszSFggoqyufd-00s39nsYs" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@gmail.com",
    "password": "Test123!",
    "data": {
      "full_name": "Test User",
      "role": "user"
    }
  }'
```

## 2. Command Login User
```bash
curl -X POST "https://kkctrcgozasuraxolvok.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3RyY2dvemFzdXJheG9sdm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzAxODEsImV4cCI6MjA3Njk0NjE4MX0.w7nlF4JAvh4DTKx_OfSYQszSFggoqyufd-00s39nsYs" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@gmail.com",
    "password": "Test123!"
  }'
```

## 3. Command Update Email Confirmation (Bypass)
```bash
# Dapatkan access token dulu
ACCESS_TOKEN=$(curl -s -X POST "https://kkctrcgozasuraxolvok.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3RyY2dvemFzdXJheG9sdm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzAxODEsImV4cCI6MjA3Njk0NjE4MX0.w7nlF4JAvh4DTKx_OfSYQszSFggoqyufd-00s39nsYs" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@gmail.com",
    "password": "Test123!"
  }' | jq -r '.access_token')

# Update email confirmation
curl -X POST "https://kkctrcgozasuraxolvok.supabase.co/rest/v1/profiles" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution" \
  -d '{
    "id": "6004f9bb-bbae-4839-80be-4f2177588d2a",
    "email_confirmed_at": "2025-10-25T07:12:00.000Z"
  }'
```

## 4. Command SQL Update Email Confirmation
```sql
-- Update email confirmation langsung via SQL
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'testuser@gmail.com';
```

## 5. Command Verifikasi User
```bash
curl -X GET "https://kkctrcgozasuraxolvok.supabase.co/rest/v1/profiles" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3RyY2dvemFzdXJheG9sdm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzAxODEsImV4cCI6MjA3Njk0NjE4MX0.w7nlF4JAvh4DTKx_OfSYQszSFggoqyufd-00s39nsYs" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## 6. Command Buat Admin User (via SQL)
```sql
-- Buat admin user langsung
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

-- Buat profile admin
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
```

## 7. Environment Variables
```bash
# Database Baru
NEXT_PUBLIC_SUPABASE_URL=https://kkctrcgozasuraxolvok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3RyY2dvemFzdXJheG9sdm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzAxODEsImV4cCI6MjA3Njk0NjE4MX0.w7nlF4JAvh4DTKx_OfSYQszSFggoqyufd-00s39nsYs
```

## Catatan:
- Ganti `testuser@gmail.com` dan `Test123!` dengan email dan password yang diinginkan
- Ganti `6004f9bb-bbae-4839-80be-4f2177588d2a` dengan user ID yang sesuai
- Pastikan format tanggal ISO: `YYYY-MM-DDTHH:MM:SSZ`
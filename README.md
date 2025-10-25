# 🎌 SAMIT - Sakura Mitra Indonesia

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Deskripsi Project

**SAMIT (Sakura Mitra Indonesia)** adalah platform job portal yang menghubungkan pencari kerja Indonesia dengan perusahaan Jepang. Platform ini menyediakan layanan pencarian kerja, kelas bahasa Jepang, dan manajemen organisasi dengan sistem role yang terstruktur.

### 🎯 Fitur Utama
- **Job Portal:** Browse dan apply lowongan kerja Jepang
- **Company Directory:** Database perusahaan partner yang terverifikasi  
- **Japanese Classes:** Kelas bahasa Jepang (JLPT N5-N1, Kaiwa, Intensif)
- **Multi-Role System:** User, Lembaga, dan Admin dengan permission berbeda
- **Organization Verification:** Sistem verifikasi organisasi yang ketat
- **CV Management:** Upload dan kelola multiple CV/Resume
- **Application Tracking:** Track status lamaran secara real-time

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.17+ 
- **npm** atau **yarn**
- **Supabase Account**
- **Git**

### 📥 Installation

1. **Clone Repository**
```bash
git clone https://github.com/your-repo/samit-job-portal.git
cd samit-job-portal
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure Environment Variables**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Database Setup**
```bash
# Setup Supabase (install CLI if needed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db reset
```

6. **Create Admin User (Important!)**
```sql
-- Run this SQL in Supabase SQL Editor after migration
-- Replace email and password with your admin credentials

-- 1. First, create user via Supabase Auth UI or programmatically
-- 2. Then update the profile to admin role:

UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@samit.co.id'
);
```

7. **Run Development Server**
```bash
npm run dev
# atau
yarn dev
```

🎉 **Application akan berjalan di:** http://localhost:3000

---

## 🔐 Default Admin Account

⚠️ **PENTING - Akun Admin Default:**

Setelah menjalankan migration, **TIDAK ADA akun admin default** yang dibuat otomatis. Anda harus membuat admin secara manual:

### Cara Membuat Admin:

1. **Registrasi user baru** via UI (`/auth/sign-up`)
2. **Login ke Supabase Dashboard** → Authentication → Users
3. **Copy User ID** dari user yang baru dibuat
4. **Jalankan SQL di Supabase SQL Editor:**

```sql
-- Ganti 'user-id-here' dengan ID user yang actual
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-id-here';
```

**Contoh Admin Account yang disarankan:**
- **Email:** `admin@samit.co.id`
- **Password:** `Admin123!@#` (ganti setelah login pertama)
- **Role:** `admin`

### Alternative - Create Admin via SQL:
```sql
-- Insert admin user directly (advanced)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'admin@samit.co.id',
  crypt('Admin123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Then create profile
INSERT INTO profiles (id, role, full_name)
SELECT id, 'admin', 'SAMIT Administrator'
FROM auth.users 
WHERE email = 'admin@samit.co.id';
```

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14+ | React framework dengan App Router |
| **TypeScript** | 5.0+ | Type safety dan better DX |
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework |
| **Lucide React** | Latest | Modern icon library |
| **Radix UI** | Latest | Accessible UI primitives |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (PostgreSQL + Auth + Storage) |
| **PostgreSQL** | Primary database |
| **Row Level Security** | Data security & authorization |
| **Supabase Storage** | File storage (CV, documents, images) |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Static type checking |
| **Supabase CLI** | Database management |

---

## 📁 Project Structure

```
samit-job-portal/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 auth/                     # Authentication pages
│   │   ├── 📁 login/               # Login page
│   │   ├── 📁 sign-up/             # Registration page
│   │   ├── 📁 forgot-password/     # Password reset
│   │   └── 📁 confirm/             # Email confirmation
│   ├── 📁 dashboard/               # Protected dashboard area
│   │   ├── 📁 admin/               # Admin-only pages
│   │   ├── 📁 profile/             # User profile management
│   │   ├── 📁 cv/                  # CV management
│   │   ├── 📁 jobs/                # Job management (Lembaga)
│   │   ├── 📁 applications/        # Application tracking (User)
│   │   ├── 📁 applicants/          # Applicant management (Lembaga)
│   │   ├── 📁 org/                 # Organization profile (Lembaga)
│   │   ├── 📁 legal/               # Legal documents (Lembaga)
│   │   └── 📁 classes/             # Class enrollment (User)
│   ├── 📁 jobs/                    # Public job listings
│   ├── 📁 companies/               # Public company directory
│   ├── 📁 classes/                 # Public class listings
│   ├── 📄 layout.tsx               # Root layout
│   ├── 📄 page.tsx                 # Homepage
│   ├── 📄 globals.css              # Global styles
│   └── 🖼️ logo.png                # SAMIT logo
├── 📁 components/                   # Reusable React components
│   ├── 📁 ui/                      # Base UI components
│   ├── 📁 layout/                  # Layout components (Header, Footer)
│   ├── 📁 dashboard/               # Dashboard-specific components
│   ├── 📁 jobs/                    # Job-related components
│   ├── 📁 auth/                    # Authentication forms
│   └── 📁 tutorial/                # Tutorial components
├── 📁 lib/                         # Utility libraries
│   ├── 📁 supabase/                # Supabase client configuration
│   ├── 📄 utils.ts                 # General utilities
│   └── 📄 design-system.ts         # Design tokens
├── 📁 supabase/                    # Supabase configuration
│   ├── 📁 migrations/              # Database migrations
│   │   ├── 📄 001_initial_schema.sql
│   │   ├── 📄 002_rls_policies.sql
│   │   └── 📄 003_storage_buckets.sql
│   └── 📄 config.toml              # Supabase config
├── 📁 public/                      # Static assets
│   ├── 🖼️ logo.png                # SAMIT logo (public)
│   └── 🔄 favicon.ico              # Site favicon
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tailwind.config.ts           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 next.config.ts               # Next.js configuration
├── 📄 .env.example                 # Environment variables template
├── 📄 README.md                    # Project documentation (this file)
└── 📄 INFORMATION.md               # Role & dashboard documentation
```

---

## 🎭 Role System & Permissions

### 3 Role Utama:

#### 👤 **USER (Pencari Kerja)**
```typescript
role: 'user'
```
**Capabilities:**
- ✅ Browse & apply to jobs
- ✅ Manage profile & CV
- ✅ Track applications  
- ✅ Enroll in Japanese classes
- ❌ Post jobs
- ❌ Access admin features

#### 🏢 **LEMBAGA (Organization)**
```typescript
role: 'lembaga'
verification_status: 'pending' | 'verified' | 'rejected'
```
**Capabilities:**
- ✅ Manage organization profile
- ✅ Upload legal documents
- ✅ Post jobs (only after verification)
- ✅ Manage applicants
- ✅ View applications for their jobs
- ❌ Apply to jobs
- ❌ Access admin features

**⚠️ Important:** Lembaga MUST be verified by admin before posting jobs!

#### 🛡️ **ADMIN (Administrator)**
```typescript
role: 'admin'
```
**Capabilities:**
- ✅ Full platform access
- ✅ Verify organizations
- ✅ Moderate content
- ✅ Manage users
- ✅ View analytics
- ✅ System configuration
- ✅ Bypass verification requirements

---

## 🗄️ Database Schema

### Core Tables:

#### **profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'user',
  full_name VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  socials JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### **organizations**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  verification_status verification_status DEFAULT 'pending',
  logo_url TEXT,
  founded_year INTEGER,
  employee_count VARCHAR(50),
  industry VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### **jobs**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  employment_type employment_type NOT NULL,
  location_type location_type NOT NULL,
  category job_category NOT NULL,
  jlpt_required jlpt_level,
  salary_min INTEGER,
  salary_max INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### Enums:
```sql
CREATE TYPE user_role AS ENUM ('user', 'lembaga', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE employment_type AS ENUM ('fulltime', 'parttime', 'intern', 'contract');
CREATE TYPE location_type AS ENUM ('onsite', 'remote', 'hybrid');
CREATE TYPE job_category AS ENUM ('dalam-negeri', 'jepang', 'ex-jepang');
CREATE TYPE jlpt_level AS ENUM ('N5', 'N4', 'N3', 'N2', 'N1');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'interview', 'rejected', 'hired');
```

---

## 🔐 Authentication & Security

### Supabase Auth Configuration:
- **Email/Password Authentication**
- **Email Confirmation Required**
- **Password Reset via Email**
- **Row Level Security (RLS) Enabled**
- **JWT-based Sessions**

### Security Policies:
```sql
-- Example RLS Policy
CREATE POLICY "Users can only view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Organizations can only manage own jobs" ON jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE id = jobs.org_id 
      AND owner_id = auth.uid()
    )
  );
```

---

## 🎨 Design System

### Color Palette:
```css
/* Primary Colors */
--samit-navy: #2B3E7C;
--samit-navy-light: #4B5E9C;
--samit-orange: #ff6154;
--samit-orange-light: #ff7a45;

/* Neutral Colors */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-600: #475569;
--slate-900: #0f172a;
```

### Typography:
- **Headings:** font-bold, font-semibold
- **Body:** font-medium, font-normal
- **Responsive:** text-sm to text-5xl

### Components:
- **Glass Morphism:** `backdrop-blur-md bg-white/95`
- **Gradients:** SAMIT brand colors
- **Shadows:** Subtle elevation
- **Border Radius:** Rounded corners (8px, 12px, 16px)

---

## 🚦 API Routes & Server Actions

### Authentication:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/reset-password` - Password reset

### Jobs:
- `GET /api/jobs` - List jobs with filters
- `GET /api/jobs/[slug]` - Get job details
- `POST /api/jobs` - Create job (Lembaga/Admin only)
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### Applications:
- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get user applications
- `PUT /api/applications/[id]` - Update application status

### Admin:
- `GET /api/admin/stats` - Platform statistics
- `POST /api/admin/verify-org` - Verify organization
- `GET /api/admin/organizations` - List pending organizations

---

## 📱 Responsive Design

### Breakpoints:
```css
/* Mobile First */
sm: '640px'    /* Small devices */
md: '768px'    /* Tablets */
lg: '1024px'   /* Laptops */
xl: '1280px'   /* Desktops */
2xl: '1536px'  /* Large screens */
```

### Mobile Features:
- **Touch-friendly Interface**
- **Mobile Navigation Menu**
- **Responsive Cards & Grids**
- **Optimized Images**
- **Progressive Web App Ready**

---

## 🗂️ File Upload & Storage

### Supabase Storage Buckets:
```sql
-- Storage buckets for different file types
CREATE BUCKET 'avatars';        -- Profile pictures
CREATE BUCKET 'resumes';        -- CV/Resume files
CREATE BUCKET 'company-logos';  -- Organization logos  
CREATE BUCKET 'legal-docs';     -- Legal documents
CREATE BUCKET 'company-covers'; -- Cover images
```

### File Policies:
- **Max File Size:** 10MB for documents, 5MB for images
- **Allowed Types:** PDF, DOC, DOCX for resumes; PNG, JPG for images
- **Security:** RLS policies for file access
- **CDN:** Automatic via Supabase

---

## 🧪 Testing

### Test Commands:
```bash
# Run unit tests
npm run test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Linting with auto-fix
npm run lint:fix
```

### Testing Stack:
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing (optional)
- **TypeScript** - Type checking

---

## 🚀 Deployment

### Environment Setup:

#### Development:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

#### Production:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

### Deployment Platforms:

#### **Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Netlify:**
```bash
# Build command
npm run build

# Output directory
out/
```

#### **Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Configuration Files

### **next.config.ts**
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
```

### **tailwind.config.ts**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'samit-navy': '#2B3E7C',
        'samit-orange': '#ff6154',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 📊 Performance Optimization

### Next.js Optimizations:
- **App Router** for improved performance
- **Server Components** by default
- **Image Optimization** with next/image
- **Font Optimization** with next/font
- **Bundle Analyzer** for size monitoring

### Database Optimizations:
- **Indexes** on frequently queried columns
- **RLS Policies** for security & performance
- **Connection Pooling** via Supabase
- **Query Optimization** with proper joins

### Caching Strategy:
- **Static Generation** for public pages
- **ISR (Incremental Static Regeneration)** for dynamic content
- **Client-side Caching** with SWR/React Query
- **CDN Caching** for assets

---

## 🔍 SEO & Analytics

### SEO Optimizations:
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'SAMIT - Japan Employment Opportunities',
  description: 'Find jobs in Japan, learn Japanese, connect with employers',
  keywords: 'japan jobs, japanese language, JLPT, work in japan',
  openGraph: {
    title: 'SAMIT Job Portal',
    description: 'Your gateway to Japan employment',
    images: ['/logo.png'],
  },
}
```

### Analytics Setup:
- **Google Analytics 4**
- **Supabase Analytics**
- **User Behavior Tracking**
- **Conversion Tracking**

---

## 🐛 Troubleshooting

### Common Issues:

#### **Supabase Connection Error:**
```bash
Error: Invalid Supabase URL or Key
```
**Solution:** Check environment variables in `.env.local`

#### **Database Migration Failed:**
```bash
Error: Migration failed
```
**Solution:** 
```bash
npx supabase db reset
npx supabase db push
```

#### **Build Errors:**
```bash
Type error: Property does not exist
```
**Solution:** Run type checking:
```bash
npm run type-check
```

#### **Authentication Issues:**
```bash
Error: User not authenticated
```
**Solution:** Check RLS policies and user session

#### **Admin Access Issues:**
```bash
Error: Insufficient permissions
```
**Solution:** Verify user role is set to 'admin' in profiles table:
```sql
SELECT role FROM profiles WHERE id = 'your-user-id';
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

### Debug Mode:
```bash
# Enable debug logging
DEBUG=* npm run dev

# Supabase debug
NEXT_PUBLIC_SUPABASE_DEBUG=true npm run dev
```

---

## 🔄 Migration & Data Management

### Database Migrations:
```bash
# Create new migration
supabase migration new migration_name

# Reset database (WARNING: This will delete all data!)
supabase db reset

# Apply specific migration
supabase db push

# Generate types from database
supabase gen types typescript --local > types/database.types.ts
```

### Backup & Restore:
```bash
# Backup database
pg_dump your_database_url > backup.sql

# Restore database
psql your_database_url < backup.sql
```

### Seeding Data:
```sql
-- Example: Add sample organizations
INSERT INTO organizations (owner_id, slug, display_name, verification_status)
VALUES 
  ('admin-user-id', 'toyota-japan', 'Toyota Motor Corporation', 'verified'),
  ('admin-user-id', 'sony-japan', 'Sony Corporation', 'verified');

-- Example: Add sample jobs
INSERT INTO jobs (org_id, slug, title, description, employment_type, location_type, category)
SELECT 
  id,
  'software-engineer-tokyo',
  'Software Engineer - Tokyo',
  'Join our engineering team in Tokyo...',
  'fulltime',
  'onsite',
  'jepang'
FROM organizations WHERE slug = 'toyota-japan';
```

---

## 🤝 Contributing

### Development Workflow:
1. **Fork Repository**
2. **Create Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Commit Changes** (`git commit -m 'Add amazing feature'`)
4. **Push to Branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Code Standards:
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional Commits** for commit messages

### Commit Format:
```
feat: add new job filter functionality
fix: resolve authentication redirect issue
docs: update API documentation
style: improve button hover effects
refactor: optimize database queries
test: add unit tests for job components
```

### Pre-commit Checklist:
- [ ] Run `npm run type-check`
- [ ] Run `npm run lint:fix`
- [ ] Test functionality locally
- [ ] Update documentation if needed
- [ ] Add/update tests for new features

---

## 🚨 Security Considerations

### Data Protection:
- **GDPR Compliance** - User data handling
- **Personal Data Encryption** - Sensitive information
- **File Upload Validation** - Prevent malicious uploads
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization

### Authentication Security:
- **Strong Password Requirements**
- **Email Verification Required**
- **JWT Token Expiration**
- **Rate Limiting** on auth endpoints
- **Account Lockout** after failed attempts

### API Security:
- **CORS Configuration**
- **Rate Limiting**
- **Input Validation**
- **Error Handling** (no sensitive data in errors)
- **Logging & Monitoring**

---

## 📞 Support & Contact

### 🏢 SAMIT - Sakura Mitra Indonesia

**📍 Alamat:**
```
Ruko Dalton Utara Blok DLNU 05
Jl. Scientia Square Selatan
Kelurahan Curug Sangereng, Kecamatan Klp. Dua
Kabupaten Tangerang, Banten 15810
```

**📧 Email:** contact@sakuramitra.com  
**🌐 Website:** https://samit.co.id  

### 👨‍💻 Technical Support:
- **GitHub Issues:** Submit bugs and feature requests
- **Documentation:** Check `INFORMATION.md` for detailed role info
- **API Docs:** Available at `/api/docs` (if implemented)
- **Dev Team:** Contact for technical assistance

### 📋 Issue Reporting:
When reporting issues, please include:
- **Environment** (development/production)
- **Browser & Version**
- **Steps to reproduce**
- **Expected vs Actual behavior**
- **Screenshots** (if applicable)
- **Console errors** (if any)

---

## 📜 License

```
Copyright (c) 2025 SAMIT - Sakura Mitra Indonesia

All rights reserved. This software and associated documentation files 
are proprietary and confidential.

Unauthorized copying, modification, distribution, or use of this 
software is strictly prohibited.

For licensing inquiries, contact: contact@sakuramitra.com
```

---

## 🎯 Roadmap

### Phase 1 (Current) - Q1 2025:
- ✅ Core job portal functionality
- ✅ User authentication & roles
- ✅ Organization verification
- ✅ Japanese class integration
- ✅ Responsive design implementation

### Phase 2 - Q2 2025:
- 🔄 Mobile application (React Native)
- 🔄 Advanced search & filters
- 🔄 Real-time notifications (WebSocket)
- 🔄 Video interview integration
- 🔄 Advanced analytics dashboard

### Phase 3 - Q3 2025:
- 🔄 AI-powered job matching
- 🔄 Blockchain certificates for skills
- 🔄 Multi-language support (EN/JP)
- 🔄 Payment integration for premium features
- 🔄 Advanced reporting tools

### Phase 4 - Q4 2025:
- 🔄 International expansion
- 🔄 Enterprise partnerships API
- 🔄 Machine learning recommendations
- 🔄 White-label solutions
- 🔄 Advanced compliance tools

---

## 📈 Performance Metrics

### Target Performance:
- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s

### Monitoring Tools:
- **Vercel Analytics** - Performance monitoring
- **Sentry** - Error tracking
- **Google Analytics** - User behavior
- **Supabase Metrics** - Database performance

---

## 🔧 Maintenance

### Regular Tasks:
- **Weekly:** Security updates, dependency updates
- **Monthly:** Performance optimization, database cleanup
- **Quarterly:** Feature reviews, user feedback analysis
- **Annually:** Security audit, compliance review

### Backup Strategy:
- **Daily:** Automated database backups
- **Weekly:** Full system backup
- **Monthly:** Disaster recovery testing
- **Quarterly:** Backup restoration testing

---

**🚀 Ready to start? Run `npm run dev` and visit http://localhost:3000**

**🔑 Need admin access? Follow the "Default Admin Account" section above**

*Last Updated: January 2025*  
*Made with ❤️ by SAMIT Team*

---

## 📚 Additional Resources

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Supabase Documentation](https://supabase.com/docs)**
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[React Documentation](https://react.dev/)**

For more detailed role and dashboard information, see **[INFORMATION.md](./INFORMATION.md)**
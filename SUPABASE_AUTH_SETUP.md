# Supabase Authentication Setup Guide

## 🎯 What Was Implemented

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)
- Manages authentication state across the app
- Provides `user`, `session`, `loading`, `isAdmin` status
- Methods: `signIn()`, `signOut()`
- Checks admin status against `site_settings.admin_emails` array

### 2. **Admin Login Page** (`src/pages/AdminLogin.tsx`)
- Clean, modern login form
- Email + password authentication
- Error handling
- Auto-redirect to dashboard after login
- Dark mode support

### 3. **Protected Route Component** (`src/components/ProtectedRoute.tsx`)
- Guards admin routes from unauthorized access
- Shows loading state while checking auth
- Redirects to login if not authenticated
- Verifies admin status

### 4. **Admin Dashboard** (`src/pages/AdminDashboard.tsx`)
- Landing page after successful login
- Overview cards for all CMS sections:
  - Hero Images 🖼️
  - Client Logos 🏢
  - Projects 💼
  - Testimonials ⭐
  - Site Settings ⚙️
  - Media Library 📁
- Quick stats display
- Sign out functionality

## 🔐 Routes Added

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Main portfolio (Home with 3 sections) |
| `/admin/login` | Public | Admin login page |
| `/admin/register` | Public* | One-time admin registration (disable after use) |
| `/admin/dashboard` | Protected | Admin dashboard (requires auth + admin status) |

*Security: Set `ALLOW_REGISTRATION = false` in AdminRegister.tsx after creating your admin account.

## ⚙️ Supabase Configuration Steps

### Step 1: Enable Email Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure settings:
   - ✅ Enable email confirmations (optional)
   - ✅ Enable email change confirmations
   - Set email template (optional)

### Step 2: Create Admin User

**Option A: Use the Registration Page (Easiest)**

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/admin/register`
3. Fill in your email and password
4. Click "Create Admin Account"
5. You'll be automatically added to the admin_emails list
6. After successful registration, **disable the registration page**:
   - Open `src/pages/AdminRegister.tsx`
   - Change `const ALLOW_REGISTRATION = true;` to `false`
   - Or delete the file entirely for security

**Option B: Use Supabase Dashboard**

- Go to Authentication → Users
- Click "Invite user"
- Enter admin email
- User will receive invite to set password
- Then manually add email to admin_emails (see Step 3)

**Option C: Manual SQL (Advanced)**

Run this SQL in Supabase SQL Editor:

```sql
-- Create an admin user with password
-- NOTE: Replace with your email and desired password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'your-email@example.com',
  crypt('your-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  ''
);
```

### Step 3: Add Admin Email to Site Settings

**If you used Option A (Registration Page):** This is done automatically! ✅

**If you used Option B or C:** Run this SQL:

```sql
-- Add your admin email to the admin_emails array
UPDATE site_settings
SET admin_emails = ARRAY['your-email@example.com']
WHERE id = 1;

-- Or append to existing admins:
UPDATE site_settings
SET admin_emails = array_append(admin_emails, 'your-email@example.com')
WHERE id = 1;
```

### Step 4: Configure Row Level Security (Already done!)

The `site_settings` table already has RLS policies from your database migration:

```sql
-- Only authenticated users can read site settings
CREATE POLICY "Allow authenticated users to read site_settings"
ON site_settings FOR SELECT
TO authenticated
USING (true);

-- Only users in admin_emails can update
CREATE POLICY "Allow admin users to update site_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (email IN (SELECT unnest(admin_emails) FROM site_settings));
```

## 🧪 Testing the Authentication

### Test Login Flow:
1. Build and run: `npm run dev`
2. Navigate to `/admin/login` 
3. Sign in with admin credentials
4. Should redirect to `/admin/dashboard`
5. Verify sign out works

### Test Protected Routes:
1. Try accessing `/admin/dashboard` without login
2. Should redirect to `/admin/login`
3. Sign in and verify access granted

### Test Admin Status:
1. Sign in with non-admin email
2. Should be denied access (redirected to login)
3. Sign in with admin email from `site_settings.admin_emails`
4. Should grant access to dashboard

## 🔒 Security Features

✅ **Row Level Security (RLS)** - All database tables protected  
✅ **Admin Email Verification** - Checks against `site_settings.admin_emails`  
✅ **Protected Routes** - Redirects unauthorized users  
✅ **Session Management** - Automatic token refresh  
✅ **Auth State Listening** - Real-time auth changes  

## 🎨 UI Features

- Modern gradient design
- Dark mode support
- Loading states
- Error messages
- Responsive layout
- Smooth transitions

## 📝 Environment Variables Required

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🚀 Next Steps

1. **Run the migration** (if not already done):
   ```bash
   # Copy SQL from supabase/migrations/20260122_create_cms_tables.sql
   # Run in Supabase SQL Editor
   ```

2. **Create your admin user** in Supabase Dashboard

3. **Add your email to admin_emails**:
   ```sql
   UPDATE site_settings
   SET admin_emails = ARRAY['your-email@example.com']
   WHERE id = 1;
   ```

4. **Test the login flow**:
   - Visit: `http://localhost:5173/admin/login`
   - Sign in with admin credentials
   - Access dashboard

5. **Build individual admin pages** for each CMS section:
   - Hero Images Manager
   - Client Logos Manager
   - Projects Manager
   - Testimonials Manager
   - Site Settings Editor

## 🔗 Useful Links

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Auth Patterns](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Auth system ready!** 🎉 You can now sign in at `/admin/login` once you configure Supabase.

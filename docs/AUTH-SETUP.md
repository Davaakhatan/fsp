# Authentication Setup Guide

## Quick Start: Create a Test Account

### Method 1: Sign Up Through the App (Easiest)
1. Go to `http://localhost:5175/signup`
2. Fill out the form:
   - School Name: "Phoenix Flight Academy"
   - Contact Name: "John Smith"
   - Email: Any email (e.g., `test@example.com`)
   - Password: `test123456` (minimum 6 characters)
3. Click "Create Account"
4. **Important**: Check your email for verification link (or disable email confirmation - see below)

### Method 2: Disable Email Confirmation (Development Only)
This allows immediate sign-in without verifying email.

1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** > **Settings**
3. Scroll down to **"Email Auth"** section
4. Toggle **OFF**: "Enable email confirmations"
5. Click "Save"
6. Now you can sign up and immediately sign in!

### Method 3: Use Supabase Dashboard to Create Users
1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** > **Users**
3. Click "**Add User**" button
4. Choose "**Create new user**"
5. Enter:
   - **Email**: `demo@flightschool.com`
   - **Password**: `demo123456`
   - **Auto Confirm User**: ✅ (check this box!)
6. Click "Create User"
7. Now you can use the "**Try Demo Account**" button on the sign-in page!

---

## Pre-configured Demo Account

Once you create the demo account, you can use:

**Email**: `demo@flightschool.com`  
**Password**: `demo123456`

Just click "**Try Demo Account**" on the sign-in page!

---

## Testing the Full Flow

1. **Sign Up**: Create an account at `/signup`
2. **Verify Email** (if enabled): Check your inbox
3. **Sign In**: Go to `/signin`
4. **Access Portal**: After signing in, you'll be redirected to `/portal/dashboard`
5. **Test Protected Routes**:
   - `/portal/dashboard` ✅ (accessible)
   - `/portal/bookings` ✅ (accessible)
   - `/portal/weather` ✅ (accessible)
6. **Sign Out**: Click "Sign Out" in navigation
7. **Try Accessing Portal** → Should redirect to `/signin`

---

## Connecting Auth Users to Schools

After creating an auth user, you can optionally link them to a specific school in the database:

```sql
-- Link the authenticated user to a school
INSERT INTO school_admins (school_id, auth_user_id, role, permissions)
VALUES (
  (SELECT id FROM schools WHERE slug = 'phoenix-flight-academy' LIMIT 1),
  'your-auth-user-uuid-here', -- Get this from Supabase > Authentication > Users
  'admin',
  ARRAY['manage_bookings', 'view_analytics', 'manage_weather_alerts']
);
```

---

## Troubleshooting

### "Invalid login credentials"
- Make sure email is verified (or disable email confirmation)
- Check that password is correct
- Ensure user exists in Supabase > Authentication > Users

### "Email not confirmed"
- Check your email inbox for verification link
- OR disable email confirmation in Supabase settings
- OR manually confirm user in Supabase dashboard (edit user → toggle "Email Confirmed")

### "Demo account not set up yet"
- The demo account doesn't exist yet
- Create it manually using Method 3 above
- Or just create your own account through /signup

---

## Security Notes

- **Development**: It's safe to disable email confirmation for testing
- **Production**: Always enable email confirmation for security
- **Passwords**: Use strong passwords in production
- **Demo Account**: Remove or secure the demo account before deploying to production

---

**Ready to test!** Go to `http://localhost:5175/signin` and try it out! 🚀


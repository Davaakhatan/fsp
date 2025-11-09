# User Roles & Access Control Guide

## 🎭 User Types & Roles

### 1. **Public Users** (No Account)
- **Access**: Browse marketplace, search schools, view profiles
- **Cannot**: Access any portal features, save favorites, book flights
- **Pages**: 
  - ✅ Homepage, Search, School Profiles, AI Matching, Comparison, Financing

---

### 2. **School Admin** (Default for Sign Up)
- **Who**: Flight school staff, owners, chief instructors
- **Access**: Manage their own school's operations
- **Sign Up**: Anyone can sign up (becomes school_admin by default)
- **Pages**:
  - ✅ All Public Pages
  - ✅ `/portal/dashboard` - Their school's dashboard
  - ✅ `/portal/bookings` - Their school's bookings
  - ✅ `/portal/weather` - Their school's weather alerts
  - ❌ Cannot see other schools' data
  - ❌ Cannot access admin panel

---

### 3. **Platform Admin** (Super Admin/Admin)
- **Who**: FSP platform administrators
- **Access**: Full platform access, manage all schools
- **Sign Up**: Must be manually upgraded in Supabase
- **Pages**:
  - ✅ All Public Pages
  - ✅ All School Portal Pages (for any school)
  - ✅ `/admin/dashboard` - Platform-wide admin dashboard
  - ✅ Can view/edit all schools
  - ✅ Can manage users and permissions

---

## 🔐 Role Assignment

### Default Role (Sign Up)
```typescript
// When user signs up, they automatically get:
role: 'school_admin'
```

### Admin Roles (Manual Assignment)
Admins must be created manually in Supabase:

1. Go to Supabase Dashboard
2. Authentication > Users > [Select User]
3. Edit "User Metadata"
4. Add:
```json
{
  "role": "admin"
}
```
or
```json
{
  "role": "super_admin"
}
```

---

## 🎨 Different Dashboards by Role

### Current Setup: **Same Sign Up, Different Dashboards**

```
┌─────────────────────────────────────────┐
│         Sign Up Form (Same)             │
│  - Anyone can create account            │
│  - Default role: school_admin           │
└─────────────────────────────────────────┘
                    │
                    ▼
            After Sign In...
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ School Admin │        │Platform Admin│
│   Dashboard  │        │   Dashboard  │
├──────────────┤        ├──────────────┤
│ • Own school │        │ • All schools│
│   stats      │        │ • User mgmt  │
│ • Bookings   │        │ • Analytics  │
│ • Weather    │        │ • Settings   │
│              │        │ • Reviews    │
│ /portal/*    │        │ /admin/*     │
└──────────────┘        └──────────────┘
```

---

## 🚦 Navigation Changes by Role

### **Not Logged In**
```
[Browse Schools] [Find My Match] [Financing] | [Sign In] [Get Started]
```

### **Logged In as School Admin**
```
[Browse Schools] [Find My Match] [Financing] | [Portal ▼] [Sign Out]
                                                   │
                                                   ├─ Dashboard
                                                   ├─ Bookings
                                                   └─ Weather Alerts
```

### **Logged In as Platform Admin**
```
[Browse Schools] [Find My Match] [Financing] | [Admin ▼] [Portal ▼] [Sign Out]
                                                   │         │
                                    Platform Admin Panel    School Portal
                                                   │         │
                                                   └─────────┴─ Both accessible
```

---

## 🔄 Should We Distinguish at Sign Up?

### **Recommendation: NO - Keep it simple**

**Current Approach (Better):**
- ✅ **One sign-up form** for everyone
- ✅ Users become "school_admin" by default
- ✅ Platform admins are upgraded manually
- ✅ Simpler user experience
- ✅ Secure (admins can't self-promote)

**Alternative Approach (Not Recommended):**
- ❌ Separate sign-up forms (School vs Admin)
- ❌ More complex UX
- ❌ Security risk (anyone could choose "admin")
- ❌ Confusion for users

---

## 📋 Implementation Status

### ✅ Completed
- [x] Role-based AuthContext with `isAdmin`, `isSchoolAdmin`
- [x] `ProtectedRoute` for school portal
- [x] `AdminRoute` for platform admin
- [x] Single sign-up form (default to school_admin)
- [x] Admin Dashboard page
- [x] Database RLS policies for roles

### 🔄 To Complete
- [ ] Update Navigation to show "Admin" link for admins
- [ ] Test role-based access
- [ ] Create admin user in Supabase

---

## 🧪 Testing Flow

### Test as School Admin
1. Sign up at `/signup`
2. Sign in at `/signin`
3. Access `/portal/dashboard` ✅
4. Try `/admin/dashboard` ❌ (should show "Access Denied")

### Test as Platform Admin
1. Create account normally
2. Go to Supabase > Authentication > Users > [Your User]
3. Edit User Metadata: `{ "role": "admin" }`
4. Sign in again
5. Access `/portal/dashboard` ✅
6. Access `/admin/dashboard` ✅ (should work!)

---

## 🎯 Summary

| Feature | Public | School Admin | Platform Admin |
|---------|--------|--------------|----------------|
| Browse Marketplace | ✅ | ✅ | ✅ |
| Sign Up | ✅ | - | - |
| School Portal | ❌ | ✅ (own) | ✅ (all) |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Manage All Schools | ❌ | ❌ | ✅ |
| View All Users | ❌ | ❌ | ✅ |

**Bottom Line**: 
- **One sign-up form** for everyone
- **Role determines dashboard** after login
- **Admins promoted manually** for security
- **Clean, simple UX** for users


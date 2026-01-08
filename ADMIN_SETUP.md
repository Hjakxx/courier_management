# Admin Role Setup Guide

## Overview

The Admin role extension has been successfully integrated into the Courier & Logistics Management System. This document explains how the admin role works and how to set up admin accounts.

## Admin Role Integration

### Backend Changes

1. **User Model** (`backend/models/User.js`)
   - Added `role` field with enum: `['user', 'admin']`
   - Default role is `'user'`
   - All new registrations automatically get `'user'` role

2. **JWT Token** (`backend/controllers/authController.js`)
   - JWT now includes `role` information
   - Token payload: `{ id, role }`
   - Login/Register responses include `role` field

3. **Authentication Middleware** (`backend/middleware/auth.js`)
   - `protect` middleware extracts user and includes role
   - Role is available in `req.user.role`

4. **Admin Middleware** (`backend/middleware/isAdmin.js`)
   - New `isAdmin` middleware checks if `req.user.role === 'admin'`
   - Returns 403 if user is not admin

5. **Admin Routes** (`backend/routes/admin.js`)
   - `GET /api/admin/shipments` - View all shipments
   - `PATCH /api/admin/shipments/:id/status` - Update shipment status only
   - `GET /api/admin/users` - View all users
   - All routes protected with `protect` + `isAdmin` middleware

6. **Shipment Controller** (`backend/controllers/shipmentController.js`)
   - `GET /api/shipments` now filters by user for non-admins
   - Admins see all shipments, users see only their own

### Frontend Changes

1. **AuthContext** (`frontend/src/context/AuthContext.js`)
   - User object now includes `role` field
   - Role is stored in localStorage with user data

2. **Admin Dashboard** (`frontend/src/pages/AdminDashboard.js`)
   - New admin-only dashboard
   - Two tabs: Shipments and Users
   - Status update dropdown for each shipment
   - Read-only user list

3. **Admin Route Protection** (`frontend/src/components/AdminRoute.js`)
   - New component to protect admin routes
   - Redirects non-admins to user dashboard
   - Redirects unauthenticated users to login

4. **User Dashboard** (`frontend/src/pages/Dashboard.js`)
   - Shows "Admin Dashboard" button for admins
   - Regular users see only their shipments

## How to Create an Admin User

**Important**: Admin accounts must be created manually in the database. There is no admin registration UI.

### Method 1: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database: `courier-logistics`
3. Navigate to the `users` collection
4. Find the user you want to make admin (or create a new user)
5. Edit the document and add/update the `role` field:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save the document

### Method 2: Using MongoDB Shell

```javascript
// Connect to MongoDB
use courier-logistics

// Update existing user to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

// Or create a new admin user (password will be hashed on first login)
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // You'll need to hash this, or register first then update role
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 3: Register then Update

1. Register a new user through the UI
2. Note the email address
3. Use MongoDB Compass or shell to update that user's role to `'admin'`
4. Logout and login again - the user will now have admin privileges

## Admin Permissions

### What Admins CAN Do:
- ✅ View ALL shipments (not just their own)
- ✅ Update shipment STATUS only (Created, In Transit, Delivered)
- ✅ View all registered users (read-only)
- ✅ Access admin dashboard at `/admin`

### What Admins CANNOT Do:
- ❌ Create shipments (use regular user dashboard)
- ❌ Delete shipments
- ❌ Edit sender, receiver, source, or destination fields
- ❌ Override ownership rules (users still own their shipments)
- ❌ Assign staff or delivery agents

## User Restrictions (Unchanged)

- Users can only see their own shipments
- Users can update/delete ONLY their own shipments
- Users cannot access admin routes (403 Forbidden)
- Users see regular dashboard at `/dashboard`

## API Endpoints

### Admin Endpoints (Protected: Auth + Admin Role)

```
GET    /api/admin/shipments          - Get all shipments
PATCH  /api/admin/shipments/:id/status - Update shipment status
GET    /api/admin/users              - Get all users
```

### Regular Endpoints (Unchanged)

```
POST   /api/auth/register            - Register (role defaults to 'user')
POST   /api/auth/login               - Login (returns role in response)
GET    /api/shipments                - Get shipments (filtered by user for non-admins)
POST   /api/shipments                - Create shipment
GET    /api/shipments/:id            - Get single shipment
PUT    /api/shipments/:id            - Update shipment (owner only)
DELETE /api/shipments/:id            - Delete shipment (owner only)
```

## Frontend Routes

```
/login              - Public login page
/register           - Public registration (creates 'user' role)
/dashboard          - User dashboard (shows admin button if admin)
/admin              - Admin dashboard (admin only)
/create-shipment    - Create shipment (all authenticated users)
/edit-shipment/:id   - Edit shipment (owner only)
```

## Testing Admin Functionality

1. **Create Admin User**:
   - Register a new user
   - Update role to 'admin' in database
   - Logout and login again

2. **Test Admin Access**:
   - Login as admin
   - Should see "Admin Dashboard" button on user dashboard
   - Click to access admin dashboard
   - Should see all shipments and all users

3. **Test Status Update**:
   - In admin dashboard, change shipment status using dropdown
   - Status should update immediately

4. **Test User Restrictions**:
   - Login as regular user
   - Should only see own shipments
   - Should NOT see admin dashboard button
   - Accessing `/admin` should redirect to `/dashboard`

## Security Notes

- Admin routes are protected by both `protect` and `isAdmin` middleware
- JWT tokens include role information
- Frontend checks role before showing admin UI
- Backend validates role on every admin request
- Users cannot escalate their own privileges through the API

## Troubleshooting

**Admin button not showing?**
- Check that user.role === 'admin' in localStorage
- Logout and login again after updating role in database
- Check browser console for errors

**403 Forbidden on admin routes?**
- Verify user role is 'admin' in database
- Check JWT token includes role (decode at jwt.io)
- Ensure middleware is properly checking role

**Admin sees all shipments in user dashboard?**
- This is expected behavior - admins see all shipments everywhere
- Use admin dashboard for better admin-specific UI









# Quick Admin Setup Guide

## ⚡ Fastest Way to Create an Admin

### Step 1: Register a User
1. Go to `http://localhost:3000/register`
2. Register with any email and password (e.g., `admin@test.com` / `password123`)
3. Note the email you used

### Step 2: Make User an Admin

**Option A: Using the Script (Easiest)**
```bash
cd backend
node scripts/createAdmin.js admin@test.com
```

**Option B: Using MongoDB Compass**
1. Open MongoDB Compass
2. Connect to `courier-logistics` database
3. Open `users` collection
4. Find your user by email
5. Click "Edit Document"
6. Add or update: `"role": "admin"`
7. Click "Update"

### Step 3: Login as Admin
1. **Logout** from the application (if you're logged in)
2. Go to `http://localhost:3000/login`
3. Login with the same email and password you registered with
4. You should now see **"Admin Dashboard"** button on the user dashboard
5. Click it or go to `http://localhost:3000/admin`

## ✅ What You Should See

After logging in as admin:
- **User Dashboard**: Shows "Admin Dashboard" button (orange/red gradient)
- **Admin Dashboard**: Accessible at `/admin` with:
  - All shipments (from all users)
  - Status update dropdown for each shipment
  - All registered users list

## 🔍 Troubleshooting

**No "Admin Dashboard" button?**
- Make sure you logged out and logged back in after updating the role
- Check browser console (F12) for errors
- Verify role in MongoDB: `db.users.findOne({email: "your@email.com"})`

**Can't access `/admin`?**
- Make sure role is set to `"admin"` (not `"user"`)
- Logout and login again
- Clear browser localStorage and try again

**Script doesn't work?**
- Make sure MongoDB is running
- Check the email matches exactly (case-insensitive)
- Make sure the user exists (register first if needed)

## 📝 Important Notes

- **Admins use the SAME login page** - there's no separate admin login
- **Role is determined by database**, not by login method
- **All new registrations default to 'user' role**
- **Only admins can access `/admin` route**









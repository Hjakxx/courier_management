# Render Deployment TODO

## Current Progress: 0/12 [ ]

### Preparation Steps (1-4)
- [x] 1. Create frontend/.env.example with REACT_APP_API_URL
- [x] 2. Create backend/.env.example with env vars template
- [x] 3. Fix frontend API URLs to use REACT_APP_API_URL (check/edit AuthContext.js and other axios calls)
- [x] 4. Confirm/ create GitHub repo and push project

### MongoDB Setup (5)
- [ ] 5. User: Create MongoDB Atlas free cluster, get MONGODB_URI

### Render Deployment (6-9)
- [ ] 6. Deploy Backend as Web Service (free tier)
- [ ] 7. Deploy Frontend as Static Site (free tier)
- [ ] 8. Add env vars to Render services (MONGODB_URI, JWT_SECRET)
- [ ] 9. Update frontend REACT_APP_API_URL to backend Render URL

### Post-Deploy (10-12)
- [ ] 10. Run createAdmin script or manual admin setup
- [ ] 11. Test full flow (register, login, shipments)
- [ ] 12. ✅ Complete - URLs provided

## Progress Update: Steps 1-4 ✅

**GitHub Repo**: https://github.com/Hjakxx/courier_management (latest changes pushed)

**Next Manual Steps (Do these in browser):**

### Step 5: MongoDB Atlas Free Cluster
1. https://account.mongodb.com/account/login → Create account
2. "Build a Database" → M0 Free Cluster → Complete setup
3. Database User → Create new (pick username/password)
4. Network Access → "Add IP Address" → 0.0.0.0/0
5. Connect → Drivers → Copy connection string (mongodb+srv://...)
   - Replace `<username>`, `<password>`, add `?retryWrites=true&w=majority`
   - DB Name: `courier-logistics`

### Step 6: Render Backend (Web Service - Free)
1. https://render.com → Login with GitHub
2. New → Web Service → Connect `Hjakxx/courier_management`
3. Root Directory: `backend`
4. Runtime: `Node`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Env Vars:
   ```
   MONGODB_URI = [your atlas uri]
   JWT_SECRET = supersecretlongrandomkeychangeinprod1234567890!@#
   ```
8. Create → Backend URL: https://your-app.onrender.com

### Step 7: Render Frontend (Static Site - Free) 
1. New → Static Site → Same repo
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `build`
5. Env Vars: `REACT_APP_API_URL = https://your-backend.onrender.com`
6. Create → Frontend URL: https://your-frontend.onrender.com

### Step 10: Create Admin (after deploy)
```
cd backend
npm install
node scripts/createAdmin.js your-email@example.com
```

### Step 11: Test
- Visit Frontend URL
- Register/Login
- Create shipment (user)
- Use admin account on Admin Dashboard

### Step 12: Done ✅

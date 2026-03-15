# Render Deployment TODO

## Current Progress: 0/12 [ ]

### Preparation Steps (1-4)
- [x] 1. Create frontend/.env.example with REACT_APP_API_URL
- [x] 2. Create backend/.env.example with env vars template
- [x] 3. Fix frontend API URLs to use REACT_APP_API_URL (check/edit AuthContext.js and other axios calls)
- [ ] 4. Confirm/ create GitHub repo and push project

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

**Next: Starting with env files and API fixes.**

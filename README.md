# Courier & Logistics Management System

A full-stack MERN application for managing courier shipments with user authentication, CRUD operations, and admin role management.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React.js (Functional Components + Hooks)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Role-Based Access Control**: Admin and User roles

## Features

### User Features
- ✅ User Registration & Login
- ✅ JWT-based Authentication
- ✅ Protected Routes (Frontend + Backend)
- ✅ Create Shipment
- ✅ View Own Shipments
- ✅ Update Own Shipments (Full Edit)
- ✅ Delete Own Shipments
- ✅ Modern UI with Animations
- ✅ Dark Theme
- ✅ Responsive Design

### Admin Features
- ✅ Admin Role Management
- ✅ View All Shipments (from all users)
- ✅ Update Shipment Status (Status-only updates)
- ✅ View All Registered Users (Read-only)
- ✅ Admin Dashboard with Tabs
- ✅ Role-Based Route Protection

## Project Structure

```
courier-logistics/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── shipmentController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── isAdmin.js
│   ├── models/
│   │   ├── User.js
│   │   └── Shipment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── shipments.js
│   │   └── admin.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrivateRoute.js
│   │   │   └── AdminRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── CreateShipment.js
│   │   │   ├── EditShipment.js
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── AdminDashboard.css
│   │   │   └── ShipmentForm.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── README.md
├── ADMIN_SETUP.md
└── QUICK_ADMIN_GUIDE.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
# On Windows PowerShell
New-Item .env

# On Linux/Mac
touch .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/courier-logistics
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

5. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication (Public)

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Response: `{ _id, name, email, role, token }`
  - Default role: `'user'`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Response: `{ _id, name, email, role, token }`

### Shipments (Protected - All Authenticated Users)

- `GET /api/shipments` - Get shipments
  - **Users**: Returns only their own shipments
  - **Admins**: Returns all shipments
  - Headers: `Authorization: Bearer <token>`

- `GET /api/shipments/:id` - Get single shipment
  - Headers: `Authorization: Bearer <token>`

- `POST /api/shipments` - Create new shipment
  - Body: `{ trackingId, senderName, receiverName, sourceLocation, destinationLocation, status }`
  - Headers: `Authorization: Bearer <token>`

- `PUT /api/shipments/:id` - Update shipment (only creator)
  - Body: `{ senderName, receiverName, sourceLocation, destinationLocation, status }`
  - Headers: `Authorization: Bearer <token>`
  - **Note**: Only the shipment creator can update

- `DELETE /api/shipments/:id` - Delete shipment (only creator)
  - Headers: `Authorization: Bearer <token>`
  - **Note**: Only the shipment creator can delete

### Admin Routes (Protected - Admin Only)

- `GET /api/admin/shipments` - Get all shipments
  - Headers: `Authorization: Bearer <token>`
  - **Access**: Admin only

- `PATCH /api/admin/shipments/:id/status` - Update shipment status only
  - Body: `{ status: 'Created' | 'In Transit' | 'Delivered' }`
  - Headers: `Authorization: Bearer <token>`
  - **Access**: Admin only
  - **Note**: Admins can only update status, not other fields

- `GET /api/admin/users` - Get all users
  - Headers: `Authorization: Bearer <token>`
  - **Access**: Admin only
  - **Note**: Returns users without passwords

## Data Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, minlength: 6, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Shipment Model

```javascript
{
  trackingId: String (unique, required),
  senderName: String (required),
  receiverName: String (required),
  sourceLocation: String (required),
  destinationLocation: String (required),
  status: String (enum: ['Created', 'In Transit', 'Delivered'], default: 'Created'),
  createdBy: ObjectId (reference to User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## Access Control

### User Permissions
- ✅ Can register and login
- ✅ Can create shipments
- ✅ Can view only their own shipments
- ✅ Can update/delete only their own shipments
- ❌ Cannot access admin routes
- ❌ Cannot see other users' shipments

### Admin Permissions
- ✅ Can do everything users can do
- ✅ Can view ALL shipments (from all users)
- ✅ Can update shipment STATUS only
- ✅ Can view all registered users (read-only)
- ✅ Can access admin dashboard at `/admin`
- ❌ Cannot create shipments through admin dashboard
- ❌ Cannot delete shipments
- ❌ Cannot edit shipment details (sender, receiver, locations)
- ❌ Cannot override ownership rules

### Important Notes
- **Admins use the same login page** - there's no separate admin login
- **Role is determined by database** - not by login method
- **All new registrations default to 'user' role**
- **Admin accounts must be created manually** (see below)

## Creating an Admin User

**Important**: Admin accounts must be created manually. There is no admin registration UI.

### Quick Method (Recommended)

1. **Register a user** through the UI at `http://localhost:3000/register`
2. **Run the admin script**:
   ```bash
   cd backend
   node scripts/createAdmin.js your-email@example.com
   ```
3. **Logout and login again** - you'll now have admin privileges

### Manual Method (MongoDB Compass)

1. Register a user through the UI
2. Open MongoDB Compass
3. Connect to database: `courier-logistics`
4. Go to `users` collection
5. Find your user by email
6. Edit the document and set `role: "admin"`
7. Save and logout/login again

### Using MongoDB Shell

```javascript
use courier-logistics

// Update existing user to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**See `QUICK_ADMIN_GUIDE.md` for step-by-step instructions.**

## Usage

### For Regular Users

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your shipments after logging in
3. **Create Shipment**: Click "New Shipment" to create a new shipment
4. **Edit Shipment**: Click "Edit" on your own shipments to update them
5. **Delete Shipment**: Click "Delete" on your own shipments to remove them

### For Admins

1. **Login**: Use the same login page with admin credentials
2. **User Dashboard**: See "Admin Dashboard" button (orange/red gradient)
3. **Admin Dashboard**: Access at `/admin` or via the button
   - **Shipments Tab**: View all shipments from all users
   - **Users Tab**: View all registered users
   - **Status Updates**: Use dropdown to update shipment status
4. **Regular Features**: Admins can still create shipments like regular users

## Frontend Routes

```
/login              - Public login page (for all users)
/register           - Public registration (creates 'user' role)
/dashboard          - User dashboard (shows admin button if admin)
/admin              - Admin dashboard (admin only, redirects if not admin)
/create-shipment    - Create shipment (all authenticated users)
/edit-shipment/:id   - Edit shipment (owner only)
```

## Security Features

- JWT-based authentication with role information
- Password hashing using bcryptjs
- Protected routes on both frontend and backend
- Role-based access control (RBAC)
- Ownership-based shipment access
- Admin middleware protection
- Token expiration (30 days)

## Troubleshooting

### Common Issues

**Cannot login after registration?**
- Check backend server is running on port 5000
- Check MongoDB connection
- Verify email/password are correct
- Check browser console for errors

**Admin button not showing?**
- Verify user role is 'admin' in database
- Logout and login again after updating role
- Check browser localStorage for user data
- Clear localStorage and try again

**Cannot access admin routes?**
- Verify role is set to 'admin' (not 'user')
- Check JWT token includes role
- Ensure middleware is properly configured
- Logout and login again

**Shipments not showing?**
- Regular users only see their own shipments
- Admins see all shipments
- Check authentication token is valid
- Verify MongoDB connection

## Development

### Backend Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Create admin user
node scripts/createAdmin.js email@example.com
```

### Frontend Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/courier-logistics
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

## Additional Documentation

- **`ADMIN_SETUP.md`** - Detailed admin role documentation
- **`QUICK_ADMIN_GUIDE.md`** - Quick reference for creating admins

## License

This project is created for educational and portfolio purposes.

## Summary of Changes

### Initial Implementation
- User authentication (JWT)
- Shipment CRUD operations
- Ownership-based access control
- Modern UI with dark theme

### Admin Extension (Latest)
- Admin role added to User model
- Admin middleware (`isAdmin`)
- Admin routes and controllers
- Admin dashboard UI
- Role-based shipment filtering
- Status-only update capability for admins
- User management view for admins

/**
 * Helper script to create or update a user to admin role
 * 
 * Usage:
 * node scripts/createAdmin.js <email>
 * 
 * Example:
 * node scripts/createAdmin.js admin@example.com
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node scripts/createAdmin.js <email>');
  console.log('Example: node scripts/createAdmin.js admin@example.com');
  process.exit(1);
}

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/courier-logistics', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.error(`❌ User with email "${email}" not found.`);
      console.log('💡 Please register this user first through the UI, then run this script again.');
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`✅ User "${email}" is already an admin.`);
      process.exit(0);
    }

    // Update to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully updated user "${email}" to admin role.`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Logout from the application (if logged in)`);
    console.log(`   2. Login again with email: ${email}`);
    console.log(`   3. You should now see the "Admin Dashboard" button`);
    console.log(`   4. Access admin dashboard at: http://localhost:3000/admin`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();









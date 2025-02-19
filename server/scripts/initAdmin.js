// backend/scripts/initAdmin.js
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

// Admin credentials - ideally these should be in environment variables
const ADMIN_USERNAME = 'welzyneadmin';
const ADMIN_EMAIL = 'ochiengjoseph122@gmail.com';
const ADMIN_PASSWORD = 'welzynecourier';

export const initAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Hash password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      // Create admin user
      const admin = new User({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        phone: '0112866448', // Placeholder value
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
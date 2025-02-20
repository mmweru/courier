// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user (always as a user role for public signups)
        const user = new User({
            username,
            email,
            phone, // Add phone field
            password: hashedPassword,
            role: 'user' // Always assign 'user' role for public signups
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return user info and token
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const login = async (req, res) => {
    try {
      const { identifier, password } = req.body;
  
      // Special case for admin login
      if (identifier === 'welzyneadmin' && password === 'welzynecourier') {
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) {
          // Create token for admin
          const token = jwt.sign(
            { id: adminUser._id, role: adminUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
  
          return res.json({
            token,
            user: {
              id: adminUser._id,
              username: adminUser.username,
              email: adminUser.email,
              role: adminUser.role
            }
          });
        }
      }
  
      // Regular login flow for other users
      const user = await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier }
        ]
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Return user info and token
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

export const validateToken = async (req, res) => {
  try {
      // Add select to exclude sensitive fields
      const user = await User.findById(req.user.id)
          .select('-password -__v');
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
  } catch (err) {
      console.error('Validate token error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

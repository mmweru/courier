import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import User from '../models/userModel.js';
import { broadcast } from '../server.js';

const router = express.Router();

// Get all users (admin only)
router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Update user status (admin only)
router.patch("/:id/status", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Broadcast status update
        broadcast({
            type: 'USER_UPDATED',
            user
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user status" });
    }
});

// Delete user (admin only)
router.delete("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Broadcast user deletion
        broadcast({
            type: 'USER_DELETED',
            userId: req.params.id
        });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Admin route
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({message: "Welcome Admin"});
});

// User route
router.get("/user", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
    res.json({message: "Welcome User"});
});

// Guest route
router.get("/guest", verifyToken, authorizeRoles("admin", "user", "guest"), (req, res) => {
    res.json({message: "Welcome Guest"});
});

export default router;
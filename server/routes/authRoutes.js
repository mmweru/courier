/ server/routes/authRoutes.js
import express from 'express';
import { register, login, validateToken } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Remove the leading /auth since it's now handled in server.js
router.post('/register', register);
router.post('/login', login);
router.post('/validate', authMiddleware, validateToken);

export default router;

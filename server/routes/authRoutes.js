// backend/routes/authRoutes.js
import express from 'express';
import { register, login, validateToken } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate', authMiddleware, validateToken);

export default router;
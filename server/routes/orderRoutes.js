import express from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrdersByEmail, 
    getOrderById, 
    updateOrderStatus ,
    deleteOrder,
    updateOrderPayment
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get all orders (admin access)
router.get('/', authMiddleware, getAllOrders);

// Delete order by ID
router.delete('/:id', authMiddleware, deleteOrder);

// Get orders by email
router.get('/user/:email', authMiddleware, getOrdersByEmail);

// Get order by ID
router.get('/:id', authMiddleware, getOrderById);

// Update order status
router.patch('/:id/status', authMiddleware, updateOrderStatus);

router.patch('/:id/payment', authMiddleware, updateOrderPayment);



export default router;
import Order from '../models/orderModel.js';
import { broadcast } from '../server.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        
        // Validate required fields
        if (!orderData.id || !orderData.customer || !orderData.email || !orderData.destination || !orderData.pickupLocation) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Create new order
        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        
        // Broadcast new order event via WebSocket
        broadcast({
            type: 'NEW_ORDER',
            order: savedOrder
        });
        
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        
        // Handle duplicate ID error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Order with this ID already exists' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get orders by email
export const getOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders by email:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ id });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Delete order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ id });
        
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Broadcast order deletion event
        broadcast({
            type: 'ORDER_DELETED',
            orderId: id
        });
        
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// In controllers/orderController.js

export const updateOrderPayment = async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentConfirmed, paymentStatus, mpesaConfirmationMessage } = req.body;
      
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { 
          paymentConfirmed, 
          paymentStatus,
          mpesaConfirmationMessage,
          paymentVerificationDate: paymentConfirmed ? new Date() : null,
          paymentVerifiedBy: paymentConfirmed ? req.user.id : null
        },
        { new: true }
      );
      
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // If payment is now confirmed, send email notification
      if (paymentConfirmed && updateOrder.email) {
        try {
          const emailParams = {
            parcelNumber: updatedOrder.id,
            userName: updatedOrder.customer,
            userEmail: updatedOrder.email,
            payment: 'Confirmed (Manual M-Pesa Verification)',
            mpesa: updatedOrder.mpesaNumber,
            price: updatedOrder.amount,
            pickup: updatedOrder.pickupLocation,
            delivery: updatedOrder.destination,
            details: updatedOrder.packageDetails,
            type: updatedOrder.courierType,
            wholeBooking: updatedOrder.wholeBooking ? 'Yes' : 'No'
          };
          
          await emailjs.send('service_dxo1qa8', 'template_ha6frtq', emailParams);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Continue with the response even if email fails
        }
      }
      
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        const updatedOrder = await Order.findOneAndUpdate(
            { id },
            { status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Broadcast order update event
        broadcast({
            type: 'ORDER_UPDATED',
            order: updatedOrder
        });
        
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
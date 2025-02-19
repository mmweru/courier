// routes/mpesaRoutes.js
import express from 'express';
import { initiateSTKPush, checkTransactionStatus } from '../utils/mpesaUtils.js';
import Order from '../models/orderModel.js';
import { broadcast } from '../server.js';

const router = express.Router();

// Initiate STK push
router.post('/stkpush', async (req, res) => {
  try {
    const { phoneNumber, amount, orderId } = req.body;

    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number, amount, and order ID are required' 
      });
    }

    // Get the order to use as reference
    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Initiate STK push
    const result = await initiateSTKPush(
      phoneNumber,
      amount,
      orderId, // Use order ID as account reference
      `Payment for order ${orderId}`
    );

    // Store the CheckoutRequestID in the database for later verification
    order.mpesaCheckoutRequestId = result.CheckoutRequestID;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'STK push initiated',
      data: result
    });
  } catch (error) {
    console.error('Error in STK push:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate STK push'
    });
  }
});

// MPesa callback endpoint
router.post('/callback', async (req, res) => {
  try {
    const { Body } = req.body;
    
    // Ensure we have a valid callback response
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ success: false, message: 'Invalid callback data' });
    }
    
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
    
    // Find the order by CheckoutRequestID
    const order = await Order.findOne({ mpesaCheckoutRequestId: CheckoutRequestID });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Process the payment result
    if (ResultCode === 0) {
      // Success - extract payment details
      const paymentDetails = {};
      
      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach(item => {
          if (item.Name === 'Amount') paymentDetails.amount = item.Value;
          if (item.Name === 'MpesaReceiptNumber') paymentDetails.receiptNumber = item.Value;
          if (item.Name === 'TransactionDate') paymentDetails.transactionDate = item.Value;
          if (item.Name === 'PhoneNumber') paymentDetails.phoneNumber = item.Value;
        });
      }
      
      // Update order with payment details
      order.paymentConfirmed = true;
      order.mpesaReceiptNumber = paymentDetails.receiptNumber;
      order.mpesaTransactionDate = paymentDetails.transactionDate;
      await order.save();
      
      // Broadcast the update to connected clients
      broadcast({
        type: 'ORDER_UPDATED',
        order
      });
    } else {
      // Payment failed - update order and broadcast
      order.paymentStatus = 'Failed';
      order.paymentMessage = ResultDesc;
      await order.save();
      
      broadcast({
        type: 'PAYMENT_FAILED',
        orderId: order.id,
        message: ResultDesc
      });
    }
    
    // Respond to the callback
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing MPesa callback:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check transaction status
router.post('/status', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;
    
    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Checkout Request ID is required'
      });
    }
    
    const result = await checkTransactionStatus(checkoutRequestId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error checking transaction status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check transaction status'
    });
  }
});

export default router;
// In models/Order.js

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered'],
    default: 'Order Placed'
  },
  date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  packageDetails: {
    type: String,
    required: true
  },
  courierType: {
    type: String,
    enum: ['standard', 'express', 'same-day'],
    default: 'standard'
  },
  wholeBooking: {
    type: Boolean,
    default: false
  },
  paymentVerificationDate: {
    type: Date
  },
  paymentVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
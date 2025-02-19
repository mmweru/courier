import React, { useState } from 'react';

const OrderTracking = () => {
  const [orderID, setOrderID] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const trackOrder = () => {
    // Simulate order tracking
    setOrderStatus('In Transit');
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold text-center">Track Your Order</h2>
      <div className="mt-5">
        <input
          type="text"
          value={orderID}
          onChange={(e) => setOrderID(e.target.value)}
          placeholder="Enter your Order ID"
          className="px-3 py-2 border rounded"
        />
        <button onClick={trackOrder} className="px-5 py-2 bg-yellow-500 text-white rounded ml-3">
          Track Order
        </button>
      </div>

      {orderStatus && <p className="mt-3">Order Status: {orderStatus}</p>}
    </div>
  );
};

export default OrderTracking;

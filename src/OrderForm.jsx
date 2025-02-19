import React, { useState } from 'react';

const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    clientName: 'John Doe',
    productName: 'Electronics',
    description: 'Laptop',
    weight: 3,
    parcelCharges: 45,
    paymentMethod: 'Mpesa',
  });

  const handlePaymentChange = (e) => {
    setOrderData({ ...orderData, paymentMethod: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit to confirm order
    console.log(orderData);
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold text-center">Order Confirmation</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-4">
          <label className="block">Client Name: {orderData.clientName}</label>
          <p>Product: {orderData.productName}</p>
          <p>Description: {orderData.description}</p>
          <p>Weight: {orderData.weight} kg</p>
          <p>Charges: ${orderData.parcelCharges}</p>
        </div>

        <div className="mb-4">
          <label className="block">Payment Method</label>
          <select value={orderData.paymentMethod} onChange={handlePaymentChange} className="w-full px-3 py-2 border rounded">
            <option value="Mpesa">Mpesa</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <button type="submit" className="px-5 py-2 bg-green-500 text-white rounded">
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

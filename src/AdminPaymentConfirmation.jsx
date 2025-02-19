import React, { useState } from 'react';

const AdminPaymentConfirmation = () => {
  const [paymentStatus, setPaymentStatus] = useState(false);

  const handlePaymentConfirm = () => {
    setPaymentStatus(true); // Mark as paid
    // Further logic to save the confirmation and notify client
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold text-center">Payment Confirmation</h2>
      <div className="mt-5">
        <p>Payment for the parcel has been made? Confirm below:</p>
        <button onClick={handlePaymentConfirm} className="px-5 py-2 bg-blue-500 text-white rounded">
          Confirm Payment
        </button>
      </div>

      {paymentStatus && <p className="text-green-500 mt-3">Payment confirmed. Order processing...</p>}
    </div>
  );
};

export default AdminPaymentConfirmation;

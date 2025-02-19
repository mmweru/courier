import React, { useState } from 'react';

const AdminForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    productName: '',
    description: '',
    weight: '',
    from: '',
    to: '',
    time: '',
    parcelCharges: 0,
  });

  const calculateCharges = () => {
    const weightCharge = formData.weight * 10; // base charge per kg
    const distanceCharge = Math.abs(formData.to - formData.from) * 5; // distance-based charge
    setFormData({ ...formData, parcelCharges: weightCharge + distanceCharge });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to server or store
    console.log(formData);
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold text-center">Admin Parcel Form</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-4">
          <label className="block">Client Name</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Product Name</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            onBlur={calculateCharges}
          />
        </div>

        <div className="mb-4">
          <label className="block">From</label>
          <input
            type="text"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">To</label>
          <input
            type="text"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Delivery Time</label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block">Parcel Charges</label>
          <input
            type="number"
            value={formData.parcelCharges}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-200"
          />
        </div>

        <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminForm;

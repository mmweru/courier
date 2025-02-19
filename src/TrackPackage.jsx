import React, { useState } from 'react';
import './TrackPackage.css';  // Add necessary styles for this section

const TrackPackage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackPackage = async () => {
    setLoading(true);
    // Simulate a tracking API call (replace with real API logic)
    setTimeout(() => {
      setPackageInfo({
        status: 'In Transit',
        currentLocation: 'Nairobi, Kenya',
        estimatedDelivery: '2025-01-16',
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="track-package-container">
      <h2 className="text-4xl font-bold text-center text-white mt-28 mb-8">Track Your Package</h2>
      
      <div className="track-package-form max-w-lg mx-auto bg-gray-700  p-8 rounded-lg shadow-lg">
        <label htmlFor="tracking-number" className="block mb-2 text-gray-300">Enter Tracking Number</label>
        <input
          type="text"
          id="tracking-number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter Tracking Number"
        />
        <button
          onClick={handleTrackPackage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg mt-4"
        >
          Track Package
        </button>
      </div>

      {loading && <div className="text-center text-white mt-4">Loading...</div>}

      {packageInfo && (
        <div className="package-info mt-8 text-center  mb-10 text-white">
          <h3 className="text-2xl font-semibold">Package Status: {packageInfo.status}</h3>
          <p>Current Location: {packageInfo.currentLocation}</p>
          <p>Estimated Delivery: {packageInfo.estimatedDelivery}</p>
        </div>
      )}
    </div>
  );
};

export default TrackPackage;

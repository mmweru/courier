import React, { useState } from 'react';
import './bookAppointment.css';
import { loadScript } from 'react-helmet';

const BookAppointment = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [packageType, setPackageType] = useState('');
  const [courierType, setCourierType] = useState('');
  const [paymentOption, setPaymentOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you will integrate API to send form data (e.g., email or database storage)
    alert('Booking Successful!');
  };

  return (
    <div className="booking-page bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 min-h-screen text-white font-jacques">
      <div className="container px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 animate__animated animate__fadeIn">Book a Courier</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 animate__animated animate__fadeIn animate__delay-1s">
          {/* Pickup Location */}
          <div>
            <label htmlFor="pickup-location" className="block text-lg font-semibold">Pickup Location</label>
            <input
              type="text"
              id="pickup-location"
              className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
              placeholder="Enter pickup address"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          {/* Delivery Location */}
          <div>
            <label htmlFor="delivery-location" className="block text-lg font-semibold">Delivery Location</label>
            <input
              type="text"
              id="delivery-location"
              className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
              placeholder="Enter delivery address"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
            />
          </div>

          {/* Package Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="weight" className="block text-lg font-semibold">Package Weight (kg)</label>
              <input
                type="number"
                id="weight"
                className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                placeholder="Enter package weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="dimensions" className="block text-lg font-semibold">Package Dimensions (cm)</label>
              <input
                type="text"
                id="dimensions"
                className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                placeholder="Enter package dimensions (L x W x H)"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="package-type" className="block text-lg font-semibold">Package Type</label>
              <select
                id="package-type"
                className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
              >
                <option value="">Select package type</option>
                <option value="fragile">Fragile</option>
                <option value="liquid">Liquid</option>
                <option value="perishable">Perishable</option>
              </select>
            </div>
          </div>

          {/* Courier Type Selection */}
          <div>
            <label htmlFor="courier-type" className="block text-lg font-semibold">Courier Type</label>
            <select
              id="courier-type"
              className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
              value={courierType}
              onChange={(e) => setCourierType(e.target.value)}
            >
              <option value="">Select courier type</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="same-day">Same-day</option>
            </select>
          </div>

          {/* Payment Option */}
          <div>
            <label htmlFor="payment-option" className="block text-lg font-semibold">Payment Option</label>
            <select
              id="payment-option"
              className="w-full p-4 mt-2 bg-gray-800 text-white rounded-lg focus:outline-none"
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
            >
              <option value="">Select payment option</option>
              <option value="mpesa">MPESA</option>
              <option value="credit-card">Credit Card</option>
            </select>
          </div>

          <button type="submit" className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300">
            Book Courier
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;

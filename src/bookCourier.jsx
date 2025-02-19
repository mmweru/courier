import React from 'react';
import './homepage.css';
import emailjs from '@emailjs/browser';


const bookCourier = () => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
  
    useEffect(() => {
      emailjs.init('WdN8teWHYoFcWl3S3');
    }, []);
  
    const sendMail = (e) => {
      e.preventDefault(); // Prevent form default submission
      const params = {
        pickup: document.getElementById('pickup-location').value,
        delivery: document.getElementById('delivery-location').value,
        details: document.getElementById('package-details').value,
        type: document.getElementById('courier-type').value,
        payment: document.getElementById('payment-option').value,
      };
  
      emailjs
        .send('service_dxo1qa8', 'template_ha6frtq', params)
        .then(() => {
          alert('Email Sent Successfully!');
          // Optional: Reset the form
          document.getElementById('booking-form').reset();
        })
        .catch((error) => {
          console.error('Email Send Error:', error);
          alert('Failed to send email. Please try again.');
        });
    };

  return (
    <div id="book-a-courier" className="py-16 px-4 neon-blue-background text-white">
    <h2 className="text-4xl font-bold text-center mb-8">Book a Courier</h2>
    <form
      id="booking-form"
      className="max-w-4xl mx-auto bg-gray-700 p-8 rounded-lg shadow-lg space-y-6"
      onSubmit={sendMail}
    >
      <div>
        <label htmlFor="pickup-location" className="block mb-2 text-gray-300">
          Pickup Location
        </label>
        <input
          type="text"
          id="pickup-location"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter Pickup Address"
        />
      </div>

      <div>
        <label htmlFor="delivery-location" className="block mb-2 text-gray-300">
          Delivery Location
        </label>
        <input
          type="text"
          id="delivery-location"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter Delivery Address"
        />
      </div>

      <div>
        <label htmlFor="package-details" className="block mb-2 text-gray-300">
          Package Details
        </label>
        <textarea
          id="package-details"
          rows="4"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Describe the package (weight, dimensions, type, etc.)"
        ></textarea>
      </div>

      <div>
        <label htmlFor="courier-type" className="block mb-2 text-gray-300">
          Courier Type
        </label>
        <select
          id="courier-type"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="standard">Standard</option>
          <option value="express">Express</option>
          <option value="same-day">Same-day</option>
        </select>
      </div>

      <div>
        <label htmlFor="payment-option" className="block mb-2 text-gray-300">
          Payment Option
        </label>
        <input
          type="text"
          id="payment-option"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="MPESA Number"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg transition-all"
      >
        Submit Booking
      </button>
    </form>
  </div>
  )
}

export default bookCourier

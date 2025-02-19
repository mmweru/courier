import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import truckImage from './assets/my_truck.png';
import logoImage from './assets/wcs.png';
import WhoWeAre from './whoweare';
import ScrollArrow from './ScrollArrow';
import './homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/+254112866448?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.75) {
            section.classList.add('fade-in');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-r from-black via-blue-800 to-blue-900 text-white font-jacques min-h-screen">
      {/* Responsive Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 shadow-lg z-50 px-4 md:px-6 py-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <img src={logoImage} alt="Welzyne Logo" className="w-14 h-5" />
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 items-center">
            {['Home', 'Who We Are', 'Services', 'Contact Us'].map((label) => (
              <li 
                key={label}
                className="text-gray-300 hover:text-white cursor-pointer"
                onClick={() => scrollToSection(label.toLowerCase().replace(/\s+/g, '-'))}
              >
                {label}
              </li>
            ))}
            <li className="text-gray-300 hover:text-white cursor-pointer" onClick={() => navigate('/login')}>
              Login
            </li>
            <li className="text-gray-300 hover:text-white cursor-pointer" onClick={() => navigate('/signup')}>
              Sign Up
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="md:hidden mt-4 space-y-4 pb-4">
            {['Home', 'Who We Are', 'Services', 'Contact Us'].map((label) => (
              <li 
                key={label}
                className="text-gray-300 hover:text-white cursor-pointer px-4 py-2"
                onClick={() => scrollToSection(label.toLowerCase().replace(/\s+/g, '-'))}
              >
                {label}
              </li>
            ))}
            <li className="text-gray-300 hover:text-white cursor-pointer px-4 py-2" onClick={() => navigate('/login')}>
              Login
            </li>
            <li className="text-gray-300 hover:text-white cursor-pointer px-4 py-2" onClick={() => navigate('/signup')}>
              Sign Up
            </li>
          </ul>
        )}
      </nav>

      {/* Responsive Hero Section */}
      <div id="home" className="fade-section pt-24 md:pt-32 px-4 md:px-8" ref={(el) => (sectionsRef.current[0] = el)}>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-7xl mx-auto">
          <div className="text-center lg:text-left max-w-lg space-y-4 w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold animate-bounce-in">
              Welzyne Courier Services
            </h1>
            <p className="text-gray-300 animate-fade-in text-lg md:text-xl">
              Reliable and efficient delivery services at your fingertips.
            </p>
            <button 
              className="cta-button animate-fade-in text-lg md:text-xl px-6 md:px-8 py-3 md:py-4" 
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
          </div>
          <div className="w-full lg:w-1/2 animate-bounce-in">
            <img 
              src={truckImage} 
              alt="Truck" 
              className="w-full max-w-2xl mx-auto"
            />
          </div>
        </div>
        <ScrollArrow targetId="who-we-are" />
      </div>

      <WhoWeAre />

      {/* Responsive Services Section */}
      <div id="services" className="py-16 md:py-20">
        <h2 className="text-4xl md:text-5xl text-center font-bold mt-8 md:mt-12 mb-8 md:mb-12 animate-fade-in">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4 md:px-8">
          {[
            {
              icon: '🚚',
              title: 'Express Delivery',
              description: 'Fast and reliable delivery across all 7 counties in Kenya.',
            },
            {
              icon: '💵',
              title: 'Affordable Prices',
              description: 'Competitive pricing tailored to your budget.',
            },
            {
              icon: '📦',
              title: 'Same Day Shipping',
              description: 'Get your parcels delivered on the same day.',
            },
            {
              icon: '🌍',
              title: 'International Freight',
              description: 'Seamless international shipping solutions.',
            },
            {
              icon: '🏠',
              title: 'Warehousing',
              description: 'Secure storage solutions for your goods.',
            },
            {
              icon: '📊',
              title: 'Custom Logistics',
              description: 'Tailored logistics plans to meet your needs.',
            },
          ].map((service, index) => (
            <div
              key={index}
              className="service-card bg-blue-600 p-4 md:p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">{service.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-200 text-sm md:text-base">{service.description}</p>
            </div>
          ))}
        </div>
        <ScrollArrow targetId="contact-us" />
      </div>

      {/* Responsive Contact Section */}
      <footer id="contact-us" className="fade-section bg-black text-center py-16 md:py-20 px-4 md:px-8" ref={(el) => (sectionsRef.current[2] = el)}>
        <h2 className="text-2xl md:text-3xl font-bold animate-fade-in">Contact Us</h2>
        <p className="mt-4 animate-fade-in">Need assistance? Reach out to us!</p>
        <div className="mt-6 space-y-4 animate-fade-in">
          <a href="mailto:ochiengjoseph122@gmail.com" className="block text-blue-400 hover:text-blue-300">
            info@welzyne.com
          </a>
          <a href="https://wa.me/+254112866448" target="_blank" rel="noopener noreferrer" className="block text-green-400 hover:text-green-300">
            WhatsApp
          </a>
        </div>
        <div className="mt-8 max-w-md mx-auto animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4 px-4 md:px-0">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full p-2 md:p-3 rounded-lg bg-gray-800 text-white"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full p-2 md:p-3 rounded-lg bg-gray-800 text-white"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className="w-full p-2 md:p-3 rounded-lg bg-gray-800 text-white"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button type="submit" className="cta-button w-full">
              Send Message
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
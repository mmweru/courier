import React, { useEffect, useState } from 'react';
import './whoweare.css';
import ScrollArrow from './ScrollArrow';

const WhoWeAre = () => {
  const [headerText, setHeaderText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [counties, setCounties] = useState(0);
  const [users, setUsers] = useState(0);

  const words = ['Fast', 'Vast', 'Last', 'Cast', 'Past'];

  useEffect(() => {
    let charIndex = 0;
    const typeWord = () => {
      const word = words[currentWordIndex];
      setHeaderText(word.slice(0, charIndex + 1));
      charIndex++;
      if (charIndex === word.length) {
        setTimeout(() => {
          charIndex = 0;
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 1000);
      }
    };
    const typingInterval = setInterval(typeWord, 100);
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  useEffect(() => {
    const countiesInterval = setInterval(() => {
      setCounties((prev) => {
        if (prev < 47) return prev + 0.5;
        clearInterval(countiesInterval);
        return prev;
      });
    }, 15);

    const usersInterval = setInterval(() => {
      setUsers((prev) => {
        if (prev < 30000) return prev + 100;
        clearInterval(usersInterval);
        return prev;
      });
    }, 5);

    return () => {
      clearInterval(countiesInterval);
      clearInterval(usersInterval);
    };
  }, []);

  return (
    <div
      id="who-we-are"
      className="bg-gradient-to-r from-black via-blue-900 to-blue-500 min-h-screen text-white font-jacques px-6 sm:px-12 py-16 flex flex-col items-center"
    >
      <div className="text-center space-y-6 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Leading Kenya’s Shipment Revolution – Reliable. Affordable. <span className="typewriter">{headerText}</span>
        </h1>
        <p className="text-lg text-gray-300">
          At Welzyne Courier Services, we aim to redefine logistics with a perfect blend of technology, reliability, and affordability. Join us on our mission to serve all 47 counties with unmatched efficiency.
        </p>
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="stat bg-white text-blue-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-5xl font-bold">{Math.floor(counties)}</h2>
          <p className="text-gray-700 text-lg">Counties Served</p>
        </div>
        <div className="stat bg-white text-blue-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-5xl font-bold">{users.toLocaleString()}+</h2>
          <p className="text-gray-700 text-lg">Target Users</p>
        </div>
        <div className="stat bg-white text-blue-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-5xl font-bold">99%</h2>
          <p className="text-gray-700 text-lg">Customer Satisfaction</p>
        </div>
      </div>

      <div className="mt-16 text-center max-w-2xl">
        <p className="text-gray-300 text-lg">
          Our vision is to empower businesses and individuals by offering seamless, fast, and reliable shipment services tailored to meet your needs.
        </p>
      </div>
      <ScrollArrow targetId="services" />
    </div>
  );
};

export default WhoWeAre;
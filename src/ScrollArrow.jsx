import React from 'react';

const ScrollArrow = ({ targetId }) => {
  const scrollToSection = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      onClick={scrollToSection}
      className="flex flex-col items-center cursor-pointer animate-bounce hover:scale-110 transition-transform duration-300 my-8"
    >
      <div className="w-8 h-8 border-b-4 border-r-4 border-white transform rotate-45 opacity-75" />
      <div className="w-8 h-8 border-b-4 border-r-4 border-white transform rotate-45 -mt-4 opacity-50" />
    </div>
  );
};

export default ScrollArrow;
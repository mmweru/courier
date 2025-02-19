import React from 'react';
import Navbar from './Navbar';  // Import the Navbar
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This is where the individual page content will be rendered */}
      </main>
    </div>
  );
};

export default Layout;

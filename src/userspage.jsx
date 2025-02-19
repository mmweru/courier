import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

const UsersPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-black via-blue-900 to-blue-800 min-h-screen text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 shadow-lg z-50 flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-xl font-bold text-white">Welzyne</Link>
        <ul className="flex space-x-8">
          <li><Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
          <li><Link to="/order-tracking" className="hover:text-blue-400">Order Tracking</Link></li>
          <li><Link to="/profile" className="hover:text-blue-400">Profile</Link></li>
        </ul>

        {/* Profile Icon Dropdown */}
        <div className="relative">
          <FaUserCircle 
            className="text-3xl cursor-pointer hover:text-blue-400" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black text-white border border-gray-700 rounded-lg shadow-lg">
              <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-800">
                <MdAccountCircle className="mr-2" /> Account Settings
              </Link>
              <button className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-800">
                <IoMdLogOut className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="mt-20 text-center p-6">
        <h1 className="text-5xl font-bold">Welcome to Your Dashboard</h1>
        <p className="text-gray-300 mt-4">Manage your orders, track shipments, and update your profile.</p>
      </div>
    </div>
  );
};

export default UsersPage;

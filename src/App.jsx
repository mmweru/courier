// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import WhoWeAre from './whoweare';
import TrackPackage from './TrackPackage';
import Login from './login';
import Signup from './signup';
import ProtectedRoute from './context/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import Unauthorized from './Unauthorized';
import './style.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/track-a-package" element={<TrackPackage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />


         {/* protected routes */}
         <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/user" 
            element={
              <ProtectedRoute roles={['admin', 'user']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
         <Route path='/guest' element={
           <ProtectedRoute roles={['admin', 'user', 'guest']}>
           <Homepage />
         </ProtectedRoute>
         }
         ></Route>

      </Routes>
    </Router>
  );
};

export default App;

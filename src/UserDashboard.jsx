import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, Clock, User, ChevronRight, Search } from './CustomIcons';
import { useAuth } from './context/AuthContext';

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showTrackingResult, setShowTrackingResult] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [orders, setOrders] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState([
    { title: 'Active Orders', value: '0', icon: Package, color: 'bg-blue-500' },
    { title: 'In Transit', value: '0', icon: Truck, color: 'bg-green-500' },
    { title: 'Pending', value: '0', icon: Clock, color: 'bg-yellow-500' }
  ]);

  // Fetch user's orders
  useEffect(() => {
    if (user && !loading) {
      fetchUserOrders();
      const ws = new WebSocket('ws://localhost:7001');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (user && (
            (data.type === 'NEW_ORDER' && data.order.email === user.email) ||
            (data.type === 'ORDER_UPDATED' && data.order.email === user.email) ||
            (data.type === 'ORDER_DELETED' && orders.some(o => o.id === data.orderId))
          )) {
          fetchUserOrders();
        }
      };
      return () => {
        if (ws.readyState === 1) ws.close();
      };
    }
  }, [user, loading]);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/orders/user/${user.email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const userOrders = response.data;
      setOrders(userOrders);
      const recent = userOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          destination: order.destination,
          status: order.status,
          date: new Date(order.date).toLocaleDateString()
        }));
      setRecentDeliveries(recent);
      const activeCount = userOrders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled').length;
      const inTransitCount = userOrders.filter(order => order.status === 'In Transit').length;
      const pendingCount = userOrders.filter(order => order.status === 'Order Placed' || order.status === 'Processing').length;
      setDeliveryStats([
        { title: 'Active Orders', value: activeCount.toString(), icon: Package, color: 'bg-blue-500' },
        { title: 'In Transit', value: inTransitCount.toString(), icon: Truck, color: 'bg-green-500' },
        { title: 'Pending', value: pendingCount.toString(), icon: Clock, color: 'bg-yellow-500' }
      ]);
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    }
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setShowTrackingResult(true);
  };

  const getTrackingStatus = () => {
    const order = orders.find(o => o.id === trackingNumber);
    if (!order) return [{ status: 'Order Not Found', date: '', completed: false }];
    const baseSteps = [
      { status: 'Order Placed', date: order.date, completed: true },
      { status: 'Processing', date: '', completed: false },
      { status: 'In Transit', date: '', completed: false },
      { status: 'Out for Delivery', date: '', completed: false },
      { status: 'Delivered', date: '', completed: false }
    ];
    const statusIndex = {
      'Order Placed': 0,
      'Processing': 1,
      'In Transit': 2,
      'Out for Delivery': 3,
      'Delivered': 4
    };
    const currentIndex = statusIndex[order.status] || 0;
    return baseSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex
    }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-6 font-['Jacques_Francois']">
      {/* Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/90 to-darkblue-800/80" />
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-silver/50 to-transparent transform"
              style={{ top: `${i * 5}vh`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-silver/50 to-transparent transform"
              style={{ left: `${i * 5}vw`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white animate-fadeIn">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.username || 'User'}</h1>
          <p className="text-blue-200">Track your deliveries and manage your orders</p>
        </div>

        {/* Track Parcel Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Track Your Parcel</h2>
          <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              className="flex-1 p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring focus:ring-blue-500"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors duration-300 flex items-center justify-center"
            >
              <Search size={20} className="mr-2" />
              Track
            </button>
          </form>

          {showTrackingResult && trackingNumber && (
            <div className="mt-6 bg-white/5 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Tracking: {trackingNumber}</h3>
              <div className="relative">
                {getTrackingStatus().map((step, index) => (
                  <div key={index} className="flex mb-6 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{step.status}</p>
                      <p className="text-blue-200 text-sm">{step.date || 'Pending'}</p>
                    </div>
                    {index < getTrackingStatus().length - 1 && (
                      <div className={`absolute left-4 top-8 w-0.5 h-6 ${
                        step.completed && getTrackingStatus()[index + 1].completed
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {deliveryStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:bg-white/20"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`${stat.color} p-3 rounded-full w-fit mb-4`}>
                <stat.icon size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">{stat.value}</h2>
              <p className="text-blue-200">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Recent Deliveries</h2>
          {recentDeliveries.length > 0 ? (
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="bg-white/5 rounded-lg p-4 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                    <div>
                      <h3 className="font-bold">{delivery.id}</h3>
                      <p className="text-blue-200">{delivery.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        delivery.status === 'Delivered' ? 'text-green-400' : 
                        delivery.status === 'In Transit' ? 'text-yellow-400' : 'text-blue-200'
                      }`}>
                        {delivery.status}
                      </p>
                      <p className="text-sm text-blue-200">{delivery.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-blue-200">No deliveries found.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <button
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white transition-all duration-300 hover:bg-white/20 text-left flex items-center justify-between"
            onClick={() => setShowProfileDetails(!showProfileDetails)}
          >
            <div className="flex items-center gap-4">
              <User size={24} />
              <span className="text-lg">Profile</span>
            </div>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Profile Details */}
        {showProfileDetails && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Profile Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="mb-2"><strong>Name:</strong> {user?.username}</p>
                <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
                <p className="mb-2"><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="mb-2"><strong>Total Orders:</strong> {orders.length}</p>
                <p className="mb-2"><strong>Membership:</strong> {user?.membershipType || 'Standard'}</p>
                <p className="mb-2"><strong>Account Status:</strong> <span className="text-green-400">Active</span></p>
              </div>
            </div>
          </div>
        )}

        {/* All Orders */}
        {orders.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-4">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Destination</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">{order.id}</td>
                      <td className="px-4 py-3">{order.date}</td>
                      <td className="px-4 py-3">{order.destination}</td>
                      <td className="px-4 py-3">KES {order.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'In Transit' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
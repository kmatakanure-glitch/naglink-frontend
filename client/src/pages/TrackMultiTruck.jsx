import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const TrackMultiTruck = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.get(`/multi-truck/track/${orderId}`);
      setOrderData(response.data);
      toast.success(`Found order with ${response.data.summary.totalTrucks} trucks!`);
    } catch (error) {
      toast.error('Order not found');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      assigned: '📋',
      loading: '📦',
      in_transit: '🚚',
      offloading: '📋',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '🚚';
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-gray-100 text-gray-800',
      loading: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-blue-100 text-blue-800',
      offloading: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Track Your Fleet</h1>
            <p className="text-gray-600 mt-2">Enter your order ID to see status of all trucks</p>
          </div>

          <form onSubmit={handleTrack} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track Fleet'}
              </button>
            </div>
          </form>

          {orderData && (
            <div>
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Order #{orderData.order.id}</h2>
                <p className="mb-4">Customer: {orderData.order.customer?.username}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Total Trucks</p>
                    <p className="text-2xl font-bold">{orderData.summary.totalTrucks}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">In Transit</p>
                    <p className="text-2xl font-bold text-yellow-300">{orderData.summary.inTransitTrucks}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Delivered</p>
                    <p className="text-2xl font-bold text-green-300">{orderData.summary.completedTrucks}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Progress</p>
                    <p className="text-2xl font-bold">{Math.round(orderData.summary.progressPercentage)}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-green-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${orderData.summary.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Route Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">📍 Pickup Location</p>
                    <p className="font-semibold">{orderData.order.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">🎯 Delivery Location</p>
                    <p className="font-semibold">{orderData.order.deliveryLocation}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">📦 {orderData.order.goodsDescription} - {orderData.order.weight} kg</p>
              </div>

              {/* Trucks List */}
              <h3 className="text-xl font-bold mb-4">🚛 Fleet Status</h3>
              <div className="space-y-4">
                {orderData.order.trucks.map((truck, index) => (
                  <div key={truck.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getStatusIcon(truck.status)}</span>
                          <p className="font-bold text-lg">
                            Truck {index + 1}: {truck.truck?.truckName}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(truck.status)}`}>
                            {truck.status?.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600">License: {truck.truck?.licensePlate}</p>
                        <p className="text-gray-600">Capacity: {truck.truck?.capacity}</p>
                        {truck.packageNumber && (
                          <p className="text-gray-600">Package #: {truck.packageNumber}</p>
                        )}
                        {truck.driver && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>👨‍✈️ Driver: {truck.driver.username}</p>
                            <p>📞 Contact: {truck.driver.phone || 'N/A'}</p>
                            <p>📧 Email: {truck.driver.email}</p>
                          </div>
                        )}
                        {truck.currentLocation && (
                          <p className="text-blue-600 text-sm mt-1">
                            📍 Current Location: {truck.currentLocation}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        {truck.departureTime && (
                          <p>Departure: {new Date(truck.departureTime).toLocaleDateString()}</p>
                        )}
                        {truck.forecastedArrival && (
                          <p>ETA: {new Date(truck.forecastedArrival).toLocaleDateString()}</p>
                        )}
                        {truck.actualArrivalTime && truck.status === 'delivered' && (
                          <p className="text-green-600">Delivered: {new Date(truck.actualArrivalTime).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress for individual truck */}
                    {truck.status !== 'delivered' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Assigned</span>
                          <span>Loading</span>
                          <span>In Transit</span>
                          <span>Offloading</span>
                          <span>Delivered</span>
                        </div>
                        <div className="flex gap-1">
                          {['assigned', 'loading', 'in_transit', 'offloading', 'delivered'].map((step, idx) => {
                            const steps = ['assigned', 'loading', 'in_transit', 'offloading', 'delivered'];
                            const currentStepIndex = steps.indexOf(truck.status);
                            const isCompleted = idx <= currentStepIndex;
                            return (
                              <div 
                                key={step}
                                className={`flex-1 h-1 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                              ></div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Last update */}
                    <div className="mt-2 text-xs text-gray-400">
                      Last update: {new Date(truck.lastUpdate).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackMultiTruck;
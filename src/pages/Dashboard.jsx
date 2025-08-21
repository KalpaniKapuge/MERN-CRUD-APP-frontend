import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    itemsInStock: 0,
    orders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [customersRes, itemsRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/customers`),
        axios.get(`${import.meta.env.VITE_API_URL}/items`),
        axios.get(`${import.meta.env.VITE_API_URL}/orders`)
      ]);

      const totalItemsInStock = itemsRes.data.reduce((sum, item) => sum + parseInt(item.quantity), 0);

      setStats({
        customers: customersRes.data.length,
        itemsInStock: totalItemsInStock,
        orders: ordersRes.data.length
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch stats');
      toast.error(err.response?.data?.msg || 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">Dashboard</h1>
      <p className="text-gray-600 mb-6 text-center">
        Welcome to the MERN CRUD App. Use the navigation above to manage customers, items, or orders.
      </p>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {isLoading ? (
        <p className="text-purple-600 font-bold text-center">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-purple-300 text-center hover:shadow-xl transition duration-300">
            <p className="text-purple-500 font-semibold mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-purple-800">{stats.customers}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-purple-300 text-center hover:shadow-xl transition duration-300">
            <p className="text-purple-500 font-semibold mb-2">Total Items in Stock</p>
            <p className="text-3xl font-bold text-purple-800">{stats.itemsInStock}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-purple-300 text-center hover:shadow-xl transition duration-300">
            <p className="text-purple-500 font-semibold mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-purple-800">{stats.orders}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    itemsInStock: 0,
    orders: 0,
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
        axios.get(`${import.meta.env.VITE_API_URL}/orders`),
      ]);

      const totalItemsInStock = itemsRes.data.reduce(
        (sum, item) => sum + parseInt(item.quantity),
        0
      );

      setStats({
        customers: customersRes.data.length,
        itemsInStock: totalItemsInStock,
        orders: ordersRes.data.length,
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch stats");
      toast.error(err.response?.data?.msg || "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.customers,
      icon: <Users className="w-10 h-10 text-purple-600" />,
      gradient: "from-purple-100 to-purple-200",
    },
    {
      title: "Total Items in Stock",
      value: stats.itemsInStock,
      icon: <Package className="w-10 h-10 text-blue-600" />,
      gradient: "from-blue-100 to-blue-200",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <ShoppingCart className="w-10 h-10 text-green-600" />,
      gradient: "from-green-100 to-green-200",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-extrabold mb-6 text-purple-800 text-center">
        📊 Dashboard
      </h1>
      <p className="text-gray-600 mb-10 text-center text-lg">
        Welcome to the MERN CRUD App! Use the navigation above to manage{" "}
        <span className="font-semibold text-purple-600">customers</span>,{" "}
        <span className="font-semibold text-blue-600">items</span>, and{" "}
        <span className="font-semibold text-green-600">orders</span>.
      </p>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {isLoading ? (
        <p className="text-purple-600 font-bold text-center">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`p-6 bg-purple-200 ${card.gradient} rounded-2xl shadow-lg border border-purple-300 text-center hover:shadow-2xl transition duration-300`}
            >
              <div className="flex justify-center mb-4">{card.icon}</div>
              <p className="text-gray-700 font-medium mb-2">{card.title}</p>
              <p className="text-4xl font-extrabold text-gray-900">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

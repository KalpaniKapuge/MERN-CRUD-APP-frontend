import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/order-history`);
      console.log('Fetched order history at 12:24 PM +0530, 2025-08-21:', res.data);
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch order history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">Order History</h2>

      {isLoading ? (
        <p className="text-center text-purple-600 font-bold">Loading order history...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-purple-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-purple-300">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-purple-600 text-white uppercase text-sm">
                <th className="p-3 border-b border-purple-400 text-left">Order ID</th>
                <th className="p-3 border-b border-purple-400 text-left">Customer</th>
                <th className="p-3 border-b border-purple-400 text-left">Items</th>
                <th className="p-3 border-b border-purple-400 text-left">Total Price</th>
                <th className="p-3 border-b border-purple-400 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="hover:bg-purple-200 transition duration-200 border-b last:border-b-0"
                >
                  <td className="p-3 font-mono font-semibold">{order.order_id}</td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">{`${item.item_name} (x${item.quantity})`}</div>
                    ))}
                  </td>
                  <td className="p-3">${order.total_price.toFixed(2)}</td>
                  <td className="p-3">{new Date(order.order_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
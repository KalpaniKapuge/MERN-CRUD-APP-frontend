import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: '', customer_id: '', items: [{ item_id: '', quantity: '' }] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      console.log('Fetched orders:', res.data);
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers`);
      setCustomers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch customers');
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/items`);
      setItems(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch items');
    }
  };

  const addItemField = () => setForm({ ...form, items: [...form.items, { item_id: '', quantity: '' }] });

  const updateItemField = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const removeItemField = (index) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) });

  const handleSubmit = async () => {
    if (!form.id.trim() || !form.customer_id || form.items.some(i => !i.item_id || !i.quantity || parseInt(i.quantity) <= 0)) {
      toast.error('Order ID, Customer, and at least one item with a positive quantity are required');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = { ...form, id: form.id.trim() };
      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, requestData);
      toast.success('Order created successfully');
      setForm({ id: '', customer_id: '', items: [{ item_id: '', quantity: '' }] });
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to safely format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString(); // fallback if invalid
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">Manage Orders</h2>

      {/* Create Order Form */}
      <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border border-purple-300">
        <h3 className="text-xl font-semibold mb-4 text-purple-700">Create New Order</h3>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Order ID (Required)</label>
          <input
            type="text"
            placeholder="Order ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Customer (Required)</label>
          <select
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{`${customer.name} (ID: ${customer.id})`}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Items</label>
          {form.items.map((item, index) => (
            <div key={index} className="flex items-center mb-3 bg-purple-50 p-2 rounded">
              <select
                value={item.item_id}
                onChange={(e) => updateItemField(index, 'item_id', e.target.value)}
                className="w-1/2 p-2 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              >
                <option value="">Select Item</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>{`${i.name} (ID: ${i.id})`}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => updateItemField(index, 'quantity', e.target.value)}
                className="w-1/4 p-2 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              {form.items.length > 1 && (
                <button
                  onClick={() => removeItemField(index)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                  disabled={isLoading}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addItemField}
            className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-4 transition duration-200"
            disabled={isLoading}
          >
            Add Item
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create Order'}
        </button>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <p className="text-center text-purple-600 font-bold">Loading orders...</p>
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
                <tr key={order.id} className="hover:bg-purple-200 transition duration-200 border-b last:border-b-0">
                  <td className="p-3 font-mono font-semibold">{order.id}</td>
                  <td className="p-3">{`${order.customer_name} (ID: ${order.customer_id})`}</td>
                  <td className="p-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">{`${item.name} (ID: ${item.id}, x${item.quantity})`}</div>
                    ))}
                  </td>
                  <td className="p-3">${order.total_price.toFixed(2)}</td>
                  <td className="p-3">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;

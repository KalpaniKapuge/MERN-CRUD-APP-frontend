import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/items`);
      console.log('Fetched items at 11:33 AM +0530, 2025-08-21:', res.data); // Debug with timestamp
      setItems(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.id.trim() || !form.name.trim() || !form.price || !form.quantity) {
      toast.error('All fields are required');
      return;
    }
    if (parseFloat(form.price) <= 0 || parseInt(form.quantity) <= 0) {
      toast.error('Price and Quantity must be positive');
      return;
    }
    setIsLoading(true);
    try {
      const requestData = { ...form, id: form.id.trim() };
      console.log('Sending item data:', requestData); // Debug sent data
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/items/${editingId}`, requestData);
        toast.success('Item updated successfully');
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/items`, requestData);
        toast.success('Item added successfully');
      }
      setForm({ id: '', name: '', price: '', quantity: '' });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ id: item.id, name: item.name, price: item.price, quantity: item.quantity });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/items/${id}`);
        toast.success('Item deleted successfully');
        fetchItems();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to delete item');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">Manage Items</h2>

      <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border border-purple-300">
        <h3 className="text-xl font-semibold mb-4 text-purple-700">
          {editingId ? 'Edit Item' : 'Add New Item'}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="ID (Required)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={editingId}
          />
          <input
            type="text"
            placeholder="Name (Required)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Price (Required)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Quantity (Required)"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 shadow-md disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-purple-600 font-bold">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-purple-600">No items found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-purple-300">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-purple-600 text-white uppercase text-sm">
                <th className="p-3 border-b border-purple-400 text-left">ID</th>
                <th className="p-3 border-b border-purple-400 text-left">Name</th>
                <th className="p-3 border-b border-purple-400 text-left">Price</th>
                <th className="p-3 border-b border-purple-400 text-left">Quantity</th>
                <th className="p-3 border-b border-purple-400 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition-all duration-300 transform hover:shadow-lg ${
                    idx % 2 === 0 ? 'bg-purple-50' : 'bg-white'
                  } hover:bg-purple-200 cursor-pointer`}
                >
                  <td className="p-3 font-mono font-semibold">{item.id}</td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">${item.price}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-purple-400 text-white rounded hover:bg-purple-500 transition duration-300"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Items;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', nic: '', contactNo: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers`);
      console.log('Fetched customers at 11:33 AM +0530, 2025-08-21:', res.data); // Debug with timestamp
      setCustomers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.id.trim() || !form.name.trim() || !form.address.trim()) {
      toast.error('ID, Name, and Address are required and cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const requestData = { ...form, id: form.id.trim() };
      console.log('Sending customer data:', requestData); // Debug sent data
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/customers/${editingId}`, requestData);
        toast.success('Customer updated successfully');
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/customers`, requestData);
        toast.success('Customer added successfully');
      }
      setForm({ id: '', name: '', nic: '', contactNo: '', address: '' });
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to save customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setForm({
      id: customer.id,
      name: customer.name,
      nic: customer.nic || '',
      contactNo: customer.contactNo || '',
      address: customer.address,
    });
    setEditingId(customer.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/customers/${id}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to delete customer');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">Manage Customers</h2>

      <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border border-purple-300">
        <h3 className="text-xl font-semibold mb-4 text-purple-700">
          {editingId ? 'Edit Customer' : 'Add New Customer'}
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
            type="text"
            placeholder="NIC"
            value={form.nic}
            onChange={(e) => setForm({ ...form, nic: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Contact No"
            value={form.contactNo}
            onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Address (Required)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 shadow-md disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : editingId ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-purple-600 font-bold">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="text-center text-purple-600">No customers found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-purple-300">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-purple-600 text-white uppercase text-sm">
                <th className="p-3 border-b border-purple-400 text-left font-bold">ID</th>
                <th className="p-3 border-b border-purple-400 text-left">Name</th>
                <th className="p-3 border-b border-purple-400 text-left">NIC</th>
                <th className="p-3 border-b border-purple-400 text-left">Contact No</th>
                <th className="p-3 border-b border-purple-400 text-left">Address</th>
                <th className="p-3 border-b border-purple-400 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-purple-200 transition duration-200 border-b last:border-b-0"
                >
                  <td className="p-3 font-mono font-semibold">{customer.id}</td>
                  <td className="p-3">{customer.name}</td>
                  <td className="p-3">{customer.nic || '-'}</td>
                  <td className="p-3">{customer.contactNo || '-'}</td>
                  <td className="p-3">{customer.address}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 bg-purple-400 text-white rounded hover:bg-purple-500 transition duration-200"
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

export default Customers;
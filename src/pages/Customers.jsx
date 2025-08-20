import { useState, useEffect } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', nic: '', contactNo: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to fetch customers');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/customers/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/customers', form);
      }
      setForm({ name: '', nic: '', contactNo: '', address: '' });
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save customer');
    }
  };

  const handleEdit = (customer) => {
    setForm({ name: customer.name, nic: customer.nic || '', contactNo: customer.contactNo || '', address: customer.address });
    setEditingId(customer.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to delete customer');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Customers</h2>
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="NIC"
          value={form.nic}
          onChange={(e) => setForm({ ...form, nic: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Contact No"
          value={form.contactNo}
          onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">NIC</th>
              <th className="p-3 border-b text-left">Contact No</th>
              <th className="p-3 border-b text-left">Address</th>
              <th className="p-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{customer.name}</td>
                <td className="p-3 border-b">{customer.nic || '-'}</td>
                <td className="p-3 border-b">{customer.contactNo || '-'}</td>
                <td className="p-3 border-b">{customer.address}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
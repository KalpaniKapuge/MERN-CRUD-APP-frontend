import { useState, useEffect } from 'react';

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to fetch items');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/items/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/items', form);
      }
      setForm({ name: '', price: '', quantity: '' });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, quantity: item.quantity });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to delete item');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Items</h2>
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editingId ? 'Update Item' : 'Add Item'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Price</th>
              <th className="p-3 border-b text-left">Quantity</th>
              <th className="p-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{item.name}</td>
                <td className="p-3 border-b">${item.price}</td>
                <td className="p-3 border-b">{item.quantity}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleEdit(item)}
                    className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

export default Items;
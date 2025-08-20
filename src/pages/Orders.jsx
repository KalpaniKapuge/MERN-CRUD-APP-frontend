import { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ customer_id: '', items: [{ item_id: '', quantity: '' }] });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to fetch orders');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to fetch customers');
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to fetch items');
    }
  };

  const addItemField = () => {
    setForm({ ...form, items: [...form.items, { item_id: '', quantity: '' }] });
  };

  const updateItemField = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const removeItemField = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/orders', form);
      setForm({ customer_id: '', items: [{ item_id: '', quantity: '' }] });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create order');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <select
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
        {form.items.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <select
              value={item.item_id}
              onChange={(e) => updateItemField(index, 'item_id', e.target.value)}
              className="w-1/2 p-2 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => updateItemField(index, 'quantity', e.target.value)}
              className="w-1/4 p-2 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.items.length > 1 && (
              <button
                onClick={() => removeItemField(index)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addItemField}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 mb-2"
        >
          Add Item
        </button>
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b text-left">Order ID</th>
              <th className="p-3 border-b text-left">Customer</th>
              <th className="p-3 border-b text-left">Items</th>
              <th className="p-3 border-b text-left">Total Price</th>
              <th className="p-3 border-b text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{order.id}</td>
                <td className="p-3 border-b">{order.customer_name}</td>
                <td className="p-3 border-b">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name} (x{item.quantity})</div>
                  ))}
                </td>
                <td className="p-3 border-b">${order.total_price}</td>
                <td className="p-3 border-b">{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
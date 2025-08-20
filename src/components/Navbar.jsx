import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg shadow max-w-7xl mx-auto">
      <div className="space-x-4">
        <Link to="/dashboard" className="text-blue-500 hover:underline font-medium">Dashboard</Link>
        <Link to="/customers" className="text-blue-500 hover:underline font-medium">Customers</Link>
        <Link to="/items" className="text-blue-500 hover:underline font-medium">Items</Link>
        <Link to="/orders" className="text-blue-500 hover:underline font-medium">Orders</Link>
      </div>
      {user && (
        <button
          onClick={logout}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
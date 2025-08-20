import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import ProtectedRoute from '../src/components/ProtectedRoute.jsx';
import Navbar from '../src/components/Navbar.jsx';
import Login from '../src/pages/Login.jsx';
import Register from '../src/pages/Register.jsx';
import Dashboard from '../src/pages/Dashboard.jsx';
import Customers from '../src/pages/Customers.jsx';
import Items from '../src/pages/Item.jsx';
import Orders from '../src/pages/Orders.jsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
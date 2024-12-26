import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Sidebar component
import './css/Admin.css';
import './css/AdminPanel.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(''); // For displaying login errors

  const navigate = useNavigate();

  // Check session on component mount
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy validation: Replace with actual authentication logic
    if (credentials.username === 'a' && credentials.password === 'a') {
      sessionStorage.setItem('isLoggedIn', 'true');
      setIsAuthenticated(true);
      setError(''); // Clear any previous errors
      navigate('/admin'); // Navigate to admin dashboard
    } else {
      setError('Invalid username or password. Please try again.'); // Show error
    }
  };

  // Login form rendering
  const renderLoginForm = () => (
    <div className="admin-page">
      <div className="admin-form-container">
        <h2 className="admin-title">Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );

  // Admin panel rendering
  const renderAdminPanel = () => (
    <div className="admin-panel">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* Renders child routes dynamically */}
      </div>
    </div>
  );

  // Render based on authentication state
  return isAuthenticated ? renderAdminPanel() : renderLoginForm();
};

export default AdminPage;

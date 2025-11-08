import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span style={{ fontSize: '32px' }}>🩸</span>
          <span>Blood Management System</span>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard'}>
                Dashboard
              </Link>
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ margin: 0 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


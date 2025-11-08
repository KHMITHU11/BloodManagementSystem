import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'donor', // Default role
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      // Wait a moment for user state to update
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/donor/dashboard');
      }, 100);
    } else {
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', marginTop: '40px' }}>
      <div className="login-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px', 
        alignItems: 'start' 
      }}>
        {/* Left Side - Login Form */}
        <div>
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>🩸</div>
              <h2 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: '700' }}>Welcome Back</h2>
              <p style={{ color: '#666', fontSize: '16px', fontStyle: 'italic' }}>
                "A single drop of blood can save a life. Be a hero, be a donor."
              </p>
            </div>

            {/* Role Selection */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#2c3e50' }}>
                Login As:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('donor')}
                  className={`btn ${formData.role === 'donor' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '15px' }}
                >
                  ❤️ Donor
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`btn ${formData.role === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '15px' }}
                >
                  👨‍💼 Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                {loading ? '⏳ Logging in...' : '🚀 Login'}
              </button>
            </form>
            <p style={{ marginTop: '25px', textAlign: 'center', color: '#666' }}>
              Don't have an account? <Link to="/register" style={{ color: '#dc3545', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Features & Information */}
        <div>
          {/* Features Section */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            marginBottom: '25px'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '700', textAlign: 'center' }}>
              🎯 Key Features
            </h2>
            <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Donor Management</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Manage donors</div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏥</div>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Blood Bank Management</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Track inventory</div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Donation Tracking</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Monitor donations</div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>Smart Search</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Find donors fast</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: 'white',
            boxShadow: '0 20px 60px rgba(220, 53, 69, 0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '700', textAlign: 'center' }}>
              💝 Why Join Us?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px' }}>❤️</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '3px' }}>Live Saver</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Save lives with your donation</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px' }}>📝</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '3px' }}>Register as Donor</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Join our donor community</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px' }}>🏥</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '3px' }}>Blood Bank Support</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>24/7 support available</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px' }}>✅</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '3px' }}>Real-time Availability</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Check blood stock instantly</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px' }}>📱</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '3px' }}>Easy Management</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Simple and user-friendly</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '25px', textAlign: 'center' }}>
              <Link to="/register" className="btn" style={{ 
                background: 'white', 
                color: '#dc3545', 
                fontWeight: '700',
                width: '100%'
              }}>
                ✨ Register as Donor Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


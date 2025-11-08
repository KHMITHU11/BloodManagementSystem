import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DonorProfile from './DonorProfile';
import BloodRequestForm from './BloodRequestForm';
import DonationRequestForm from './DonationRequestForm';
import MyRequests from './MyRequests';
import MyDonations from './MyDonations';

const DonorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const response = await axios.get('/api/dashboard/donor/');
      setDashboardData(response.data);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to load dashboard data';
      toast.error(errorMessage);
      console.error('Dashboard error:', error.response?.data || error);
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh dashboard when switching to overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      const timer = setTimeout(() => {
        fetchDashboardData(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, fetchDashboardData]);

  // Auto-refresh every 30 seconds when on overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      const interval = setInterval(() => {
        fetchDashboardData(false);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchDashboardData]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1>Donor Dashboard</h1>
            {refreshing && (
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                🔄 Updating data...
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {refreshing && (
              <span style={{ fontSize: '14px', color: '#666' }}>🔄</span>
            )}
            <button 
              className="btn btn-primary" 
              onClick={() => fetchDashboardData(true)}
              style={{ padding: '10px 20px' }}
              title="Refresh Dashboard"
              disabled={loading || refreshing}
            >
              {loading || refreshing ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '30px', 
          flexWrap: 'wrap',
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveTab('overview');
              fetchDashboardData(false);
            }}
            style={{ minWidth: '140px' }}
          >
            📊 Overview
          </button>
          <button
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('profile')}
            style={{ minWidth: '140px' }}
          >
            👤 My Profile
          </button>
          <button
            className={`btn ${activeTab === 'request' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('request')}
            style={{ minWidth: '140px' }}
          >
            🩸 Request Blood
          </button>
          <button
            className={`btn ${activeTab === 'donate' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donate')}
            style={{ minWidth: '140px' }}
          >
            ❤️ Donate Blood
          </button>
          <button
            className={`btn ${activeTab === 'my-requests' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('my-requests')}
            style={{ minWidth: '140px' }}
          >
            📋 My Requests
          </button>
          <button
            className={`btn ${activeTab === 'my-donations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('my-donations')}
            style={{ minWidth: '140px' }}
          >
            ❤️ My Donations
          </button>
        </div>

        {activeTab === 'overview' && dashboardData && (
          <div key={`overview-${refreshKey}`}>
            <div className="card" key={`availability-${refreshKey}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🩸 Blood Availability by Group</h2>
                {refreshing && (
                  <span style={{ fontSize: '14px', color: '#666' }}>🔄 Updating...</span>
                )}
              </div>
              <div className="blood-availability">
                {dashboardData?.blood_availability && Object.entries(dashboardData.blood_availability).map(([group, units]) => {
                  const isLow = units === 0;
                  const isRunningLow = units > 0 && units < 10;
                  return (
                    <div 
                      key={`${group}-${refreshKey}`} 
                      className="blood-group-card"
                      style={{
                        borderLeft: isLow ? '4px solid #dc3545' : isRunningLow ? '4px solid #ffc107' : '4px solid #28a745',
                        animation: refreshing ? 'pulse 1s ease-in-out' : 'none'
                      }}
                    >
                      <div className="blood-group" style={{ fontSize: '24px', fontWeight: '700' }}>
                        {group}
                      </div>
                      <div className="units" style={{ 
                        color: isLow ? '#dc3545' : isRunningLow ? '#ffc107' : '#28a745',
                        fontWeight: '700'
                      }}>
                        {units ?? 0} units
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: isLow ? '#dc3545' : isRunningLow ? '#856404' : '#155724', 
                        marginTop: '5px',
                        fontWeight: '600'
                      }}>
                        {isLow ? '⚠️ Out of Stock' : isRunningLow ? '⚠️ Running Low' : '✅ Available'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  <strong>📊 Quick Stats:</strong>
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    <li>Available blood groups: {Object.values(dashboardData?.blood_availability || {}).filter(u => u > 0).length} out of 8</li>
                    <li>Total units available: {Object.values(dashboardData?.blood_availability || {}).reduce((sum, units) => sum + (units || 0), 0)} units</li>
                    <li>Low stock groups: {Object.entries(dashboardData?.blood_availability || {}).filter(([_, units]) => units > 0 && units < 10).length} groups</li>
                  </ul>
                </div>
              </div>
            </div>

            {dashboardData?.donor_profile && (
              <div className="card">
                <h2>👤 My Profile</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Blood Group</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545' }}>
                      {dashboardData.donor_profile.blood_group}
                    </div>
                  </div>
                  <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>City</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                      {dashboardData.donor_profile.city || 'N/A'}
                    </div>
                  </div>
                  <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Availability</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: dashboardData.donor_profile.is_available ? '#28a745' : '#dc3545' }}>
                      {dashboardData.donor_profile.is_available ? '✅ Available' : '❌ Not Available'}
                    </div>
                  </div>
                  {dashboardData.donor_profile.last_donation_date && (
                    <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Last Donation</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                        {new Date(dashboardData.donor_profile.last_donation_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <DonorProfile onUpdate={() => fetchDashboardData(false)} />
        )}

        {activeTab === 'request' && (
          <BloodRequestForm onSuccess={() => {
            setTimeout(() => fetchDashboardData(false), 500);
          }} />
        )}

        {activeTab === 'donate' && (
          <DonationRequestForm onSuccess={() => {
            setTimeout(() => fetchDashboardData(false), 500);
          }} />
        )}

        {activeTab === 'my-requests' && (
          <MyRequests />
        )}

        {activeTab === 'my-donations' && (
          <MyDonations />
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BloodBankManagement from './BloodBankManagement';
import DonorManagement from './DonorManagement';
import BloodRequestManagement from './BloodRequestManagement';
import DonationManagement from './DonationManagement';
import SearchDonors from './SearchDonors';

const AdminDashboard = () => {
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
      const response = await axios.get('/api/dashboard/admin/');
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
      setRefreshKey(prev => prev + 1); // Force re-render
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
      // Small delay to avoid multiple calls
      const timer = setTimeout(() => {
        fetchDashboardData(false); // Don't show loading spinner on tab switch
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, fetchDashboardData]);

  // Auto-refresh every 30 seconds when on overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      const interval = setInterval(() => {
        fetchDashboardData(false);
      }, 30000); // Refresh every 30 seconds
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
            <h1>Admin Dashboard</h1>
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
              onClick={() => {
                console.log('Manual refresh triggered');
                fetchDashboardData(true);
              }}
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
            className={`btn ${activeTab === 'blood-banks' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('blood-banks')}
            style={{ minWidth: '140px' }}
          >
            🏥 Blood Banks
          </button>
          <button
            className={`btn ${activeTab === 'donors' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donors')}
            style={{ minWidth: '140px' }}
          >
            👥 Donors
          </button>
          <button
            className={`btn ${activeTab === 'blood-requests' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('blood-requests')}
            style={{ minWidth: '140px' }}
          >
            🩸 Requests
          </button>
          <button
            className={`btn ${activeTab === 'donations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donations')}
            style={{ minWidth: '140px' }}
          >
            ❤️ Donations
          </button>
          <button
            className={`btn ${activeTab === 'search' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('search')}
            style={{ minWidth: '140px' }}
          >
            🔍 Search
          </button>
        </div>

        {activeTab === 'overview' && dashboardData && (
          <div key={`overview-${refreshKey}`}>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>👥 Total Donors</h3>
                <div className="stat-value">{dashboardData?.total_donors ?? 0}</div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Active blood donors
                </div>
              </div>
              <div className="stat-card">
                <h3>🩸 Total Blood Requests</h3>
                <div className="stat-value">{dashboardData?.total_blood_requests ?? 0}</div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  All time requests
                </div>
              </div>
              <div className="stat-card">
                <h3>⏳ Pending Requests</h3>
                <div className="stat-value">{dashboardData?.pending_requests ?? 0}</div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Awaiting approval
                </div>
              </div>
              <div className="stat-card">
                <h3>❤️ Total Donations</h3>
                <div className="stat-value">{dashboardData?.total_donations ?? 0}</div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Completed donations
                </div>
              </div>
            </div>

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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} key={`tables-${refreshKey}`}>
              <div className="card">
                <h2>📋 Recent Blood Requests</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent_requests && dashboardData.recent_requests.length > 0 ? (
                      dashboardData.recent_requests.map((request) => (
                        <tr key={`request-${request.id}-${refreshKey}`}>
                          <td>{request.requester_name}</td>
                          <td>{request.blood_group}</td>
                          <td>
                            <span className={`badge badge-${request.status === 'pending' ? 'warning' : request.status === 'approved' ? 'success' : 'danger'}`}>
                              {request.status}
                            </span>
                          </td>
                          <td>{new Date(request.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#666' }}>No recent requests</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="card">
                <h2>❤️ Recent Donations</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recent_donations && dashboardData.recent_donations.length > 0 ? (
                      dashboardData.recent_donations.map((donation) => (
                        <tr key={`donation-${donation.id}-${refreshKey}`}>
                          <td>{donation.donor_name}</td>
                          <td>{donation.blood_group}</td>
                          <td>
                            <span className={`badge badge-${donation.status === 'pending' ? 'warning' : donation.status === 'approved' ? 'success' : 'danger'}`}>
                              {donation.status}
                            </span>
                          </td>
                          <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#666' }}>No recent donations</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blood-banks' && (
          <BloodBankManagement onUpdate={() => {
            setTimeout(() => fetchDashboardData(false), 500);
          }} />
        )}

        {activeTab === 'donors' && (
          <DonorManagement onUpdate={() => {
            setTimeout(() => fetchDashboardData(false), 500);
          }} />
        )}

        {activeTab === 'blood-requests' && (
          <BloodRequestManagement onUpdate={() => {
            setTimeout(() => fetchDashboardData(false), 500);
          }} />
        )}

        {activeTab === 'donations' && (
          <DonationManagement onUpdate={() => {
            setTimeout(() => fetchDashboardData(false), 500);
          }} />
        )}

        {activeTab === 'search' && (
          <SearchDonors />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


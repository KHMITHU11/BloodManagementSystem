import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DonorManagement = ({ onUpdate }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axios.get('/api/search-donors/');
      setDonors(response.data);
    } catch (error) {
      toast.error('Failed to load donors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="card">
      <h2>All Donors</h2>
      {donors.length === 0 ? (
        <p>No donors found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Blood Group</th>
              <th>City</th>
              <th>Available</th>
              <th>Last Donation</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => (
              <tr key={donor.id}>
                <td>{donor.user?.username || 'N/A'}</td>
                <td>{donor.user?.email || 'N/A'}</td>
                <td>{donor.blood_group}</td>
                <td>{donor.city || 'N/A'}</td>
                <td>
                  <span className={`badge ${donor.is_available ? 'badge-success' : 'badge-secondary'}`}>
                    {donor.is_available ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  {donor.last_donation_date
                    ? new Date(donor.last_donation_date).toLocaleDateString()
                    : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DonorManagement;


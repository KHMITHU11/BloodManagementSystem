import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/api/donations/');
      setDonations(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load donations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      completed: 'badge-info',
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="card">
      <h2>My Donations</h2>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Status</th>
              <th>Donation Date</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.blood_group}</td>
                <td>{donation.units_donated}</td>
                <td>
                  <span className={`badge ${getStatusBadge(donation.status)}`}>
                    {donation.status}
                  </span>
                </td>
                <td>
                  {donation.donation_date
                    ? new Date(donation.donation_date).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{new Date(donation.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyDonations;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DonationManagement = ({ onUpdate }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [actionData, setActionData] = useState({
    action: 'approve',
    blood_bank_id: '',
    donation_date: '',
    admin_notes: '',
  });

  useEffect(() => {
    fetchDonations();
    fetchBloodBanks();
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

  const fetchBloodBanks = async () => {
    try {
      const response = await axios.get('/api/blood-banks/');
      setBloodBanks(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load blood banks');
    }
  };

  const handleApproveReject = (donation, action) => {
    setSelectedDonation(donation);
    setActionData({
      action: action,
      blood_bank_id: donation.blood_bank?.id || '',
      donation_date: donation.donation_date || new Date().toISOString().split('T')[0],
      admin_notes: '',
    });
    setShowModal(true);
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/donations/${selectedDonation.id}/approve-reject/`, actionData);
      toast.success(`Donation ${actionData.action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setShowModal(false);
      setSelectedDonation(null);
      await fetchDonations();
      if (onUpdate) {
        // Wait a bit for backend to update, then refresh dashboard
        setTimeout(() => {
          onUpdate();
        }, 300);
      }
    } catch (error) {
      toast.error(`Failed to ${actionData.action} donation`);
      console.error(error);
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
    <div>
      <div className="card">
        <h2>Donations</h2>
        {donations.length === 0 ? (
          <p>No donations found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Status</th>
                <th>Donation Date</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.donor_name}</td>
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
                  <td>
                    {donation.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApproveReject(donation, 'approve')}
                          style={{ marginRight: '10px' }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleApproveReject(donation, 'reject')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedDonation && (
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{actionData.action === 'approve' ? 'Approve' : 'Reject'} Donation</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmitAction}>
              {actionData.action === 'approve' && (
                <>
                  <div className="form-group">
                    <label>Blood Bank *</label>
                    <select
                      name="blood_bank_id"
                      value={actionData.blood_bank_id}
                      onChange={(e) => setActionData({ ...actionData, blood_bank_id: e.target.value })}
                      required
                    >
                      <option value="">Select Blood Bank</option>
                      {bloodBanks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Donation Date *</label>
                    <input
                      type="date"
                      name="donation_date"
                      value={actionData.donation_date}
                      onChange={(e) => setActionData({ ...actionData, donation_date: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Admin Notes</label>
                <textarea
                  name="admin_notes"
                  value={actionData.admin_notes}
                  onChange={(e) => setActionData({ ...actionData, admin_notes: e.target.value })}
                  placeholder="Add any notes or comments..."
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {actionData.action === 'approve' ? 'Approve' : 'Reject'} Donation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;


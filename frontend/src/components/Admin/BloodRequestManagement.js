import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BloodRequestManagement = ({ onUpdate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionData, setActionData] = useState({
    action: 'approve',
    blood_bank_id: '',
    admin_notes: '',
  });

  useEffect(() => {
    fetchRequests();
    fetchBloodBanks();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/blood-requests/');
      setRequests(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load blood requests');
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

  const handleApproveReject = (request, action) => {
    setSelectedRequest(request);
    setActionData({
      action: action,
      blood_bank_id: request.blood_bank?.id || '',
      admin_notes: '',
    });
    setShowModal(true);
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/blood-requests/${selectedRequest.id}/approve-reject/`, actionData);
      toast.success(`Request ${actionData.action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setShowModal(false);
      setSelectedRequest(null);
      await fetchRequests();
      if (onUpdate) {
        // Wait a bit for backend to update, then refresh dashboard
        setTimeout(() => {
          onUpdate();
        }, 300);
      }
    } catch (error) {
      toast.error(`Failed to ${actionData.action} request`);
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      fulfilled: 'badge-info',
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Blood Requests</h2>
        {requests.length === 0 ? (
          <p>No blood requests found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.requester_name}</td>
                  <td>{request.blood_group}</td>
                  <td>{request.units_required}</td>
                  <td>{request.urgency}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApproveReject(request, 'approve')}
                          style={{ marginRight: '10px' }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleApproveReject(request, 'reject')}
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

      {showModal && selectedRequest && (
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{actionData.action === 'approve' ? 'Approve' : 'Reject'} Blood Request</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmitAction}>
              {actionData.action === 'approve' && (
                <div className="form-group">
                  <label>Blood Bank</label>
                  <select
                    name="blood_bank_id"
                    value={actionData.blood_bank_id}
                    onChange={(e) => setActionData({ ...actionData, blood_bank_id: e.target.value })}
                  >
                    <option value="">Select Blood Bank</option>
                    {bloodBanks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                {actionData.action === 'approve' ? 'Approve' : 'Reject'} Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestManagement;


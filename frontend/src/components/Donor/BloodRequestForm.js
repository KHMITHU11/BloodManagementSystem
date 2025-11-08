import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BloodRequestForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    blood_group: '',
    units_required: 1,
    reason: '',
    urgency: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/blood-requests/', formData);
      toast.success('Blood request submitted successfully!');
      setFormData({
        blood_group: '',
        units_required: 1,
        reason: '',
        urgency: 'medium',
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to submit blood request');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Request Blood</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blood Group Required *</label>
          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Units Required *</label>
          <input
            type="number"
            name="units_required"
            value={formData.units_required}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Reason *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="Please provide a reason for the blood request..."
          />
        </div>
        <div className="form-group">
          <label>Urgency *</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default BloodRequestForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DonationRequestForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    units_donated: 1,
    donation_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [hasBloodGroup, setHasBloodGroup] = useState(false);

  useEffect(() => {
    // Check if user has blood group in profile
    const checkProfile = async () => {
      try {
        const response = await axios.get('/api/auth/donor-profile/');
        if (response.data && response.data.blood_group) {
          setHasBloodGroup(true);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };
    checkProfile();
  }, []);

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
      await axios.post('/api/donations/', formData);
      toast.success('Donation request submitted successfully!');
      setFormData({
        units_donated: 1,
        donation_date: '',
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.blood_group?.[0] || 
                          error.response?.data?.error || 
                          error.response?.data?.detail ||
                          'Failed to submit donation request. Please make sure your profile has a blood group set.';
      toast.error(errorMessage);
      console.error('Donation request error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Request to Donate Blood</h2>
      {!hasBloodGroup && (
        <div style={{ 
          padding: '15px', 
          marginBottom: '20px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '5px',
          color: '#856404'
        }}>
          <strong>⚠️ Warning:</strong> You need to set your blood group in your profile before you can submit a donation request. 
          Please go to "My Profile" and update your blood group first.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Units to Donate *</label>
          <input
            type="number"
            name="units_donated"
            value={formData.units_donated}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Preferred Donation Date</label>
          <input
            type="date"
            name="donation_date"
            value={formData.donation_date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !hasBloodGroup}
          title={!hasBloodGroup ? 'Please set your blood group in your profile first' : ''}
        >
          {loading ? 'Submitting...' : 'Submit Donation Request'}
        </button>
      </form>
    </div>
  );
};

export default DonationRequestForm;


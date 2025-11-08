import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SearchDonors = () => {
  const [searchParams, setSearchParams] = useState({
    blood_group: '',
    city: '',
    is_available: '',
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchParams.blood_group) params.append('blood_group', searchParams.blood_group);
      if (searchParams.city) params.append('city', searchParams.city);
      if (searchParams.is_available !== '') params.append('is_available', searchParams.is_available);

      const response = await axios.get(`/api/search-donors/?${params.toString()}`);
      setDonors(response.data);
      if (response.data.length === 0) {
        toast.info('No donors found matching your criteria');
      }
    } catch (error) {
      toast.error('Failed to search donors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      blood_group: '',
      city: '',
      is_available: '',
    });
    setDonors([]);
  };

  return (
    <div>
      <div className="card">
        <h2>Search Donors</h2>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="blood_group"
                value={searchParams.blood_group}
                onChange={handleChange}
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={searchParams.city}
                onChange={handleChange}
                placeholder="Enter city name"
              />
            </div>
            <div className="form-group">
              <label>Availability</label>
              <select
                name="is_available"
                value={searchParams.is_available}
                onChange={handleChange}
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {donors.length > 0 && (
        <div className="card">
          <h2>Search Results ({donors.length})</h2>
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
        </div>
      )}
    </div>
  );
};

export default SearchDonors;


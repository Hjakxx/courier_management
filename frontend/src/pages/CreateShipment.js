import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShipmentForm.css';

const CreateShipment = () => {
  const [formData, setFormData] = useState({
    trackingId: '',
    senderName: '',
    receiverName: '',
    sourceLocation: '',
    destinationLocation: '',
    status: 'Created',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/shipments`, formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Create New Shipment</h1>
          <p className="form-subtitle">Fill in the details to create a shipment</p>
        </div>

        <form onSubmit={handleSubmit} className="shipment-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="trackingId">Tracking ID *</label>
            <input
              type="text"
              id="trackingId"
              name="trackingId"
              value={formData.trackingId}
              onChange={handleChange}
              required
              placeholder="Enter unique tracking ID"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="senderName">Sender Name *</label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                required
                placeholder="Enter sender name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="receiverName">Receiver Name *</label>
              <input
                type="text"
                id="receiverName"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                required
                placeholder="Enter receiver name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sourceLocation">Source Location *</label>
              <input
                type="text"
                id="sourceLocation"
                name="sourceLocation"
                value={formData.sourceLocation}
                onChange={handleChange}
                required
                placeholder="Enter source location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="destinationLocation">Destination Location *</label>
              <input
                type="text"
                id="destinationLocation"
                name="destinationLocation"
                value={formData.destinationLocation}
                onChange={handleChange}
                required
                placeholder="Enter destination location"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Created">Created</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="form-button cancel"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="form-button submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;









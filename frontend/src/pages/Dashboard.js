import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import './Dashboard.css';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/shipments`);
      setShipments(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch shipments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await axios.delete(`${API_URL}/api/shipments/${id}`);
        setShipments(shipments.filter((shipment) => shipment._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete shipment');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Created':
        return '#3b82f6';
      case 'In Transit':
        return '#f59e0b';
      case 'Delivered':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="nav-logo">Courier & Logistics</h1>
          <div className="nav-actions">
            <span className="nav-user">Welcome, {user?.name || 'User'}</span>
            {user?.role === 'admin' && (
              <button className="nav-button admin" onClick={() => navigate('/admin')}>
                Admin Dashboard
              </button>
            )}
            <button className="nav-button" onClick={() => navigate('/create-shipment')}>
              + New Shipment
            </button>
            <button className="nav-button secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Shipments</h2>
          <p>Manage your courier shipments</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : shipments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No shipments yet</h3>
            <p>Create your first shipment to get started</p>
            <button className="empty-button" onClick={() => navigate('/create-shipment')}>
              Create Shipment
            </button>
          </div>
        ) : (
          <div className="shipments-grid">
            {shipments.map((shipment) => (
              <div key={shipment._id} className="shipment-card">
                <div className="shipment-header">
                  <div className="shipment-tracking">
                    <span className="tracking-label">Tracking ID</span>
                    <span className="tracking-id">{shipment.trackingId}</span>
                  </div>
                  <span
                    className="shipment-status"
                    style={{ backgroundColor: getStatusColor(shipment.status) + '20', color: getStatusColor(shipment.status) }}
                  >
                    {shipment.status}
                  </span>
                </div>

                <div className="shipment-body">
                  <div className="shipment-info">
                    <div className="info-row">
                      <span className="info-label">From:</span>
                      <span className="info-value">{shipment.senderName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">To:</span>
                      <span className="info-value">{shipment.receiverName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Source:</span>
                      <span className="info-value">{shipment.sourceLocation}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Destination:</span>
                      <span className="info-value">{shipment.destinationLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="shipment-footer">
                  <div className="shipment-date">
                    Created: {new Date(shipment.createdAt).toLocaleDateString()}
                  </div>
                  {String(shipment.createdBy?._id) === String(user?._id) && (
                    <div className="shipment-actions">
                      <button
                        className="action-button edit"
                        onClick={() => navigate(`/edit-shipment/${shipment._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(shipment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


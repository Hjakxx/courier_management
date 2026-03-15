import React, { useState, useEffect, useContext } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('shipments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shipmentsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/shipments`),
        axios.get(`${API_URL}/api/admin/users`),
      ]);
      setShipments(shipmentsRes.data);
      setUsers(usersRes.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (shipmentId, newStatus) => {
    try {
      setUpdatingStatus(shipmentId);
      const response = await axios.patch(
        `${API_URL}/api/admin/shipments/${shipmentId}/status`,
        { status: newStatus }
      );
      setShipments(shipments.map(s => s._id === shipmentId ? response.data : s));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
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

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="nav-content">
          <h1 className="nav-logo">Admin Dashboard</h1>
          <div className="nav-actions">
            <button className="nav-button secondary" onClick={() => navigate('/dashboard')}>
              User Dashboard
            </button>
            <span className="nav-user">Admin: {user?.name}</span>
            <button className="nav-button secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'shipments' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipments')}
          >
            Shipments ({shipments.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
        </div>

        {error && <div className="error-container">{error}</div>}

        {activeTab === 'shipments' && (
          <div className="admin-section">
            <h2>All Shipments</h2>
            {shipments.length === 0 ? (
              <div className="empty-state">
                <p>No shipments found</p>
              </div>
            ) : (
              <div className="shipments-list">
                {shipments.map((shipment) => (
                  <div key={shipment._id} className="admin-shipment-card">
                    <div className="shipment-header">
                      <div className="shipment-tracking">
                        <span className="tracking-label">Tracking ID</span>
                        <span className="tracking-id">{shipment.trackingId}</span>
                      </div>
                      <div className="status-control">
                        <select
                          value={shipment.status}
                          onChange={(e) => handleStatusUpdate(shipment._id, e.target.value)}
                          disabled={updatingStatus === shipment._id}
                          className="status-select"
                          style={{
                            backgroundColor: getStatusColor(shipment.status) + '20',
                            color: getStatusColor(shipment.status),
                            borderColor: getStatusColor(shipment.status),
                          }}
                        >
                          <option value="Created">Created</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
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
                        <div className="info-row">
                          <span className="info-label">Created By:</span>
                          <span className="info-value">
                            {shipment.createdBy?.name || 'Unknown'} ({shipment.createdBy?.email || 'N/A'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shipment-footer">
                      <div className="shipment-date">
                        Created: {new Date(shipment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>All Users</h2>
            {users.length === 0 ? (
              <div className="empty-state">
                <p>No users found</p>
              </div>
            ) : (
              <div className="users-list">
                {users.map((userItem) => (
                  <div key={userItem._id} className="admin-user-card">
                    <div className="user-header">
                      <div className="user-info">
                        <h3>{userItem.name}</h3>
                        <p className="user-email">{userItem.email}</p>
                      </div>
                      <span
                        className="user-role"
                        style={{
                          backgroundColor: userItem.role === 'admin' ? '#6366f1' : '#6b7280',
                        }}
                      >
                        {userItem.role}
                      </span>
                    </div>
                    <div className="user-footer">
                      <span>Joined: {new Date(userItem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;









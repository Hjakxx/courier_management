import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Server responded with error
        return {
          success: false,
          message: error.response.data?.message || `Error: ${error.response.status}`,
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend is running.',
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: error.message || 'Login failed',
        };
      }
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email: email.toLowerCase().trim(),
        password,
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || `Error: ${error.response.status}`,
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend is running.',
        };
      } else {
        return {
          success: false,
          message: error.message || 'Registration failed',
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


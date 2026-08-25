import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminLogin } from '../services/adminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally verify token validity here if you have a /me endpoint
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await adminLogin(email, password);
      if (data && data.access_token) {
        setToken(data.access_token);
        localStorage.setItem('adminToken', data.access_token);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

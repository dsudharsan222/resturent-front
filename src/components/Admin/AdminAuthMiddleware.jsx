import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminAuthMiddleware = ({ children }) => {
  const { token, loading } = useAuth();
  const storedToken = localStorage.getItem('adminToken');
  const isAuthenticated = Boolean(token || storedToken);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#121417',
        color: '#FAF8F5'
      }}>
        Loading admin console...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminAuthMiddleware;

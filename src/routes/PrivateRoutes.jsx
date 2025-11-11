import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return children;
};

export default PrivateRoutes;
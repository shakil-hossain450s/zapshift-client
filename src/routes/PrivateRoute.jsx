import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>

  if (!user) {
    return <Navigate to='/signin' state={{ from: location }} replace />
  }
  return children;
};

export default PrivateRoute;
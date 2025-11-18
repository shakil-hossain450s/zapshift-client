import React from 'react';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const AdminRoute = ({ children }) => {

  const { loading, isAdmin } = useUserRole();
  const location = useLocation();

  if (loading) {
    return <span className='loading loading-ring loading-lg'></span>
  }

  if (!isAdmin) {
    return <Navigate to='/forbidden' state={{from: location}} replace></Navigate>
  }

  return children;
};

export default AdminRoute;
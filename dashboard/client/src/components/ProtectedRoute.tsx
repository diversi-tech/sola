import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasPermission } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/EmployeePage" replace />;
  }

  return children;
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasPermission } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  /** If set, the user must hold this permission in addition to being logged in. */
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Logged in but lacking the required permission — send to the default page.
    return <Navigate to="/EmployeePage" replace />;
  }

  return children;
};

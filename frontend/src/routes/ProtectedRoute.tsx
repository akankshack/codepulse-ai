/**
 * @file ProtectedRoute.tsx
 * @description React Route Guard wrapping authenticated layout paths.
 * 
 * PURPOSE:
 * Inspects `isAuthenticated` and `isLoading` from `AuthContext`.
 * If authenticating boot is still active, displays a full-screen loading spinner.
 * If verified, renders children; otherwise redirects users to the login screen.
 * 
 * ROLE IN FRONTEND:
 * Mounted in `AppRoutes.tsx` as a layout guard component.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center gap-3">
        <Spinner size="lg" className="text-brand-500" />
        <span className="text-xs font-mono text-gray-400">Verifying session authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirects unauthenticated users to the Login view, preserving original location
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

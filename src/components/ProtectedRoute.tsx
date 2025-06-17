
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Check if this is a police route
  if (location.pathname === '/police-dashboard') {
    const policeAuth = localStorage.getItem('police_authenticated');
    if (policeAuth === 'true') {
      return <>{children}</>;
    } else {
      return <Navigate to="/tnpolice/secure/login" replace />;
    }
  }

  // For regular user routes, check normal authentication
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

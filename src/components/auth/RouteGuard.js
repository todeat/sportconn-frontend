// src/guards/RouteGuard.js
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const publicPaths = ['/login', '/register'];

export const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  
  if (user && publicPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  
  
  if (!user && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};
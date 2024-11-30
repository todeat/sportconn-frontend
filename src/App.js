import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute, PublicRoute } from "./components/auth/RouteGuard";
import Dashboard from "./pages/home/Dashboard";
import RegisterPage from "./pages/auth/RegisterPage";
import LocationDetails from "./pages/facility/LocationDetails";
import HomePage from "./pages/home/HomePage";
import { useSelector } from "react-redux";
import RegisterFacilityPage from "./pages/admin/RegisterFacilityPage";
import ProfilePage from "./pages/user/ProfilePage";
import LocationSchedulePage from "./pages/admin/facility/LocationSchedulePage";
import ScrollToTop from "./components/all/ScrollToTop";
import FacilitiesPage from "./pages/facility/FacilitiesPage";


const App = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <RegisterPage />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route
          path="/register-facility"
          element={
            <PrivateRoute>
              <RegisterFacilityPage />
            </PrivateRoute>
          }
          />
          <Route 
          path="/location/:locationId/schedule" 
          element={
            <PrivateRoute>
              <LocationSchedulePage />
            </PrivateRoute>
            } 
          />   
          <Route path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:locationId" element={<LocationDetails />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

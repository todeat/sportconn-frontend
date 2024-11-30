// src/pages/home/Dashboard.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { auth } from '../../firebase';
import PageLayout from '../../layout/PageLayout';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  console.log("Dashboard - User state:", user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <PageLayout>
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>
        <p className="text-gray-600 mb-4">
          Număr de telefon: <span className="font-medium">{user?.phoneNumber}</span>
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Deconectare
        </button>
      </div>
    </div>
    </PageLayout>
  );
};

export default Dashboard;
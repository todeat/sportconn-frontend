// src/auth/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { setUser, setLoading, setError, logout } from '../store/slices/authSlice';
import { onAuthStateChanged, signOut, onIdTokenChanged } from 'firebase/auth';
import PageLayout from '../layout/PageLayout';
import LoadingSpinner from '../components/all/LoadingSpinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLocalLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveUserDataToLocalStorage = async (currentUser) => {
    if (!currentUser || !currentUser.uid) {
      console.error('No valid user or UID available');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const userData = {
        uid: currentUser.uid,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        token
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      dispatch(setError(error.message));
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuthState = onAuthStateChanged(auth, async (currentUser) => {
      setIsLocalLoading(true);
      dispatch(setLoading(true));

      if (currentUser) {
        await saveUserDataToLocalStorage(currentUser);
      } else {
        dispatch(logout());
        localStorage.removeItem('userData');
      }

      setIsLocalLoading(false);
      dispatch(setLoading(false));
    });

    // Listen for token changes
    const unsubscribeTokenChange = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        await saveUserDataToLocalStorage(currentUser);
      }
    });

    // Restore user data from localStorage on initial load
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      dispatch(setUser(JSON.parse(savedUserData)));
    }

    // Token refresh on tab focus
    const refreshToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await saveUserDataToLocalStorage(currentUser);
      }
    };

    window.addEventListener('focus', refreshToken);

    return () => {
      unsubscribeAuthState();
      unsubscribeTokenChange();
      window.removeEventListener('focus', refreshToken);
    };
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      setIsLocalLoading(true);
      dispatch(setLoading(true));
      
      await signOut(auth);
      dispatch(logout());
      localStorage.removeItem('userData');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch(setError(error.message));
    } finally {
      setIsLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await saveUserDataToLocalStorage(currentUser);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        logout: handleLogout, 
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
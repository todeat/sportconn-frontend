// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null,
  phoneNumber: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    logout: (state) => {
      // Reset to initial state
      return initialState;
    },
    clearAuthState: (state) => {
      // Reset everything to initial values
      return initialState;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  setUser, 
  setPhoneNumber, 
  logout,
  clearAuthState
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectPhoneNumber = (state) => state.auth.phoneNumber;

// Thunk pentru logout
export const logoutUser = () => async (dispatch) => {
  try {
    // Clear all auth state
    dispatch(clearAuthState());
    
    // Reset entire store state
    dispatch({ type: 'RESET_STORE' });
    
  } catch (error) {
    console.error('Logout error:', error);
    dispatch(setError(error.message));
  }
};

export default authSlice.reducer;
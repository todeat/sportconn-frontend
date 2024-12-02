// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import profileReducer from './slices/profileSlice';

const rootReducer = {
  auth: authReducer,
  booking: bookingReducer,
  profile: profileReducer
};

// Create a meta-reducer that can clear all state
const resettableReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    // Reset all reducers to their initial state
    state = undefined;
  }
  
  return Object.keys(rootReducer).reduce((acc, key) => {
    acc[key] = rootReducer[key](state?.[key], action);
    return acc;
  }, {});
};

export const store = configureStore({
  reducer: resettableReducer
});
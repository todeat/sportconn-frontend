// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import profileReducer from './slices/profileSlice';
import facilitiesReducer from './slices/facilitiesSlice';

const rootReducer = {
  auth: authReducer,
  booking: bookingReducer,
  profile: profileReducer,
  facilities: facilitiesReducer
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
  reducer: resettableReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      // Rulăm acțiunea mai întâi
      const result = next(action);
      
      // Apoi verificăm dacă trebuie să invalidăm cache-ul
      switch (action.type) {
        case 'auth/logout':
          // Resetăm cache-ul la logout
          store.dispatch({ type: 'facilities/resetState' });
          break;
          
        case 'locations/addLocationSuccess':
          // Adăugăm noua locație în cache
          store.dispatch({ type: 'facilities/addFacility', payload: action.payload });
          break;
          
        case 'locations/updateLocationSuccess':
          // Actualizăm locația în cache
          store.dispatch({ type: 'facilities/updateFacility', payload: action.payload });
          break;
          
        default:
          break;
      }
      
      return result;
    })
});
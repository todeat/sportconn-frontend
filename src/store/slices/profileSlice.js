// src/store/slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo, getUserReservations } from '../../services/api';
import { auth } from '../../firebase';

const initialState = {
  userInfo: null,
  reservations: null,
  lastFetched: null,
  isFetching: false,
  error: null,
  // Cache pentru 5 minute by default
  cacheTimeout: 5 * 60 * 1000,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.reservations = action.payload.reservations;
      state.lastFetched = Date.now();
      state.isFetching = false;
      state.error = null;
    },
    setFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isFetching = false;
    },
    // Acțiuni pentru invalidare selectivă
    invalidateReservations: (state) => {
      state.reservations = null;
      state.lastFetched = null;
    },
    invalidateUserInfo: (state) => {
      state.userInfo = null;
      state.lastFetched = null;
    },
    // Actualizare pentru o singură rezervare
    updateReservation: (state, action) => {
      if (state.reservations?.upcoming_reservations) {
        state.reservations.upcoming_reservations = state.reservations.upcoming_reservations.map(
          reservation => reservation.reservationId === action.payload.reservationId 
            ? action.payload 
            : reservation
        );
      }
    },
    // Adaugă o nouă rezervare
    addReservation: (state, action) => {
      if (state.reservations?.upcoming_reservations) {
        state.reservations.upcoming_reservations.push(action.payload);
      }
    },
    // Șterge o rezervare
    removeReservation: (state, action) => {
      if (state.reservations?.upcoming_reservations) {
        state.reservations.upcoming_reservations = state.reservations.upcoming_reservations.filter(
          reservation => reservation.reservationId !== action.payload
        );
      }
    },
    // Adaugă o nouă locație în userInfo
    addLocation: (state, action) => {
      if (state.userInfo?.adminInfo?.locationsInfo) {
        state.userInfo.adminInfo.locationsInfo.push(action.payload);
        state.userInfo.adminInfo.locationsCount += 1;
      }
    },

    resetState: () => initialState
  }
});

export const { 
  setProfileData, 
  setFetching, 
  setError,
  invalidateReservations,
  invalidateUserInfo,
  updateReservation,
  addReservation,
  removeReservation,
  addLocation,
  resetState
} = profileSlice.actions;

// Selectors
export const selectProfileData = (state) => ({
  userInfo: state.profile.userInfo,
  reservations: state.profile.reservations,
  lastFetched: state.profile.lastFetched,
  isFetching: state.profile.isFetching,
  error: state.profile.error
});

// Thunk pentru fetch-ul profilului
export const fetchProfileData = (forceRefresh = false) => async (dispatch, getState) => {
    const { lastFetched, cacheTimeout, isFetching } = getState().profile;
    
    // Verificăm dacă datele sunt încă valide în cache și nu forțăm reîmprospătarea
    const isDataValid = lastFetched && (Date.now() - lastFetched < cacheTimeout);
    
    // Dacă datele sunt în cache și valide și nu forțăm reîmprospătarea, nu facem fetch
    if ((isDataValid && !forceRefresh) || isFetching) {
      return;
    }
  
    try {
      dispatch(setFetching(true));
      
      const token = await auth.currentUser.getIdToken();
      
      const [userInfoResponse, reservationsResponse] = await Promise.all([
        getUserInfo(token),
        getUserReservations({ token })
      ]);
      
      dispatch(setProfileData({
        userInfo: userInfoResponse.userInfo,
        reservations: reservationsResponse.success ? reservationsResponse : { upcoming_reservations: [] }
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
      dispatch(setError('A apărut o eroare la încărcarea datelor. Te rugăm să încerci din nou.'));
    }
  };

export default profileSlice.reducer;
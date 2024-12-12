import { createSlice } from '@reduxjs/toolkit';
import { getFacilities } from '../../services/api';

const initialState = {
  facilities: null,
  lastFetched: null,
  isFetching: false,
  error: null,
  // Cache pentru 15 minute by default
  cacheTimeout: 15 * 60 * 1000,
};

const facilitiesSlice = createSlice({
  name: 'facilities',
  initialState,
  reducers: {
    setFacilities: (state, action) => {
      state.facilities = action.payload;
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
    invalidateCache: (state) => {
      state.facilities = null;
      state.lastFetched = null;
    },
    // Pentru când se adaugă o nouă facilitate
    addFacility: (state, action) => {
      if (state.facilities) {
        state.facilities.push(action.payload);
      }
    },
    // Pentru când se actualizează o facilitate existentă
    updateFacility: (state, action) => {
      if (state.facilities) {
        state.facilities = state.facilities.map(facility =>
          facility.id === action.payload.id ? action.payload : facility
        );
      }
    },
    resetState: () => initialState
  }
});

export const { 
  setFacilities, 
  setFetching, 
  setError,
  invalidateCache,
  addFacility,
  updateFacility,
  resetState
} = facilitiesSlice.actions;

// Selectors
export const selectFacilitiesData = (state) => ({
  facilities: state.facilities.facilities,
  lastFetched: state.facilities.lastFetched,
  isFetching: state.facilities.isFetching,
  error: state.facilities.error
});

// Thunk pentru fetch-ul facilităților
export const fetchFacilities = (forceRefresh = false) => async (dispatch, getState) => {
  const { lastFetched, cacheTimeout, isFetching } = getState().facilities;
  
  // Verificăm dacă datele sunt încă valide în cache și nu forțăm reîmprospătarea
  const isDataValid = lastFetched && (Date.now() - lastFetched < cacheTimeout);
  
  // Dacă datele sunt în cache și valide și nu forțăm reîmprospătarea, nu facem fetch
  if ((isDataValid && !forceRefresh) || isFetching) {
    return;
  }

  try {
    dispatch(setFetching(true));
    
    const response = await getFacilities({});
    
    if (response.facilities) {
      dispatch(setFacilities(response.facilities));
    } else {
      throw new Error('No facilities data received');
    }
  } catch (error) {
    console.error('Error fetching facilities:', error);
    dispatch(setError('A apărut o eroare la încărcarea datelor. Te rugăm să încerci din nou.'));
  }
};

export default facilitiesSlice.reducer;
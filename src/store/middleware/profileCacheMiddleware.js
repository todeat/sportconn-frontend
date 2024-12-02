// src/store/middleware/profileCacheMiddleware.js
import { invalidateReservations, invalidateUserInfo, addReservation, removeReservation, addLocation } from '../slices/profileSlice';

export const profileCacheMiddleware = store => next => action => {
  // Rulăm acțiunea mai întâi
  const result = next(action);
  
  // Apoi verificăm dacă trebuie să invalidăm cache-ul
  switch (action.type) {

    case 'auth/logout':
      // Resetăm tot state-ul de profil la valorile inițiale
      store.dispatch({ type: 'profile/resetState' });
      break;

      
    // Când se face o rezervare nouă
    case 'booking/saveReservationSuccess':
      store.dispatch(addReservation(action.payload));
      break;
      
    // Când se șterge o rezervare
    case 'booking/deleteReservationSuccess':
      store.dispatch(removeReservation(action.payload));
      break;
      
    // Când se adaugă o locație nouă
    case 'locations/addLocationSuccess':
      store.dispatch(addLocation(action.payload));
      break;
      
    // Când se modifică profilul utilizatorului
    case 'auth/updateUserSuccess':
      store.dispatch(invalidateUserInfo());
      break;
      
    default:
      break;
  }
  
  return result;
};
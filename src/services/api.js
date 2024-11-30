// src/services/api.js

import { auth } from "../firebase";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const checkUserExists = async ({ phoneNumber, email }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/checkUserExists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, email }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};



export const createUser = async (userData, firebaseToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/createUser`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'user' // default role
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
};

export const getLocationInfo = async (locationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${locationId}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching location info:', error);
      throw error;
    }
};

export const getSports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/getSports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
}

export const getCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/getCities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
}

export const addLocationPending = async (locationData, courtsData, firebaseToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/addLocationPending`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        locationInfo: {
          locationName: locationData.locationName,
          address: locationData.address,
          city: locationData.city,
          lat: locationData.lat || null,
          lng: locationData.lng || null,
          schedule: locationData.schedule.map(schedule => ({
            dayOfWeek: schedule.dayOfWeek,
            oraStart: schedule.oraStart,
            oraEnd: schedule.oraEnd,
            isOpen: schedule.isOpen
          }))
        },
        courtsInfo: courtsData.map(court => ({
          name: court.name,
          sport: court.sport,
          covered: court.covered,
          pricePerHour: parseFloat(court.pricePerHour)
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding pending location:', error);
    throw error;
  }
};



export const getUserInfo = async (firebaseToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/getUserInfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }
  catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const getLocationSchedule = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.firebaseToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();

  }
  catch (error) {
    console.error('Error fetching location schedule:', error);
    throw error;
  }
}

export const deleteReservation = async(reservationId) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/reservations/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reservationId: reservationId, token: token }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }
  catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
}


export async function saveReservation(data) {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await response.json();
    
    if (jsonResponse.success) {
      return jsonResponse;
    } else {
      throw new Error(jsonResponse.message || 'Failed to save reservation');
    }
  }
  catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
}

export async function getAvailableTimeSlots(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/available-slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();

  }
  catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
}

export async function getUserReservations(data) {
  try {
     data.token = await auth.currentUser.getIdToken();

    const response = await fetch(`${API_BASE_URL}/reservations/user-reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Citește corpul răspunsului o singură dată
    const jsonResponse = await response.json();
    if (!response.ok) {
      throw new Error(jsonResponse.message || 'Network response was not ok');
    }

    return jsonResponse;

  } catch (error) {
    console.error('Error fetching user reservation:', error);
    throw error;
  }
}

export async function getFacilities(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/facilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();

  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
}



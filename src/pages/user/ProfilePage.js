import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, MapPin, Building2, CheckCircle2, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../layout/PageLayout';
import LoadingSpinner from '../../components/all/LoadingSpinner';
import { auth } from '../../firebase';
import { getUserInfo, getUserReservations } from '../../services/api';
import UserReservations from '../../components/user/UserReservations';
import { logout, setError } from '../../store/slices/authSlice';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    userInfo: null,
    reservations: null
  });

  // const [userInfo, setUserInfo] = useState(null);
  // const [reservations, setReservations] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Generăm token-ul o singură dată
        const token = await auth.currentUser.getIdToken();
        
        // Executăm ambele request-uri în paralel
        const [userInfoResponse, reservationsResponse] = await Promise.all([
          getUserInfo(token),
          getUserReservations({ token })
        ]);
        
        setProfileData({
          userInfo: userInfoResponse.userInfo,
          reservations: reservationsResponse.success ? reservationsResponse : { upcoming_reservations: [] }
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        dispatch(setError('A apărut o eroare la încărcarea datelor. Te rugăm să încerci din nou.'));
        setProfileData({
          userInfo: null,
          reservations: { upcoming_reservations: [] }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [dispatch]);


  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă profilul..." />
        </div>
      </PageLayout>
    );
  }

  const { userInfo, reservations } = profileData;

  return (
    <PageLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Info Card */}
          
          <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">
                    {userInfo.firstname} {userInfo.lastname}
                  </h1>
                  <p className="text-primary-200">@{userInfo.username}</p>
                </div>
              </div>
              <LogOut 
                className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" 
                onClick={handleLogout}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Building2 className="h-5 w-5" />
                <span>{userInfo.phonenumber}</span>
              </div>
            </div>
          </div>
          </div>

          {/* Admin Locations Section */}
          {userInfo.adminInfo && userInfo.adminInfo.isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary">
                Bazele mele sportive ({userInfo.adminInfo.locationsCount})
              </h2>
              
              {userInfo.adminInfo.locationsInfo.map((location) => (
              <div key={location.locationId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{location.locationName}</h3>
                      <p className="text-gray-600">{location.address}, {location.cityName}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        location.status === 'valid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {location.status === 'valid' ? 'Validată' : 'În așteptare'}
                      </div>
                      {location.status === 'valid' && (
                        <button
                          onClick={() => navigate(`/location/${location.locationId}/schedule`)}
                          className="px-4 py-2 bg-primary hover:bg-primary-100 text-white rounded-lg transition-colors duration-200"
                        >
                          Management
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {location.courts.map((court) => (
                      <div key={court.courtid} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-primary">{court.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{court.sport}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{court.priceperhour} RON/h</p>
                          {court.covered && (
                            <span className="text-xs text-primary-200">Acoperit</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <Clock className="w-7 h-7 mr-2" />
              Rezervările mele
            </h2>
            <UserReservations
              upcomingReservations={reservations?.upcoming_reservations} 
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
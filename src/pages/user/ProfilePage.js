import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, MapPin, Building2, CheckCircle2, Clock, LogOut, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../layout/PageLayout';
import LoadingSpinner from '../../components/all/LoadingSpinner';
import { auth } from '../../firebase';
import UserReservations from '../../components/user/UserReservations';
import { logout, logoutUser, setError } from '../../store/slices/authSlice';
import { fetchProfileData, selectProfileData } from '../../store/slices/profileSlice';
import EmailEditModal from '../../components/user/EmailEditModal';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  
  const { 
    userInfo, 
    reservations, 
    isFetching, 
    error 
  } = useSelector(selectProfileData);

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(setError(error.message));
    }
  };

  const handleEmailUpdate = (newEmail) => {
    dispatch(fetchProfileData(true));
  };

  // Show loading state only if we're fetching AND we don't have any cached data
  if (isFetching && !userInfo) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă profilul..." />
        </div>
      </PageLayout>
    );
  }

  // Show error state if we have an error and no cached data
  if (error && !userInfo) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </PageLayout>
    );
  }

  // Return early if we don't have userInfo
  if (!userInfo) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă datele..." />
        </div>
      </PageLayout>
    );
  }

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
                  {!userInfo.isEmailVerified && (
                    <Pencil
                      className="h-4 w-4 text-primary-200 cursor-pointer hover:text-primary transition-colors" 
                      title="Email neverificat"
                      onClick={() => setIsEmailModalOpen(true)}
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building2 className="h-5 w-5" />
                  <span>{userInfo.phonenumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Locations Section */}
          {userInfo.adminInfo?.isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary">
                Bazele mele sportive ({userInfo.adminInfo.locationsCount})
              </h2>
              
              {userInfo.adminInfo.locationsInfo?.map((location) => (
                <div key={location.locationId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {location.locationName}
                        </h3>
                        <p className="text-gray-600">
                          {location.address}, {location.cityName}
                        </p>
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
                      {location.courts?.map((court) => (
                        <div 
                          key={court.courtid} 
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-primary">{court.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{court.sport}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              {court.priceperhour} RON/h
                            </p>
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

          {/* Reservations Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <Clock className="w-7 h-7 mr-2" />
              Rezervările mele
            </h2>
            {isFetching ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner text="Se actualizează rezervările..." />
              </div>
            ) : (
              <UserReservations
                upcomingReservations={reservations?.upcoming_reservations} 
              />
            )}
          </div>
        </div>
        <EmailEditModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          currentEmail={userInfo.email}
          onEmailUpdate={handleEmailUpdate}
        />
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
// src/pages/facility/RegisterFacilityPage.js
import React, { useEffect, useState } from 'react';
import { MapPin, Building2, MapPinned, AlertTriangle, ArrowRight } from 'lucide-react';
import PageLayout from '../../layout/PageLayout';
import { ScheduleSection } from '../../components/admin/ScheduleSection';
import { CourtsSection } from '../../components/admin/CourtsSection';
import { addLocationPending, getCities } from '../../services/api';
import LoadingSpinner from '../../components/all/LoadingSpinner';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { fetchProfileData } from '../../store/slices/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

const RegisterFacilityPage = () => {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.profile.userInfo);

  const isEmailVerified = userInfo?.isEmailVerified;


  const [locationInfo, setLocationInfo] = useState({
    locationName: '',
    address: '',
    city: '',
    schedule: [
      { dayOfWeek: 1, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Monday
      { dayOfWeek: 2, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Tuesday
      { dayOfWeek: 3, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Wednesday
      { dayOfWeek: 4, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Thursday
      { dayOfWeek: 5, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Friday
      { dayOfWeek: 6, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Saturday
      { dayOfWeek: 0, oraStart: '08:00', oraEnd: '22:00', isOpen: true },  // Sunday
    ]

  });

  const [courtsInfo, setCourtsInfo] = useState([]);


  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchProfileData());
    }
  }, [userInfo, dispatch]);


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities();
        setCities(response.all_cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);


  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...locationInfo.schedule];
    // Convert UI index to actual day of week index
    const dayOfWeek = index === 6 ? 0 : index + 1;
    
    // Find the correct schedule entry by dayOfWeek
    const scheduleIndex = newSchedule.findIndex(s => s.dayOfWeek === dayOfWeek);
    newSchedule[scheduleIndex] = { 
      ...newSchedule[scheduleIndex], 
      [field]: value,
      dayOfWeek // Ensure dayOfWeek is preserved
    };
    
    setLocationInfo({ ...locationInfo, schedule: newSchedule });
  };

  const handleAddCourt = () => {
    setCourtsInfo([
      ...courtsInfo,
      {
        name: `Teren ${courtsInfo.length + 1}`,
        sport: 'Fotbal',
        covered: false,
        pricePerHour: ''
      }
    ]);
  };

  if (loadingCities && step === 1) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă..." />
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = async () => {

    if (!isEmailVerified) {
      navigate('/profile');
      return;
    }

    try {
      setSubmitting(true);
      
      // Get the current user's Firebase token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      
      const formattedCourtsInfo = courtsInfo.map(court => ({
        ...court,
        sport: court.sport.toLowerCase(),
        pricePerHour: parseFloat(court.pricePerHour)
      }));
      
      
      const response = await addLocationPending({
        locationInfo: {
          locationName: locationInfo.locationName,
          address: locationInfo.address,
          city: locationInfo.city,
          schedule: locationInfo.schedule,
        },
        courtsInfo: formattedCourtsInfo
      });
      
      if (response.success) {
        // Forțăm reîmprospătarea datelor profilului înainte de navigare
        await dispatch(fetchProfileData(true));
        navigate('/profile');
      } else {
        throw new Error(response.message || 'Failed to add location');
      }
      
    } catch (error) {
      console.error('Failed to add location:', error);
      // You might want to show an error message to the user here
      alert('A apărut o eroare la înregistrarea bazei sportive. Vă rugăm să încercați din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderWarnings = () => {
    if (!isEmailVerified) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Email neverificat
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Pentru a putea înregistra o bază sportivă, trebuie să ai adresa de email verificată.</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-2 inline-flex items-center text-yellow-800 hover:text-yellow-900 font-medium"
                >
                  Mergi la profil pentru verificare
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  



  return (
    <PageLayout hideFooter>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {renderWarnings()}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Progress Steps */}
            <div className="mb-8 flex justify-center">
              <div className="flex items-center">
                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  step === 1 ? 'bg-primary text-white' : 'bg-primary-400 text-primary'
                }`}>
                  1
                </div>
                <div className="w-20 h-1 bg-primary-400"/>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  step === 2 ? 'bg-primary text-white' : 'bg-primary-400 text-primary'
                }`}>
                  2
                </div>
              </div>
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary text-center mb-8">
                  Informații Locație
                </h2>

                <div className="space-y-4">
                  {/* Location Info Fields */}
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numele Locației <span className="text-red-500">*</span>
                  </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={locationInfo.locationName}
                        onChange={(e) => setLocationInfo({...locationInfo, locationName: e.target.value})}
                        placeholder="Arena Sportivă Central"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresă <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={locationInfo.address}
                        onChange={(e) => setLocationInfo({...locationInfo, address: e.target.value})}
                        placeholder="Strada Sportului nr. 10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oraș <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={locationInfo.city}
                        onChange={(e) => setLocationInfo({...locationInfo, city: e.target.value})}
                      >
                        <option value="">Selectează orașul</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ScheduleSection 
                    schedule={locationInfo.schedule}
                    onScheduleChange={handleScheduleChange}
                  />
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!locationInfo.locationName || !locationInfo.address || !locationInfo.city}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      !locationInfo.locationName || !locationInfo.address || !locationInfo.city
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-100 text-white'
                    }`}
                  >
                    Continuă
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary text-center mb-8">
                  Terenuri Disponibile
                </h2>

                <CourtsSection
                  courts={courtsInfo}
                  onAddCourt={handleAddCourt}
                  onUpdateCourt={(index, field, value) => {
                    const newCourts = [...courtsInfo];
                    newCourts[index] = { ...newCourts[index], [field]: value };
                    setCourtsInfo(newCourts);
                  }}
                  onRemoveCourt={(index) => {
                    setCourtsInfo(courtsInfo.filter((_, i) => i !== index));
                  }}
                />

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary-400/10 transition-colors duration-200"
                  >
                    Înapoi
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || courtsInfo.length === 0 || !isEmailVerified}
                    className="bg-primary hover:bg-primary-100 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Se procesează...
                      </>
                    ) : (
                      'Finalizează'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RegisterFacilityPage;
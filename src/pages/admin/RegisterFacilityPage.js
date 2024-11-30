// src/pages/facility/RegisterFacilityPage.js
import React, { useEffect, useState } from 'react';
import { MapPin, Building2, MapPinned } from 'lucide-react';
import PageLayout from '../../layout/PageLayout';
import { ScheduleSection } from '../../components/admin/ScheduleSection';
import { CourtsSection } from '../../components/admin/CourtsSection';
import { addLocationPending, getCities } from '../../services/api';
import LoadingSpinner from '../../components/all/LoadingSpinner';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const RegisterFacilityPage = () => {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [locationInfo, setLocationInfo] = useState({
    locationName: '',
    address: '',
    city: '',
    schedule: Array(7).fill().map((_, index) => ({
      dayOfWeek: index,
      oraStart: '08:00',
      oraEnd: '22:00',
      isOpen: true
    }))
  });

  const [courtsInfo, setCourtsInfo] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities();
        setCities(response.all_cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);


  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...locationInfo.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
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

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center">
          <LoadingSpinner text="" />
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Get the current user's Firebase token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      const firebaseToken = await currentUser.getIdToken();
      
      const formattedCourtsInfo = courtsInfo.map(court => ({
        ...court,
        sport: court.sport.toLowerCase(),
        pricePerHour: parseFloat(court.pricePerHour)
      }));
      
      // Call the API to add the pending location
      const response = await addLocationPending(locationInfo, formattedCourtsInfo, firebaseToken);

      
      console.log('Successfully added location:', response);
      
      // Navigate to home page
      navigate('/profile');
      
    } catch (error) {
      console.error('Failed to add location:', error);
      // You might want to show an error message to the user here
      alert('A apărut o eroare la înregistrarea bazei sportive. Vă rugăm să încercați din nou.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <PageLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
                      Numele Locației
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
                      Adresă
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
                      Oraș
                    </label>
                    <div className="relative">
                      <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
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
                    className="bg-primary hover:bg-primary-100 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
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
                    className="bg-primary hover:bg-primary-100 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    disabled={courtsInfo.length === 0}
                  >
                    Finalizează
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
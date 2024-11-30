import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Clock, Shield, Sun, Cloud, Euro, Calendar, Info, MapPinned, Camera, Wallet, Wallet2 } from 'lucide-react';
import { getLocationInfo } from '../../services/api';
import PageLayout from '../../layout/PageLayout';
import LoadingSpinner from '../../components/all/LoadingSpinner';
import LocationDescription from '../../components/facility/LocationDescription';
import CourtsCarousel from '../../components/facility/CourtsDisplay';
import CourtsDisplay from '../../components/facility/CourtsDisplay';
import SmartSchedule from '../../components/facility/SmartSchedule';
import AvailabilityCheck from '../../components/facility/AvailabilityCheck';


const LocationDetails = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { locationId } = useParams();

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await getLocationInfo(locationId);
        setLocationData(response.locationInfo);
      } catch (error) {
        console.error('Error fetching location details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [locationId]);

  const getDayName = (dayIndex) => {
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    return days[dayIndex];
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă detaliile locației..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Banner */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-6">{locationData.name}</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 text-primary-400">
              <MapPin className="h-5 w-5" />
              <span>{locationData.address}, {locationData.city}</span>
            </div>
            <div className="flex items-center space-x-2 text-primary-400">
              <Phone className="h-5 w-5" />
              <span>{locationData.phoneNumbers[0]}</span>
            </div>
          </div>
          {locationData.description && (
            <LocationDescription description={locationData.description} />
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary-400/10 rounded-lg">
                  <MapPinned className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Locație</h3>
              </div>
              <p className="text-sm text-primary-100">
                Bază sportivă situată în {locationData.city}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary-400/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Preț/oră</h3>
              </div>
              <p className="text-sm text-primary-100">
                De la {Math.min(...locationData.courts.map(c => Number(c.priceperhour)))} RON
                <br />
                până la {Math.max(...locationData.courts.map(c => Number(c.priceperhour)))} RON
              </p>
            </div>
          </div>
        </div> */}

        <SmartSchedule schedule={locationData.schedule} />

        {/* Terenuri Disponibile */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Terenuri Disponibile</h2>
          <CourtsDisplay courts={locationData.courts} />
        </div>

        <div className="space-y-6">
          <AvailabilityCheck
            locationId={locationId} 
            sports={locationData.sports}
          />
        </div>

      </div>
    </PageLayout>
  );
};

export default LocationDetails;
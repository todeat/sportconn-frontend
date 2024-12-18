// src/pages/admin/facility/LocationSchedulePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../../../firebase';
import { getLocationSchedule } from '../../../services/api';
import PageLayout from '../../../layout/PageLayout';
import LoadingSpinner from '../../../components/all/LoadingSpinner';
import LocationScheduleComponent from '../../../components/admin/facility/LocationSchedule';
import { format } from 'date-fns';

const LocationSchedulePage = () => {
  const { locationId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchSchedule = async (date) => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await getLocationSchedule({
        firebaseToken: token,
        selectedDate: date,
        locationId: locationId
      });
      setSchedule(response.schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedDate(new Date(currentDate));
    fetchSchedule(currentDate);
  }, [locationId]);

  const handleDateChange = (newDate) => {
    setSelectedDate(new Date(newDate));
    fetchSchedule(newDate);
  };

  const handleReservationDelete = () => {
    // Reîncarcă programul pentru data curentă
    fetchSchedule(format(selectedDate, 'yyyy-MM-dd'));
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <LoadingSpinner text="Se încarcă programul..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout hideFooter>
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-primary-400/50">
        <div className="max-w-5xl mx-auto">
          <LocationScheduleComponent
            schedule={schedule}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onReservationDelete={handleReservationDelete}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default LocationSchedulePage;
import React from 'react';
import { Calendar, MapPin, Clock, ChevronRight, Phone } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const UserReservations = ({ upcomingReservations }) => {
  const navigate = useNavigate();

  if (!upcomingReservations || upcomingReservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <Calendar className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">
            Nu ai nicio rezervare viitoare
          </h3>
          <p className="text-primary-100 mb-6">
            Găsește terenul perfect pentru tine și fă prima ta rezervare chiar acum!
          </p>
          <button
            onClick={() => navigate('/facilities')}
            className="bg-primary hover:bg-primary-100 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
          >
            Fă o rezervare
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {upcomingReservations.map((reservation) => (
          <div
            key={reservation.reservationId}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      {reservation.locationName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-primary-100 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {reservation.cityName}
                      </p>
                      <p className="text-primary-100 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {reservation.phoneNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {reservation.courtName}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-400/10 text-primary-100 capitalize">
                      {reservation.sportName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:text-right">
                  <div className="flex items-center text-primary sm:justify-end">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {format(parseISO(reservation.dataOraStart), 'dd MMMM yyyy', {
                        locale: ro,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-primary-100 sm:justify-end">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {format(parseISO(reservation.dataOraStart), 'HH:mm')} -{' '}
                      {format(parseISO(reservation.dataOraEnd), 'HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReservations;
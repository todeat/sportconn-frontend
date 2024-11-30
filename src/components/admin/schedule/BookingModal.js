import React, { useState } from 'react';
import { addDays, format, isBefore, parse } from 'date-fns';
import { Clock, X, Info } from 'lucide-react';
import { saveReservation } from '../../../services/api';
import { auth } from '../../../firebase';

export const BookingModal = ({ 
    isOpen, 
    onClose, 
    availableTimes, 
    selectedDate, 
    courtId, 
    courtName,
    onReservationComplete 
  }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleBook = async () => {
      if (!startTime || !endTime) return;
      
      try {
        setLoading(true);
        
        let startDateTime = parse(startTime, 'HH:mm', selectedDate);
        let endDateTime = parse(endTime, 'HH:mm', selectedDate);
        
        // Ajustăm datele pentru rezervările care trec peste miezul nopții
        if (isBefore(parse(startTime, 'HH:mm', new Date()), parse('04:00', 'HH:mm', new Date()))) {
          startDateTime = addDays(startDateTime, 1);
          endDateTime = addDays(endDateTime, 1);
        }
        
        if (endTime < startTime) {
          endDateTime = addDays(endDateTime, 1);
        }
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('User not authenticated');
        }
        
        const firebaseToken = await currentUser.getIdToken();
        
        const bookingData = {
          courtId: courtId,
          dataOraStart: format(startDateTime, 'yyyy-MM-dd HH:mm:ss'),
          dataOraEnd: format(endDateTime, 'yyyy-MM-dd HH:mm:ss'),
          name: `Rezervare ${courtName} ${format(startDateTime, 'HH:mm')}-${format(endDateTime, 'HH:mm')}`,
          firebaseToken: firebaseToken
        };
        const response = await saveReservation(bookingData);
        if (response.success) {
          // Notificăm componenta părinte că rezervarea a fost salvată
          onReservationComplete(format(startDateTime, 'yyyy-MM-dd'));
          onClose();
        } else {
          throw new Error(response.message || 'Failed to save reservation');
        }
        
      } catch (error) {
        console.error('Error saving reservation:', error);
        alert('A apărut o eroare la salvarea rezervării. Vă rugăm să încercați din nou.');
      } finally {
        setLoading(false);
      }
    };
  

  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    const startIndex = availableTimes.indexOf(startTime);
    return availableTimes.slice(startIndex + 1);
  };

  const isAfterMidnight = (time) => {
    return isBefore(parse(time, 'HH:mm', new Date()), parse('04:00', 'HH:mm', new Date()));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Rezervare nouă - {courtName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ora început
                </label>
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setEndTime('');
                  }}
                >
                  <option value="">Selectează ora</option>
                  {availableTimes.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}{isAfterMidnight(time) ? ' (ziua următoare)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ora sfârșit
                </label>
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={!startTime}
                >
                  <option value="">Selectează ora</option>
                  {getAvailableEndTimes().map((time) => (
                    <option key={time} value={time}>
                      {time}
                      {isAfterMidnight(time) && !isAfterMidnight(startTime) ? ' (ziua următoare)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {startTime && endTime && (
                <p className="flex items-center text-primary">
                  <Info className="w-4 h-4 mr-1" />
                  {isAfterMidnight(startTime) 
                    ? 'Rezervarea începe și se termină în ziua următoare'
                    : endTime < startTime 
                      ? 'Rezervarea se va încheia în ziua următoare'
                      : 'Rezervarea este în aceeași zi'}
                </p>
              )}
            </div>
            
            <button
                onClick={handleBook}
                disabled={!startTime || !endTime || loading}
                className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {loading ? (
                <span className="flex items-center justify-center">
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
                    Se salvează...
                </span>
                ) : (
                "Rezervă"
                )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
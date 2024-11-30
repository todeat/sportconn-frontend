import React, { useState } from 'react';
import { format, parseISO, addMinutes, formatISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, Clock, X, Info } from 'lucide-react';

const AvailabilityResults = ({ results, onClose, onBooking }) => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [duration, setDuration] = useState(60); // durata în minute
  
  if (!results || !results.length) return null;
  
  const locationInfo = results[0].locationInfo;
  const availableSlots = results[0].availableSlots;

  const isValidInterval = (startTime, minutes) => {
    if (!selectedCourt) return false;
    
    const courtSlots = availableSlots.find(slot => slot.courtId === selectedCourt);
    if (!courtSlots) return false;
    
    const start = new Date(startTime);
    const end = addMinutes(start, minutes);
    
    return courtSlots.availableSlots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return start >= slotStart && end <= slotEnd;
    });
  };

  const getStartTimeOptions = () => {
    if (!selectedCourt) return [];
    
    const courtSlots = availableSlots.find(slot => slot.courtId === selectedCourt);
    if (!courtSlots) return [];
    
    return courtSlots.availableSlots.flatMap(slot => {
      const options = [];
      let currentTime = new Date(slot.start);
      const endTime = new Date(slot.end);
      
      while (currentTime < endTime) {
        options.push(formatISO(currentTime));
        currentTime = addMinutes(currentTime, 30); // Păstrăm opțiunile la fiecare 30 de minute pentru start
      }
      
      return options;
    });
  };

  const getDurationOptions = () => {
    if (!selectedStartTime) return [];
    
    const options = [];
    let minutes = 60; // Începem de la o oră
    
    while (isValidInterval(selectedStartTime, minutes) && minutes <= 180) {
      options.push(minutes);
      minutes += 60; // Incrementăm cu o oră
    }
    
    return options;
  };

  const formatDuration = (minutes) => {
    return minutes === 60 ? '1 oră' : `${minutes / 60} ore`;
  };

  const handleBooking = () => {
    if (!selectedCourt || !selectedStartTime || !duration) return;
    
    const endTime = addMinutes(new Date(selectedStartTime), duration);
    
    onBooking({
      courtId: selectedCourt,
      startTime: selectedStartTime,
      endTime: formatISO(endTime)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-primary flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Intervale disponibile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Selectează terenul
            </label>
            <div className="grid grid-cols-2 gap-4">
              {availableSlots.map(court => (
                <button
                  key={court.courtId}
                  onClick={() => {
                    setSelectedCourt(court.courtId);
                    setSelectedStartTime('');
                    setDuration(60);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCourt === court.courtId
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{court.courtName}</div>
                  {/* <div className="text-sm text-gray-500 mt-1">
                    {court.availableSlots.length} intervale disponibile
                  </div> */}
                </button>
              ))}
            </div>
          </div>

          {selectedCourt && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ora de început
                </label>
                <select
                  value={selectedStartTime}
                  onChange={(e) => {
                    setSelectedStartTime(e.target.value);
                    setDuration(60);
                  }}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Selectează ora</option>
                  {getStartTimeOptions().map(time => (
                    <option key={time} value={time}>
                      {format(new Date(time), 'HH:mm', { locale: ro })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Durată
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  disabled={!selectedStartTime}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  {getDurationOptions().map(minutes => (
                    <option key={minutes} value={minutes}>
                      {formatDuration(minutes)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {selectedStartTime && duration && (
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-primary">
                <Info className="w-5 h-5" />
                <span>
                  Rezervare {format(new Date(selectedStartTime), 'HH:mm')} - {' '}
                  {format(addMinutes(new Date(selectedStartTime), duration), 'HH:mm')}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={!selectedCourt || !selectedStartTime || !duration}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Rezervă acum
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityResults;
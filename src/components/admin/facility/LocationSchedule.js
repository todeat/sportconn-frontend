import React, { useEffect, useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { ro } from 'date-fns/locale';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BookingModal } from '../schedule/BookingModal';
import { ReservationDetailsModal } from '../schedule/ReservationDetailsModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F2421'
    }
  }
});

const LocationSchedule = ({ onDateChange, schedule, selectedDate, onReservationDelete }) => {
  const [date, setDate] = useState(selectedDate);
  const [selectedCourt, setSelectedCourt] = useState(() => {
    const savedCourt = localStorage.getItem('lastSelectedCourt');
    return savedCourt && schedule[savedCourt] ? savedCourt : Object.keys(schedule)[0];
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    localStorage.setItem('lastSelectedCourt', selectedCourt);
  }, [selectedCourt]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange(format(newDate, 'yyyy-MM-dd'));
  };

  const handleShowDetails = (slot) => {
    setSelectedReservation(slot);
    setIsModalOpen(true);
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  const isPastDate = () => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  const hasAvailableCourts = () => {
    if (!schedule) return false;
    return Object.keys(schedule).length > 0;
  };

  const hasReservationsForDate = () => {
    if (!selectedCourt || !schedule[selectedCourt]) return false;
    return schedule[selectedCourt].schedule.some(slot => slot.type === 'reserved');
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <CalendarClock className="w-7 h-7 mr-2" />
              Program Terenuri
            </h2>
            
            <DatePicker
              value={date}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    "& .MuiInputBase-root": {
                      borderRadius: "0.5rem",
                      backgroundColor: "white"
                    }
                  }
                }
              }}
            />
          </div>

          {hasAvailableCourts() ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Courts Navigation */}
              <div className="border-b border-gray-100">
                <div className="relative">
                  <div className="flex overflow-x-auto scrollbar-hide py-4 px-6 gap-2">
                    {Object.entries(schedule).map(([courtId, courtData]) => (
                      <button
                        key={courtId}
                        onClick={() => setSelectedCourt(courtId)}
                        className={`
                          flex items-center px-4 py-2.5 rounded-lg transition-all duration-300
                          whitespace-nowrap font-medium text-sm
                          ${selectedCourt === courtId 
                            ? 'bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2' 
                            : 'text-primary-100 hover:bg-primary-400/10'
                          }
                        `}
                      >
                        {courtData.courtName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Court Details */}
              {selectedCourt && (
                <div className="p-4 bg-primary-400/5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {schedule[selectedCourt].courtName}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Time Slots */}
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {isPastDate() ? (
                  hasReservationsForDate() ? (
                    // Show past reservations
                    schedule[selectedCourt].schedule
                      .filter(slot => slot.type === 'reserved')
                      .map((slot, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-gray-400" />
                              <span className="text-lg font-medium text-gray-600">
                                {format(new Date(slot.start), 'HH:mm')} - {format(new Date(slot.end), 'HH:mm')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleShowDetails(slot)}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Info className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 pl-8">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{slot.reservationInfo.name}</span>
                              <br />
                              <span className="text-gray-500">
                                Client: {slot.reservationInfo.user.name}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    // Show message for past date with no reservations
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nu au fost făcute rezervări în această zi</p>
                    </div>
                  )
                ) : (
                  // Show normal schedule for current/future dates
                  schedule[selectedCourt].schedule.map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => slot.type === 'available' ? handleBookSlot(slot) : null}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200
                        ${slot.type === 'available' 
                          ? 'border-green-200 bg-green-50 hover:border-green-300 hover:shadow-md cursor-pointer' 
                          : 'border-red-200 bg-red-50'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-primary" />
                          <span className="text-lg font-medium text-primary">
                            {format(new Date(slot.start), 'HH:mm')} - {format(new Date(slot.end), 'HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${slot.type === 'available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                            }
                          `}>
                            {slot.type === 'available' ? 'Disponibil' : 'Rezervat'}
                          </span>
                          {slot.type === 'reserved' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowDetails(slot);
                              }}
                              className="p-2 text-primary hover:bg-primary-400/10 rounded-full transition-colors"
                            >
                              <Info className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {slot.type === 'reserved' && (
                        <div className="mt-3 pl-8">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{slot.reservationInfo.name}</span>
                            <br />
                            <span className="text-primary-100">
                              Client: {slot.reservationInfo.user.name}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nu există programări pentru această dată</p>
            </div>
          )}

          {/* Modals */}
          {selectedReservation && (
            <ReservationDetailsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              reservation={selectedReservation}
              onDeleteSuccess={onReservationDelete}
            />
          )}

          {selectedSlot && (
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              availableTimes={selectedSlot.availableTimes}
              selectedDate={date}
              courtId={selectedSlot.courtId}
              courtName={selectedSlot.courtName}
              onReservationComplete={(date) => {
                onDateChange(date);
                setIsBookingModalOpen(false);
              }}
            />
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default LocationSchedule;
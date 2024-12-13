import React, { useEffect, useRef, useState } from 'react';
import { format, parseISO, addMinutes, formatISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, Search, Info, ArrowRight } from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getAvailableTimeSlots } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BookingConfirmationModal from '../all/BookingConfirmationModal';
import { selectPendingBooking, setPendingBooking, setReturnPath } from "../../store/slices/bookingSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F2421'
    }
  }
});

const AvailabilityCheck = ({ locationId, sports }) => {

    const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // Verifică dacă există date salvate în location.state
  const bookingDetails = useSelector(selectPendingBooking);

  // Inițializează state-ul cu datele salvate sau cu valori implicite
  const [selectedDate, setSelectedDate] = useState(
    bookingDetails?.selectedDate ? new Date(bookingDetails.selectedDate) : new Date()
  );
  const [selectedSport, setSelectedSport] = useState(
    bookingDetails?.selectedSport || (sports.length === 1 ? sports[0].sportid : '')
  );
  const [selectedCourt, setSelectedCourt] = useState(bookingDetails?.selectedCourt || null);
  const [selectedStartTime, setSelectedStartTime] = useState(bookingDetails?.selectedStartTime || '');
  const [duration, setDuration] = useState(bookingDetails?.duration || 60);  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);
  const dispatch = useDispatch();

  // Efect pentru a reîncărca rezultatele dacă există date salvate
  useEffect(() => {
    if (bookingDetails) {
      setSelectedDate(new Date(bookingDetails.selectedDate));
      setSelectedSport(bookingDetails.selectedSport);
      setSelectedCourt(bookingDetails.selectedCourt);
      setSelectedStartTime(bookingDetails.selectedStartTime);
      setDuration(bookingDetails.duration);
  
      handleCheck();
    }
  }, [bookingDetails]);




  const isValidInterval = (startTime, minutes) => {
    if (!selectedCourt || !results) return false;
    
    const locationResult = results[0];
    const courtSlots = locationResult.availableSlots.find(
      slot => slot.courtId === selectedCourt
    );
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
    if (!selectedCourt || !results) return [];
    
    const locationResult = results[0];
    const courtSlots = locationResult.availableSlots.find(
      slot => slot.courtId === selectedCourt
    );
    if (!courtSlots) return [];
    
    return courtSlots.availableSlots.flatMap(slot => {
      const options = [];
      let currentTime = new Date(slot.start);
      const endTime = new Date(slot.end);
      
      // Calculăm timpul minim necesar pentru o rezervare (30 minute)
      const minBookingTime = 30 * 60 * 1000; // 30 minute în milisecunde
      
      // Adăugăm opțiuni atât timp cât există cel puțin 30 minute disponibile
      while (currentTime.getTime() + minBookingTime <= endTime.getTime()) {
        // Verificăm dacă acest timp de start permite cel puțin o oră de rezervare
        if (currentTime.getTime() + (60 * 60 * 1000) <= endTime.getTime()) {
          options.push(formatISO(currentTime));
        }
        currentTime = addMinutes(currentTime, 30);
      }
      
      return options;
    });
  };
  

  const getDurationOptions = () => {
    if (!selectedStartTime) return [];
    
    const options = [];
    let minutes = 60; // Începem cu o oră (durata minimă)
    
    while (isValidInterval(selectedStartTime, minutes) && minutes <= 180) {
      options.push(minutes);
      // Adăugăm jumătăți de oră dacă următoarea jumătate de oră este validă
      if (isValidInterval(selectedStartTime, minutes + 30) && (minutes + 30) <= 180) {
        options.push(minutes + 30);
      }
      minutes += 60;
    }
    
    return options;
  };

  const resultsRef = useRef(null);
  const courtSelectionRef = useRef(null);
  const timeSelectionRef = useRef(null);
  const bookingSummaryRef = useRef(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [results]);

  // Effect pentru scroll când se selectează un teren
  useEffect(() => {
    if (selectedCourt && timeSelectionRef.current) {
      timeSelectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [selectedCourt]);

  useEffect(() => {
    if (selectedStartTime && bookingSummaryRef.current) {
      bookingSummaryRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, [selectedStartTime]);


  const handleCheck = async () => {
    try {
      setLoading(true);
      const response = await getAvailableTimeSlots({
        selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        locationId,
        sportId: selectedSport
      });

      
      if (response.success) {
        setResults(response.results);
        if (!bookingDetails) {
          setSelectedCourt(null);
          setSelectedStartTime('');
          setDuration(60);
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedCourt || !selectedStartTime || !duration) return;

    if (!user) {
      // Salvează detaliile rezervării în Redux
      dispatch(
        setPendingBooking({
          selectedDate: selectedDate.toISOString(),
          selectedSport,
          selectedCourt,
          selectedStartTime,
          duration,
        })
      );
      
      dispatch(setReturnPath(location.pathname));

      // Redirecționează către pagina de login
      navigate('/register');
      return;
    }
    
    const endTime = addMinutes(new Date(selectedStartTime), duration);
    const selectedCourtInfo = results[0].availableSlots.find(c => c.courtId === selectedCourt);
    
    setConfirmationDetails({
      courtId: selectedCourt,
      startTime: selectedStartTime,
      endTime: formatISO(endTime),
      sportName: selectedCourtInfo.sport.name,
      pricePerHour: selectedCourtInfo.pricePerHour
    });
    
    setShowConfirmation(true);
  };

  const hasAvailableCourts = () => {
    if (!results || !results[0]?.availableSlots) return false;
    return results[0].availableSlots.some(court => court.availableSlots.length > 0);
  };

  // Filter courts to only show those with available slots
  const getAvailableCourts = () => {
      if (!results || !results[0]?.availableSlots) return [];
      return results[0].availableSlots.filter(court => court.availableSlots.length > 0);
  };





  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
        <div className="space-y-8">
          {/* Formular de verificare */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-primary">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                Verifică disponibilitatea
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sports.length > 1 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sport
                    </label>
                    <select
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Selectează sportul</option>
                      {sports.map((sport) => (
                        <option key={sport.sportid} value={sport.sportid}>
                          {sport.sport.charAt(0).toUpperCase() + sport.sport.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Data
                  </label>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    format="dd/MM/yyyy"
                    disablePast
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            height: '42px',
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleCheck}
                disabled={!selectedSport || loading}
                className="mt-6 w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
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
                    Se verifică...
                  </span>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Verifică disponibilitatea
                  </>
                )}
              </button>
            </div>
          </div>

          {results && (
  <div 
    ref={resultsRef}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-xl font-semibold text-primary">
        {hasAvailableCourts() ? 'Rezervă un teren' : 'Nu există terenuri disponibile'}
      </h3>
    </div>
    
    <div className="p-6 space-y-8">
      {hasAvailableCourts() ? (
        <>
          {/* Selector Terenuri */}
          <div className="space-y-4" ref={courtSelectionRef}>
            <label className="block text-sm font-medium text-gray-700">
              Alege terenul
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getAvailableCourts().map(court => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Selectori pentru timp și durată */}
          {selectedCourt && (
            <div ref={timeSelectionRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {getDurationOptions().map(minutes => (
                    <option key={minutes} value={minutes}>
                      {minutes === 60 ? '1 oră' : `${minutes / 60} ore`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Sumar și buton de rezervare */}
          {selectedStartTime && duration && (
            <div 
              className="space-y-4"
              ref={bookingSummaryRef}
            >
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-primary">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Rezervare pentru {format(new Date(selectedStartTime), 'HH:mm')} - {' '}
                    {format(addMinutes(new Date(selectedStartTime), duration), 'HH:mm')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <span>Continuă rezervarea</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Nu există intervale disponibile pentru data selectată. 
            Vă rugăm să selectați o altă dată.
          </p>
        </div>
      )}
    </div>
  </div>
)}

      {confirmationDetails && (
        <BookingConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          bookingDetails={confirmationDetails}
          locationName={results[0].locationInfo.name}
          courtName={results[0].availableSlots.find(c => c.courtId === selectedCourt)?.courtName}
          sportName={confirmationDetails.sportName}
          pricePerHour={results[0].availableSlots.find(c => c.courtId === selectedCourt)?.pricePerHour}
        />
      )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AvailabilityCheck;
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Check, X, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { auth } from '../../firebase';
import { saveReservation } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearPendingBooking, clearReturnPath } from '../../store/slices/bookingSlice';

const BookingConfirmationModal = ({ 
  isOpen, 
  onClose, 
  bookingDetails,
  locationName,
  courtName,
  sportName
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const formatToLocalISO = (date) => {
        const tzOffset = date.getTimezoneOffset() * 60000; // Offset în milisecunde
        const localDate = new Date(date.getTime() - tzOffset);
        return localDate.toISOString().slice(0, 19); // Păstrează doar `YYYY-MM-DDTHH:mm:ss`
      };

      const reservationData = {
        courtId: bookingDetails.courtId,
        dataOraStart: formatToLocalISO(new Date(bookingDetails.startTime)), // Fără UTC
        dataOraEnd: formatToLocalISO(new Date(bookingDetails.endTime)),
        name: `Rezervare ${courtName} ${format(parseISO(bookingDetails.startTime), 'HH:mm')}-${format(parseISO(bookingDetails.endTime), 'HH:mm')}`
      };
  
  
      const response = await saveReservation(reservationData);
  
      if (response.success) {
        dispatch(clearPendingBooking());
        dispatch(clearReturnPath());
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('A apărut o eroare la salvarea rezervării. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm " onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Check className="w-6 h-6 mr-2" />
              Confirmă rezervarea
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-primary/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center text-primary">
                <MapPin className="w-5 h-5 mr-2" />
                <div>
                  <h4 className="font-medium">{locationName}</h4>
                  <p className="text-sm text-primary-100">
                    {courtName} - {sportName}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-primary">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {format(parseISO(bookingDetails.startTime), 'dd MMMM yyyy', {
                    locale: ro,
                  })}
                </span>
              </div>

              <div className="flex items-center text-primary">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  {format(parseISO(bookingDetails.startTime), 'HH:mm')} - {' '}
                  {format(parseISO(bookingDetails.endTime), 'HH:mm')}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3 px-4 bg-primary hover:bg-primary-100 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  'Confirmă Rezervarea'
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full py-3 px-4 border border-primary text-primary hover:bg-primary/5 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmationModal;
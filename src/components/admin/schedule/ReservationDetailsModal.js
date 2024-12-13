import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, X, User, Phone, Mail, ClipboardList, Trash2, Check, Tag } from 'lucide-react';
import { deleteReservation } from '../../../services/api';

export const ReservationDetailsModal = ({ isOpen, onClose, reservation, onDeleteSuccess }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      const reservationId = reservation.reservationInfo.id;
      
      if (!reservationId) {
        throw new Error('Reservation ID is missing');
      }

      await deleteReservation(reservationId);
      onClose();

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('A apărut o eroare la ștergerea rezervării. Vă rugăm să încercați din nou.');
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  // Reset confirmation state when modal is closed
  const handleClose = () => {
    setIsConfirmingDelete(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <ClipboardList className="w-6 h-6 mr-2" />
              Detalii Rezervare
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`transition-all duration-200 p-2 rounded-lg flex items-center ${
                  isConfirmingDelete
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 px-3'
                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                }`}
                title={isConfirmingDelete ? "Confirmă ștergerea" : "Șterge rezervarea"}
              >
                {isDeleting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  </span>
                ) : isConfirmingDelete ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Confirmă</span>
                  </>
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-primary">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="font-medium">Interval Orar</p>
                  <p className="text-gray-600">
                    {format(parseISO(reservation.start), 'HH:mm')} - {format(parseISO(reservation.end), 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-primary">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-medium">Durată</p>
                  <p className="text-gray-600">{reservation.reservationInfo.duration} ore</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-primary">
                <Tag className="w-5 h-5" />
                <div>
                  <p className="font-medium">Preț Total</p>
                  <p className="text-gray-600">{reservation.reservationInfo.totalPrice} RON</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-primary mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informații Client
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{reservation.reservationInfo.user.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{reservation.reservationInfo.user.phoneNumber}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{reservation.reservationInfo.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
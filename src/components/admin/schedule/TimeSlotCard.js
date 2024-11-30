import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, Info } from 'lucide-react';

export const TimeSlotCard = ({ slot, onShowDetails, onBook }) => (
  <div 
    className={`relative p-4 rounded-lg border ${
      slot.type === 'available' 
        ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors' 
        : 'border-red-200 bg-red-50'
    }`}
    onClick={() => {
      if (slot.type === 'available') {
        onBook(slot);
      }
    }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-primary" />
        <span className="text-lg font-medium text-primary">
          {format(parseISO(slot.start), 'HH:mm')} - {format(parseISO(slot.end), 'HH:mm')}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          slot.type === 'available'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {slot.type === 'available' ? 'Disponibil' : 'Rezervat'}
        </span>
        {slot.type === 'reserved' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails(slot);
            }}
            className="ml-2 p-2 text-primary hover:bg-gray-100 rounded-full transition-colors"
            title="Vezi detalii rezervare"
          >
            <Info className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
    
    {slot.type === 'reserved' && (
      <div className="mt-2 text-sm text-gray-600">
        <p className="font-medium">{slot.reservationInfo.name}</p>
        <p>Client: {slot.reservationInfo.user.name}</p>
      </div>
    )}
  </div>
);

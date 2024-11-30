import React from 'react';
import { MapPin } from 'lucide-react';

export const CourtTab = ({ court, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-primary text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <MapPin className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : 'text-primary'}`} />
    <span className="text-sm font-medium whitespace-nowrap">{court.courtName}</span>
  </button>
);
import React from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

export const DatePickerButton = ({ date, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
  >
    <Calendar className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium text-primary">
      {format(date, 'dd MMM yyyy', { locale: ro })}
    </span>
  </button>
);
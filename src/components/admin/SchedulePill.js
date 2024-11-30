import React from 'react';
import { ToggleSwitch } from '../all/ToggleSwitch';
import { TimeSelector } from '../all/TimeSelector';

export const SchedulePill = ({ day, isOpen, oraStart, oraEnd, onScheduleChange }) => {
  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-200 ${!isOpen ? 'opacity-75' : ''}`}>
      {/* Layout pentru mobile - stacking vertical */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-[120px_80px_1fr] sm:items-center sm:gap-4">
        {/* Ziua și toggle-ul pe aceeași linie pe mobile */}
        <div className="flex justify-between items-center sm:block">
          <div className="text-gray-700 font-medium">
            {day}
          </div>
          
          {/* Toggle switch poziționat la dreapta pe mobile, în coloana sa pe desktop */}
          <div className="sm:hidden">
            <ToggleSwitch
              checked={isOpen}
              onChange={(e) => onScheduleChange('isOpen', e.target.checked)}
              label=""
            />
          </div>
        </div>

        {/* Toggle switch ascuns pe mobile, vizibil pe desktop */}
        <div className="hidden sm:block">
          <ToggleSwitch
            checked={isOpen}
            onChange={(e) => onScheduleChange('isOpen', e.target.checked)}
            label=""
          />
        </div>

        {/* Time selectors - full width pe mobile, aliniate la dreapta pe desktop */}
        <div className="flex items-center space-x-2 sm:space-x-3 sm:justify-end">
          <TimeSelector
            value={oraStart}
            onChange={(value) => onScheduleChange('oraStart', value)}
            disabled={!isOpen}
          />
          <span className="text-gray-500">-</span>
          <TimeSelector
            value={oraEnd}
            onChange={(value) => onScheduleChange('oraEnd', value)}
            disabled={!isOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulePill;
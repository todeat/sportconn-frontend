//src/components/all/TimeSelector.js

import React from 'react';

export const TimeSelector = ({ value, onChange, disabled }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
  >
    {Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
    })}
  </select>
);
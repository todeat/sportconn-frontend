import React from 'react';

const LoadingSpinner = ({ text = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-primary-300 border-t-primary rounded-full animate-spin" />
      {text && (
        <p className="text-primary-200 font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
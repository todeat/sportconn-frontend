import React, { useState, useEffect } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const LocationDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!description) return null;

  return (
    <div className="mt-6">
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-primary-400 hover:text-white transition-colors sm:hidden"
        >
          <FileText className="w-5 h-5" />
          <span>
            Descrizere
          </span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
      
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isMobile ? (isExpanded ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0') : 'mt-4 block'}
        `}
      >
        <div className="text-primary-400 sm:max-w-3xl">
          <p className="whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationDescription;
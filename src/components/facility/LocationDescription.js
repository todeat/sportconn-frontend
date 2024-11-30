import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { FileText } from 'lucide-react';

const LocationDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectăm dacă suntem pe mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px este breakpoint-ul pentru sm în Tailwind
    };

    // Verificăm inițial
    checkIfMobile();

    // Adăugăm listener pentru redimensionare
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!description) return null;

  return (
    <div className="mt-6">
      {/* Butonul de expandare este vizibil doar pe mobile */}
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-primary-400 hover:text-white transition-colors sm:hidden"
        >
          <FileText className="w-5 h-5" />
          <span>
            {isExpanded ? 'Ascunde descrierea' : 'Vezi descrierea'}
          </span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
      
      <div
        className={`mt-4 text-primary-400 sm:max-w-3xl ${
          isMobile
            ? `overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`
            : 'block' // Pe desktop este mereu vizibil
        }`}
      >
        <p>{description}</p>
      </div>
    </div>
  );
};

export default LocationDescription;
// MobileMenu.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Burger Button - Adjusted z-index and positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 text-primary hover:bg-primary-400/10 rounded-lg transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Menu className="h-6 w-6 transition-transform duration-300" />
        )}
      </button>

      {/* Overlay - Adjusted z-index */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel - Adjusted z-index and padding */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col pt-20 px-6 pb-6 h-full overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => handleNavigation('/')}
              className="w-full text-left text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
            >
              Acasă
            </button>
            <button
              onClick={() => handleNavigation('/facilities')}
              className="w-full text-left text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
            >
              Baze Sportive
            </button>
            
            {user ? (
              <>
                {/* <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="w-full text-left text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                >
                  Dashboard
                </button> */}
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="w-full text-left text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                >
                  Profil
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full text-left text-primary-100 hover:text-primary hover:bg-primary-400/10 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                >
                  Conectare
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full text-center bg-primary hover:bg-primary-100 text-white mt-4 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
                >
                  Înregistrare
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
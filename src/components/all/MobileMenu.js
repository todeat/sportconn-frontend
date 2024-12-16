import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Home, Building2, UserCircle2, LogIn, UserPlus, ChevronRight } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const MenuItem = ({ icon: Icon, label, onClick, variant = "default" }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
        variant === "primary"
          ? "bg-primary text-white hover:bg-primary-100"
          : "text-primary-100 hover:bg-primary-400/10 hover:text-primary"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
        variant === "primary" ? "text-white" : "text-primary-100"
      }`} />
    </button>
  );

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 text-primary hover:bg-primary-400/10 rounded-lg transition-all duration-300"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300 rotate-180" />
        ) : (
          <Menu className="h-6 w-6 transition-transform duration-300" />
        )}
      </button>

      {/* Overlay with backdrop blur */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Items - Adjusted top padding without logo */}
        <div className="overflow-y-auto h-full pt-20 pb-16 px-4 space-y-2">
          <MenuItem
            icon={Home}
            label="Acasă"
            onClick={() => handleNavigation('/')}
          />
          <MenuItem
            icon={Building2}
            label="Baze Sportive"
            onClick={() => handleNavigation('/facilities')}
          />
          
          {user ? (
            <>
              <MenuItem
                icon={UserCircle2}
                label="Profil"
                onClick={() => handleNavigation('/profile')}
              />
            </>
          ) : (
            <>
              <div className="pt-4 space-y-2">
                <MenuItem
                  icon={LogIn}
                  label="Conectare"
                  onClick={() => handleNavigation('/login')}
                />
                <MenuItem
                  icon={UserPlus}
                  label="Înregistrare"
                  onClick={() => handleNavigation('/register')}
                  variant="primary"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <p className="text-xs text-center text-primary-100">
            © 2024 SportConn. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
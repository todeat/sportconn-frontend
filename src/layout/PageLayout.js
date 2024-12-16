import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/all/Header';

const PageLayout = ({ 
  children, 
  variant = 'default',
  className = '',
  hideFooter = false
}) => {
  const location = useLocation();
  
  useEffect(() => {
    // Reset scroll position when route changes or on initial load
    window.scrollTo(0, 0);
    
    // Ensure the body is also scrolled to top
    document.body.style.scrollBehavior = 'auto';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Set overflow to auto to ensure proper scrolling
    document.body.style.overflow = 'auto';
    
    return () => {
      // Cleanup
      document.body.style.scrollBehavior = 'smooth';
    };
  }, [location.pathname]);

  const variants = {
    default: 'min-h-screen h-full bg-primary-400',
    gradient: 'min-h-screen h-full bg-gradient-to-br from-primary-900 to-primary',
    primary: 'min-h-screen h-full bg-primary'
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`${variants[variant]} ${className} flex-grow`}>
        {children}
      </main>
      {/* {!hideFooter && <Footer />} */}
    </div>
  );
};

export default PageLayout;
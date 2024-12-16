import React from 'react';
import Header from '../components/all/Header';
import Footer from '../components/all/Footer';

const PageLayout = ({ 
  children, 
  variant = 'default',
  className = '',
  hideFooter = false
}) => {
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
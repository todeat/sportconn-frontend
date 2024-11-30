import React from 'react';
import Header from '../components/all/Header';

const PageLayout = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'min-h-screen h-full bg-primary-400',
    gradient: 'min-h-screen h-full bg-gradient-to-br from-primary-900 to-primary',
    primary: 'min-h-screen h-full bg-primary'
  };

  return (
    <div className={`${variants[variant]} ${className} `}>
      <Header />
      {children}
    </div>
  );
};

export default PageLayout;
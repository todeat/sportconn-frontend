import React from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import PageLayout from '../../layout/PageLayout';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Rezervări Rapide",
      description: "Programează-ți activitatea sportivă în câteva click-uri"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Disponibil",
      description: "Acces la platformă oricând, de oriunde"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunitate",
      description: "Conectează-te cu alți pasionați de sport"
    }
  ];


  return (
    <PageLayout variant="default">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                Găsește și rezervă terenuri sportive
              </h1>
              <p className="text-lg sm:text-xl text-primary mb-8 max-w-2xl mx-auto">
                Platformă completă pentru rezervări terenuri sportive, 
                management și organizare evenimente sportive
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => window.location.href = '/facilities'} 
                  className="w-full sm:w-auto bg-primary hover:bg-primary-100 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
                >
                  Rezervă acum
                </button>
                <button 
                  onClick={() => window.location.href = '/register-facility'} 
                  className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
                >
                  Ai o bază sportivă? Înscrie-o acum
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-primary-400 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary-100">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-12 sm:py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Gestionează-ți baza sportivă mai eficient
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Alătură-te platformei noastre și beneficiază de un sistem modern de management 
            al rezervărilor și o expunere mai mare către clienți potențiali.
          </p>
          <button 
            onClick={() => window.location.href = '/register-facility'} 
            className="bg-white text-primary hover:bg-primary-400 px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
          >
            Înscrie-ți baza sportivă
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
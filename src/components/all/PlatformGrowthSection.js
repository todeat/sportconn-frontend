import React from 'react';
import { Building2, Users2, Map, ArrowRight, Trophy, Phone } from 'lucide-react';

const PlatformGrowthSection = () => {
  return (
    <div className="py-16 space-y-16">
      {/* Join Network CTA */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-primary rounded-2xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  Ai o bază sportivă?
                </h2>
                <p className="text-primary-400">
                  Alătură-te rețelei noastre și conectează-te cu o comunitate în continuă creștere de pasionați de sport.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <button 
                    onClick={() => window.location.href = '/register-facility'}
                    className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200"
                  >
                    Înscrie-ți baza sportivă
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors duration-200"
                  >
                    Contactează-ne
                    <Phone className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-lg bg-white/10 backdrop-blur-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      {/* <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-primary-400/10 rounded-lg w-fit">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mt-4 mb-2">
              Management Simplu
            </h3>
            <p className="text-primary-100">
              Gestionează-ți rezervările și programul într-un mod eficient și organizat.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-primary-400/10 rounded-lg w-fit">
              <Users2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mt-4 mb-2">
              Vizibilitate Crescută
            </h3>
            <p className="text-primary-100">
              Ajunge la mai mulți clienți și crește-ți prezența în comunitatea sportivă.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="p-3 bg-primary-400/10 rounded-lg w-fit">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mt-4 mb-2">
              Extinde-ți Afacerea
            </h3>
            <p className="text-primary-100">
              Dezvoltă-ți baza de clienți și crește-ți veniturile prin sistemul nostru de rezervări.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PlatformGrowthSection;
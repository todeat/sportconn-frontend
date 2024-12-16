import React from 'react';
import { Building2, Sparkles } from 'lucide-react';

const ComingSoonSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div className="bg-gradient-to-br from-primary/5 to-primary-400/10 rounded-2xl p-8 sm:p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon Container with Animation */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
            <div className="relative bg-primary/10 p-4 rounded-full">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center">
              Mai multe locații urmează
              
            </h2>
            <p className="text-primary-100">
            Explorează primele noastre locații partenere. 
            Descoperă în curând noi locații unde sportul devine mai accesibil.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full bg-primary-400/20 animate-pulse"
                style={{
                  animationDelay: `${i * 200}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonSection;
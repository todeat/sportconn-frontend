import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Sun, ChevronLeft, ChevronRight } from 'lucide-react';

const CourtsDisplay = ({ courts }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Verifică posibilitatea de scroll în ambele direcții
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Inițializează și actualizează starea de scroll
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  // Handler pentru scroll
  const handleScroll = () => {
    checkScrollability();
  };

  // Funcții pentru navigare
  const scrollToDirection = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Lățimea unui card + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Buton de scroll stânga */}
      {canScrollLeft && (
        <button 
          onClick={() => scrollToDirection('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
      )}

      {/* Container pentru carduri cu scroll orizontal */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courts.map((court) => (
          <div
            key={court.courtid}
            className="w-[320px] flex-none bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6 bg-primary rounded-t-xl bg-primary-200">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold text-white line-clamp-2 min-h-[3.5rem]">
                    {court.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-white/10 px-3 py-1 rounded-md text-white text-sm capitalize">
                      {court.sport}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {court.priceperhour} RON
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3">
                {court.covered ? (
                  <>
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <Cloud className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-primary">Teren Acoperit</span>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-primary/5 rounded-lg">
                      <Sun className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-primary">Teren în aer liber</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buton de scroll dreapta */}
      {canScrollRight && (
        <button 
          onClick={() => scrollToDirection('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>
      )}
    </div>
  );
};

export default CourtsDisplay;
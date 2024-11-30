import React, { useEffect, useState } from 'react';
import { Trash2, DollarSign, UserRoundCheck, Euro, Tag, Wallet } from 'lucide-react';
import { getSports } from '../../services/api';
import PageLayout from '../../layout/PageLayout';
import LoadingSpinner from '../all/LoadingSpinner';

export const CourtPill = ({ court, index, onUpdate, onRemove }) => {

  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getSports();
        setSports(response.all_sports);
      } catch (error) {
        console.error('Error fetching sports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă informațiile..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header cu gradient */}
      <div className="bg-primary-100 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
              Teren {index + 1}
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-white/80 hover:text-white transition-colors duration-200"
            aria-label="Șterge teren"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body cu informații */}
      <div className="p-6 space-y-6">
        {/* Numele terenului și sportul */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nume Teren
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              value={court.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="ex: Teren Central"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sport
            </label>
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              value={court.sport}
              onChange={(e) => onUpdate('sport', e.target.value)}
            >
              <option value="">Selectează sportul</option>
              {sports.map(sport => (
                <option key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preț și acoperire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Preț pe oră (RON)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                value={court.pricePerHour}
                onChange={(e) => onUpdate('pricePerHour', e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          {/* Card pentru acoperire */}
          <div 
            className={`p-4 rounded-lg border-2 transition-colors duration-200 cursor-pointer
              ${court.covered 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            onClick={() => onUpdate('covered', !court.covered)}
          >
            <div className="flex items-center space-x-3">
              <UserRoundCheck className="h-5 w-5" />
              <div>
                <div className="font-medium">Teren Acoperit</div>
                <div className="text-sm">
                  {court.covered ? 'Da' : 'Nu'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtPill;
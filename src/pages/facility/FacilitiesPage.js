import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFacilities } from '../../services/api';
import { MapPin, ChevronRight } from 'lucide-react';
import PageLayout from '../../layout/PageLayout';
import LoadingSpinner from '../../components/all/LoadingSpinner';
import { fetchFacilities, selectFacilitiesData } from '../../store/slices/facilitiesSlice';
import { useDispatch, useSelector } from 'react-redux';

const FacilitiesPage = () => {
  // const [facilities, setFacilities] = useState([]);
  const { facilities, isFetching, error } = useSelector(selectFacilitiesData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  // Show loading state only if we're fetching AND we don't have any cached data
  if (isFetching && !facilities) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Se încarcă bazele sportive..." />
        </div>
      </PageLayout>
    );
  }

  if (error && !facilities) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center text-red-600">
          {error}
        </div>
      </PageLayout>
    );
  }


  return (
    <PageLayout variant="default">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Baze Sportive Partenere
          </h1>
          <p className="text-primary-100 mb-8">
            Descoperă cele mai bune locații pentru sportul tău preferat
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities?.map((facility) => (
              <div 
                key={facility.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="p-6 bg-primary-200">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {facility.name}
                  </h3>
                  <div className="flex items-center text-primary-400">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">
                      {facility.address}, {facility.city.name}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    {facility.statistics.sportsDetails.map((sportDetail) => (
                      <div 
                        key={sportDetail.sportId}
                        className="flex items-center justify-between p-2 rounded-lg bg-primary-400/5 text-primary"
                      >
                        <span className="font-medium capitalize">
                          {sportDetail.sportName}
                        </span>
                        <span className="text-primary-100">
                          {sportDetail.courtsCount} {sportDetail.courtsCount === 1 ? 'teren' : 'terenuri'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/locations/${facility.id}`)}
                    className="w-full mt-4 py-3 px-4 bg-primary text-white font-medium rounded-lg 
                             transition-all duration-200 flex items-center justify-center
                             group-hover:bg-primary-100"
                  >
                    <span>Vezi detalii</span>
                    <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FacilitiesPage;
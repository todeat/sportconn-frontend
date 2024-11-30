import { Plus } from 'lucide-react';
import { CourtPill } from './CourtPill';
import LoadingSpinner from '../all/LoadingSpinner';

export const CourtsSection = ({ courts, onAddCourt, onUpdateCourt, onRemoveCourt,loading }) => {
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {courts.map((court, index) => (
        <CourtPill
          key={index}
          court={court}
          index={index}
          onUpdate={(field, value) => onUpdateCourt(index, field, value)}
          onRemove={() => onRemoveCourt(index)}
        />
      ))}

      <button
        onClick={onAddCourt}
        className="w-full py-3 border-2 border-dashed border-primary-200 rounded-lg text-primary hover:bg-primary-400/10 flex items-center justify-center space-x-2 transition-colors duration-200"
      >
        <Plus className="h-5 w-5" />
        <span>Adaugă Teren</span>
      </button>
    </div>
  );
};

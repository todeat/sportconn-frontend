import { Clock } from "lucide-react";
import { SchedulePill } from "./SchedulePill";

export const ScheduleSection = ({ schedule, onScheduleChange }) => {
    const DAYS_OF_WEEK = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
  
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center">
          <Clock className="mr-2 h-5 w-5"/>
          Program de funcționare
        </h3>
        <div className="grid gap-4">
          {DAYS_OF_WEEK.map((day, index) => (
            <SchedulePill
              key={day}
              day={day}
              isOpen={schedule[index].isOpen}
              oraStart={schedule[index].oraStart}
              oraEnd={schedule[index].oraEnd}
              onScheduleChange={(field, value) => onScheduleChange(index, field, value)}
            />
          ))}
        </div>
      </div>
    );
  };
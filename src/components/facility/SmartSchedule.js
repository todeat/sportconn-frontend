import React, { useState, useMemo } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import SmoothCollapse from '../all/SmoothCollapse';

const SmartSchedule = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState(false);

  const groupedSchedule = useMemo(() => {
    const formatTime = (time) => time.slice(0, 5);

    const getScheduleKey = (day) => 
      day.isOpen ? `${day.oraStart}-${day.oraEnd}` : 'closed';

    const formatDayRange = (days) => {
      if (days.length === 1) return getDayName(days[0]);
      if (days.length === 7) return 'Zilnic';
      return `${getDayName(days[0])} - ${getDayName(days[days.length - 1])}`;
    };

    const groups = schedule.reduce((acc, day) => {
      const key = getScheduleKey(day);
      if (!acc[key]) acc[key] = [];
      acc[key].push(day.dayOfWeek);
      return acc;
    }, {});

    return Object.entries(groups).map(([scheduleKey, days]) => {
      const ranges = days.reduce((acc, day, index) => {
        if (index === 0 || day !== days[index - 1] + 1) {
          acc.push([day]);
        } else {
          acc[acc.length - 1].push(day);
        }
        return acc;
      }, []);

      const [startTime, endTime] = scheduleKey.split('-');
      return ranges.map(range => ({
        days: formatDayRange(range),
        isOpen: scheduleKey !== 'closed',
        schedule: scheduleKey !== 'closed' ? {
          start: formatTime(startTime),
          end: formatTime(endTime)
        } : null
      }));
    }).flat();
  }, [schedule]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left outline-none focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-400/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-primary">Program de funcționare</h3>
            {groupedSchedule.length === 1 && (
              <p className="text-sm text-primary-100 mt-1">
                {groupedSchedule[0].isOpen 
                  ? `${groupedSchedule[0].schedule.start} - ${groupedSchedule[0].schedule.end}`
                  : 'Închis'}
              </p>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-primary transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <SmoothCollapse isOpen={isOpen}>
        <div className="px-6 pb-4 space-y-3">
          {groupedSchedule.map((group, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-primary-400/10 rounded-lg"
            >
              <span className="font-medium text-primary">
                {group.days}
              </span>
              <span className="text-primary-100">
                {group.isOpen 
                  ? `${group.schedule.start} - ${group.schedule.end}`
                  : 'Închis'
                }
              </span>
            </div>
          ))}
        </div>
      </SmoothCollapse>
    </div>
  );
};

// Helper function to get day name
const getDayName = (dayIndex) => {
  const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
  return days[dayIndex === 0 ? 6 : dayIndex - 1];
};

export default SmartSchedule;
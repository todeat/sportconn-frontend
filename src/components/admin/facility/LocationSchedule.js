import { Calendar, CalendarClock } from "lucide-react";
import { BookingModal } from "../schedule/BookingModal";
import { ReservationDetailsModal } from "../schedule/ReservationDetailsModal";
import { TimeSlotCard } from "../schedule/TimeSlotCard";
import { CourtTab } from "../schedule/CourtTab";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DatePickerButton } from "../schedule/DatePickerButton";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { useState } from "react";
import { format } from "date-fns";
import { ro } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F2421'
    }
  }
});

const LocationSchedule = ({ onDateChange, schedule, selectedDate, onReservationDelete }) => {
  const [date, setDate] = useState(selectedDate);
  const [selectedCourt, setSelectedCourt] = useState(Object.keys(schedule)[0]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange(format(newDate, 'yyyy-MM-dd'));
    setIsDatePickerOpen(false);
  };

  const handleShowDetails = (slot) => {
    setSelectedReservation(slot);
    setIsModalOpen(true);
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <CalendarClock className="w-7 h-7 mr-2" />
              Program Terenuri
            </h2>
            
            <div className="relative">
              <DatePickerButton
                date={date}
                onClick={() => setIsDatePickerOpen(true)}
              />
              {isDatePickerOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <DatePicker
                    open={isDatePickerOpen}
                    onClose={() => setIsDatePickerOpen(false)}
                    value={date}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        sx: { display: 'none' }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {schedule && Object.keys(schedule).length > 0 ? (
            <>
              {/* Courts Tabs */}
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex space-x-2 min-w-max sm:min-w-0">
                  {Object.entries(schedule).map(([courtId, courtData]) => (
                    <CourtTab
                      key={courtId}
                      court={courtData}
                      isActive={selectedCourt === courtId}
                      onClick={() => setSelectedCourt(courtId)}
                    />
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="grid gap-4">
                {schedule[selectedCourt].schedule.map((slot, index) => (
                  <TimeSlotCard 
                    key={index} 
                    slot={slot} 
                    onShowDetails={handleShowDetails}
                    onBook={handleBookSlot}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nu există programări pentru această dată</p>
            </div>
          )}

          {selectedReservation && (
            <ReservationDetailsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              reservation={selectedReservation}
              onDeleteSuccess={onReservationDelete}
            />
          )}

          {selectedSlot && (
            <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            availableTimes={selectedSlot.availableTimes}
            selectedDate={date}
            courtId={selectedSlot.courtId}
            courtName={selectedSlot.courtName}
            onReservationComplete={(date) => {
              onDateChange(date);
              setIsBookingModalOpen(false);
            }}
          />
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default LocationSchedule;
import { DAYS_OF_WEEK, DAY_IDS, WORKING_DAY_IDS } from "../../utils/constants";
import type { Slot, Appointment } from "../../types/appointments";
import DayColumn from "./DayColumn";

interface CalendarGridProps {
  mergedSlots: Map<number, Slot[]>;
  appointmentMap: Map<string, Appointment>;
  onAvailableSlotClick: (slot: Slot) => void;
  onBookedSlotClick: (slot: Slot) => void;
}

export default function CalendarGrid({
  mergedSlots,
  appointmentMap,
  onAvailableSlotClick,
  onBookedSlotClick,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
      {DAYS_OF_WEEK.map((day, index) => {
        const dayId = DAY_IDS[index];
        const isWorkingDay = WORKING_DAY_IDS.includes(dayId);
        const daySlots = mergedSlots.get(dayId) || [];

        return (
          <DayColumn
            key={dayId}
            day={day}
            dayId={dayId}
            isWorkingDay={isWorkingDay}
            slots={daySlots}
            appointmentMap={appointmentMap}
            onAvailableSlotClick={onAvailableSlotClick}
            onBookedSlotClick={onBookedSlotClick}
          />
        );
      })}
    </div>
  );
}


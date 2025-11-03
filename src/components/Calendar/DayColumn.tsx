import { formatShortDate } from "../../utils/timeUtils";
import type { Slot, Appointment } from "../../types/appointments";
import TimeSlot from "./TimeSlot";
import EmptyState from "./EmptyState";

interface DayColumnProps {
  day: string;
  dayId: number;
  isWorkingDay: boolean;
  slots: Slot[];
  appointmentMap: Map<string, Appointment>;
  onAvailableSlotClick: (slot: Slot) => void;
  onBookedSlotClick: (slot: Slot) => void;
}

export default function DayColumn({ day, isWorkingDay, slots, appointmentMap, onAvailableSlotClick, onBookedSlotClick }: DayColumnProps) {
  return (
    <div className={`rounded-lg border ${isWorkingDay ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200"}`}>
      {/* Day Header */}
      <div className={`p-3 border-b ${isWorkingDay ? "border-gray-200 bg-blue-50" : "border-gray-200 bg-gray-100"}`}>
        <p className={`font-semibold text-sm ${isWorkingDay ? "text-blue-900" : "text-gray-500"}`}>{day}</p>
        <p className={`text-xs ${isWorkingDay ? "text-blue-700" : "text-gray-400"}`}>{slots.length > 0 ? formatShortDate(slots[0].date) : ""}</p>
      </div>

      {/* Time Slots */}
      <div className="p-2 space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
        {!isWorkingDay || slots.length === 0 ? (
          <EmptyState isWorkingDay={isWorkingDay} />
        ) : (
          slots.map((slot) => {
            const appointment = appointmentMap.get(slot._id);
            const isBooked = slot.isBooked || !!appointment;

            return (
              <TimeSlot
                key={slot._id}
                slot={slot}
                appointment={appointment}
                isBooked={isBooked}
                onClick={() => (isBooked ? onBookedSlotClick(slot) : onAvailableSlotClick(slot))}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

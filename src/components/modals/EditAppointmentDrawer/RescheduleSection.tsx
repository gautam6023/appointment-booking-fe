import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { formatUTCToLocalTime, getCurrentWeekRange, isDayInPast, WORKING_DAYS } from "../../../utils/timeUtils";
import type { DaySlots, Appointment } from "../../../types/appointments";

interface RescheduleSectionProps {
  selectedDate: number | null;
  selectedSlotId: string | null;
  availableSlots?: DaySlots[];
  isLoadingSlots: boolean;
  appointment: Appointment;
  onSelectDate: (dayId: number) => void;
  onSelectSlot: (slotId: string) => void;
}

export default function RescheduleSection({
  selectedDate,
  selectedSlotId,
  availableSlots,
  isLoadingSlots,
  appointment,
  onSelectDate,
  onSelectSlot,
}: RescheduleSectionProps) {
  const weekRange = useMemo(() => getCurrentWeekRange(), []);

  const availableSlotsForDay = useMemo(() => {
    if (!selectedDate || !availableSlots) return [];
    const daySlots = availableSlots.find((d) => d.dayId === selectedDate);
    if (!daySlots) return [];
    return daySlots.slots.filter((slot) => !slot.isBooked || slot._id === appointment.slotId);
  }, [selectedDate, availableSlots, appointment.slotId]);

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">Reschedule (Optional)</h3>

      {/* Week Info */}
      <p className="text-xs text-gray-600 mb-3">
        Current week: {weekRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
        {weekRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>

      {/* Day Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Day</label>
        <div className="grid grid-cols-2 gap-2">
          {WORKING_DAYS.map((day) => {
            const disabled = isDayInPast(day.id);
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => !disabled && onSelectDate(day.id)}
                disabled={disabled}
                className={`p-3 rounded-md text-sm font-medium transition-colors ${
                  selectedDate === day.id
                    ? "bg-blue-600 text-white"
                    : disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Selection */}
      {selectedDate && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Time Slot</label>
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : availableSlotsForDay.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No available slots for this day</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {availableSlotsForDay.map((slot) => {
                const isCurrentSlot = slot._id === appointment.slotId;
                return (
                  <button
                    key={slot._id}
                    type="button"
                    onClick={() => onSelectSlot(slot._id)}
                    className={`p-2 rounded-md text-xs font-medium transition-colors ${
                      selectedSlotId === slot._id
                        ? "bg-blue-600 text-white"
                        : isCurrentSlot
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {formatUTCToLocalTime(slot.startTime, { hour: "numeric", minute: "2-digit", hour12: true })} -{" "}
                    {formatUTCToLocalTime(slot.endTime, { hour: "numeric", minute: "2-digit", hour12: true })}
                    {isCurrentSlot && <span className="block text-[10px]">(Current)</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

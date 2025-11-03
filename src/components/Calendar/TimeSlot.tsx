import { formatUTCToLocalTime } from "../../utils/timeUtils";
import type { Slot, Appointment } from "../../types/appointments";

interface TimeSlotProps {
  slot: Slot;
  appointment?: Appointment;
  isBooked: boolean;
  onClick: () => void;
}

export default function TimeSlot({ slot, appointment, isBooked, onClick }: TimeSlotProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-2 sm:px-3 py-2 rounded-md text-xs font-medium transition-all ${
        isBooked
          ? "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 cursor-pointer"
          : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md active:scale-95"
      }`}
    >
      {isBooked ? (
        <div className="flex flex-col">
          <span className="font-semibold">Booked</span>
          {appointment && <span className="text-[10px] text-gray-500 truncate">{appointment.name}</span>}
        </div>
      ) : (
        <span>
          {formatUTCToLocalTime(slot.startTime, { hour: "numeric", minute: "2-digit", hour12: true })} -{" "}
          {formatUTCToLocalTime(slot.endTime, { hour: "numeric", minute: "2-digit", hour12: true })}
        </span>
      )}
    </button>
  );
}


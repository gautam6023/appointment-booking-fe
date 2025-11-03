import type { Appointment, DaySlots, Slot } from "../types/appointments";

/**
 * Creates a map of slot IDs to appointments for quick lookup
 */
export function createAppointmentMap(appointments: Appointment[]): Map<string, Appointment> {
  const map = new Map<string, Appointment>();
  appointments.forEach((appointment) => {
    map.set(appointment.slotId, appointment);
  });
  return map;
}

/**
 * Finds an appointment by slot ID
 */
export function findAppointmentBySlot(
  slotId: string,
  appointments: Appointment[]
): Appointment | undefined {
  return appointments.find((apt) => apt.slotId === slotId);
}

/**
 * Merges available slots with appointment data, marking slots as booked if they have appointments
 */
export function mergeAppointmentsWithSlots(
  slots: DaySlots[],
  appointments: Appointment[]
): Map<number, Slot[]> {
  const appointmentMap = createAppointmentMap(appointments);
  const map = new Map<number, Slot[]>();

  slots.forEach((daySlots) => {
    const mergedSlots = daySlots.slots.map((slot) => {
      const appointment = appointmentMap.get(slot._id);
      return {
        ...slot,
        isBooked: !!appointment || slot.isBooked,
      };
    });
    map.set(daySlots.dayId, mergedSlots);
  });

  return map;
}

/**
 * Groups slots by day ID
 */
export function groupSlotsByDay(slots: DaySlots[]): Map<number, Slot[]> {
  const map = new Map<number, Slot[]>();
  slots.forEach((daySlots) => {
    map.set(daySlots.dayId, daySlots.slots);
  });
  return map;
}

/**
 * Checks if a slot is available (not booked)
 */
export function isSlotAvailable(
  slot: Slot,
  appointmentMap: Map<string, Appointment>
): boolean {
  return !slot.isBooked && !appointmentMap.has(slot._id);
}


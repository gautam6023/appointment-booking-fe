import { useState, useMemo } from "react";
import { useAvailableSlots, useAppointments } from "../../api/appointments";
import { createAppointmentMap, mergeAppointmentsWithSlots } from "../../utils/appointmentHelpers";
import BookingModal from "../modals/BookingModal";
import AppointmentDetailsModal from "../modals/AppointmentDetailsModal";
import EditAppointmentDrawer from "../modals/EditAppointmentDrawer";
import { CalendarSkeleton } from "../ui/skeleton-loaders";
import type { Slot, Appointment } from "../../types/appointments";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

interface CalendarProps {
  sharableId: string;
  isPublicView?: boolean;
}

export default function Calendar({ sharableId, isPublicView = false }: CalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  const { data: availableSlots, isLoading, error } = useAvailableSlots(sharableId, weekOffset);
  const { data: appointmentsData } = useAppointments(!isPublicView ? sharableId : undefined, "future", 1, 100);

  const appointments = appointmentsData?.appointments || [];

  const appointmentMap = useMemo(() => createAppointmentMap(appointments), [appointments]);

  const mergedSlots = useMemo(() => {
    if (!availableSlots) return new Map<number, Slot[]>();
    return mergeAppointmentsWithSlots(availableSlots, appointments);
  }, [availableSlots, appointments]);

  const handleAvailableSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleBookedSlotClick = (slot: Slot) => {
    const appointment = appointmentMap.get(slot._id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsDetailsModalOpen(true);
    }
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsEditDrawerOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setAppointmentToEdit(null);
  };

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border border-red-200">
        <p className="text-sm text-red-800">Failed to load available slots. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Navigation */}
      <CalendarHeader weekOffset={weekOffset} onPreviousWeek={handlePreviousWeek} onNextWeek={handleNextWeek} />

      {/* Calendar Grid */}
      <CalendarGrid
        mergedSlots={mergedSlots}
        appointmentMap={appointmentMap}
        onAvailableSlotClick={handleAvailableSlotClick}
        onBookedSlotClick={handleBookedSlotClick}
      />

      {/* Info Message */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <p className="text-xs sm:text-sm text-blue-800">
          <span className="font-medium">Working Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM (30-minute slots)
        </p>
      </div>

      {/* Modals */}
      <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseBookingModal} slot={selectedSlot} sharableId={sharableId} />
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        appointment={selectedAppointment}
        showActions={false}
        onEdit={handleEditAppointment}
      />
      <EditAppointmentDrawer isOpen={isEditDrawerOpen} onClose={handleCloseEditDrawer} appointment={appointmentToEdit} />
    </div>
  );
}

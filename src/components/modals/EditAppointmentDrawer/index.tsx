import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Edit, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEditAppointment, useAvailableSlots } from "../../../api/appointments";
import { EditAppointmentSchema, type EditAppointmentRequest, type Appointment } from "../../../types/appointments";
import { Button } from "../../ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../../ui/drawer";
import { formatUTCToLocalDate, formatTimeRange } from "../../../utils/timeUtils";
import { useAuth } from "../../../context/AuthContext";
import { getApiErrorMessage } from "../../../utils/errorHandlers";
import RescheduleSection from "./RescheduleSection";
import DetailsSection from "./DetailsSection";

interface EditAppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export default function EditAppointmentDrawer({ isOpen, onClose, appointment }: EditAppointmentDrawerProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [guestInputs, setGuestInputs] = useState<string[]>([]);
  const [guestErrors, setGuestErrors] = useState<string[]>([]);

  // Use React Query mutation with onSuccess/onError callbacks
  const { mutate: editAppointment, isPending: isEditingAppointment } = useEditAppointment({
    onSuccess: (_data, variables) => {
      if (variables.data.newSlotId) {
        toast.success("Appointment rescheduled successfully!");
      } else {
        toast.success("Appointment updated successfully!");
      }
      handleClose();
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error, "Failed to update appointment");
      toast.error(errorMessage);
    },
  });

  // Fetch available slots for current week
  const { data: availableSlots, isLoading: isLoadingSlots } = useAvailableSlots(user?.sharableId, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<Omit<EditAppointmentRequest, "newSlotId">>({
    resolver: zodResolver(EditAppointmentSchema.omit({ newSlotId: true })),
  });

  const emailValue = watch("email");
  const nameValue = watch("name");
  const phoneValue = watch("phone");
  const reasonValue = watch("reason");

  // Initialize form with appointment data
  useEffect(() => {
    if (appointment) {
      setValue("name", appointment.name);
      setValue("email", appointment.email);
      setValue("phone", appointment.phone || "");
      setValue("reason", appointment.reason || "");
      setGuestInputs(appointment.guests || []);
      setGuestErrors([]);
    }
  }, [appointment, setValue]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    if (!appointment) return false;

    // Check if slot changed
    if (selectedSlotId && selectedSlotId !== appointment.slotId) return true;

    // Check if name changed
    if (nameValue !== appointment.name) return true;

    // Check if email changed
    if (emailValue !== appointment.email) return true;

    // Check if phone changed
    const currentPhone = phoneValue || "";
    const originalPhone = appointment.phone || "";
    if (currentPhone !== originalPhone) return true;

    // Check if reason changed
    const currentReason = reasonValue || "";
    const originalReason = appointment.reason || "";
    if (currentReason !== originalReason) return true;

    // Check if guests changed
    const currentGuests = guestInputs.filter((g) => g.trim());
    const originalGuests = appointment.guests || [];
    if (currentGuests.length !== originalGuests.length) return true;
    if (!currentGuests.every((guest, index) => guest === originalGuests[index])) return true;

    return false;
  }, [appointment, selectedSlotId, nameValue, emailValue, phoneValue, reasonValue, guestInputs]);

  const validateGuestEmail = (guestEmail: string, index: number): boolean => {
    const trimmedGuest = guestEmail.trim().toLowerCase();
    const primaryEmail = emailValue?.toLowerCase();

    if (trimmedGuest && primaryEmail && trimmedGuest === primaryEmail) {
      const newErrors = [...guestErrors];
      newErrors[index] = "Guest email cannot be the same as primary email";
      setGuestErrors(newErrors);
      return false;
    }

    const duplicateIndex = guestInputs.findIndex((email, i) => i !== index && email.trim().toLowerCase() === trimmedGuest);
    if (trimmedGuest && duplicateIndex !== -1) {
      const newErrors = [...guestErrors];
      newErrors[index] = "This email is already added as a guest";
      setGuestErrors(newErrors);
      return false;
    }

    const newErrors = [...guestErrors];
    newErrors[index] = "";
    setGuestErrors(newErrors);
    return true;
  };

  const onSubmit = (data: Omit<EditAppointmentRequest, "newSlotId">) => {
    if (!appointment) return;

    // Validate all guest emails before submitting
    const validGuests = guestInputs
      .map((email) => {
        const trimmed = email.trim();
        if (!trimmed) return null;

        if (data.email && trimmed.toLowerCase() === data.email.toLowerCase()) {
          toast.error("Guest email cannot be the same as primary email");
          return null;
        }

        return trimmed;
      })
      .filter((email): email is string => email !== null);

    if (validGuests.length !== guestInputs.filter((g) => g.trim()).length) {
      return;
    }

    const editData: EditAppointmentRequest = {
      ...data,
      guests: validGuests,
    };

    // Add newSlotId only if user selected a different slot
    if (selectedSlotId && selectedSlotId !== appointment.slotId) {
      editData.newSlotId = selectedSlotId;
    }

    // No try-catch needed - React Query handles errors in onError callback
    editAppointment({ id: appointment._id, data: editData });
  };

  const handleClose = () => {
    reset();
    setSelectedDate(null);
    setSelectedSlotId(null);
    setGuestInputs([]);
    setGuestErrors([]);
    onClose();
  };

  const addGuestInput = () => {
    setGuestInputs([...guestInputs, ""]);
    setGuestErrors([...guestErrors, ""]);
  };

  const removeGuestInput = (index: number) => {
    setGuestInputs(guestInputs.filter((_, i) => i !== index));
    setGuestErrors(guestErrors.filter((_, i) => i !== index));
  };

  const updateGuestInput = (index: number, value: string) => {
    const newGuests = [...guestInputs];
    newGuests[index] = value;
    setGuestInputs(newGuests);

    if (value.trim()) {
      validateGuestEmail(value, index);
    } else {
      const newErrors = [...guestErrors];
      newErrors[index] = "";
      setGuestErrors(newErrors);
    }
  };

  if (!appointment) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()} direction="right">
      <DrawerContent className="fixed inset-y-0 right-0 h-full w-full sm:w-[500px] mt-0 rounded-none">
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <DrawerHeader className="border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                <DrawerTitle className="text-lg sm:text-xl">Edit Appointment</DrawerTitle>
              </div>
              <DrawerClose asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors rounded-sm opacity-70 ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">Edit your appointment details or reschedule to a different time slot</DrawerDescription>
          </DrawerHeader>

          {/* Current Appointment Details */}
          <div className="bg-blue-50 p-4 border-b border-blue-100 shrink-0">
            <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Current Appointment</p>
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-semibold">{formatUTCToLocalDate(appointment.slot.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{formatTimeRange(appointment.slot.startTime, appointment.slot.endTime)}</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Reschedule Section */}
              <RescheduleSection
                selectedDate={selectedDate}
                selectedSlotId={selectedSlotId}
                availableSlots={availableSlots}
                isLoadingSlots={isLoadingSlots}
                appointment={appointment}
                onSelectDate={setSelectedDate}
                onSelectSlot={setSelectedSlotId}
              />

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Update Details Section */}
              <DetailsSection
                register={register}
                errors={errors}
                guestInputs={guestInputs}
                guestErrors={guestErrors}
                onAddGuest={addGuestInput}
                onRemoveGuest={removeGuestInput}
                onUpdateGuest={updateGuestInput}
                onValidateGuest={(index) => validateGuestEmail(guestInputs[index], index)}
              />
            </div>

            {/* Action Buttons */}
            <DrawerFooter className="border-t border-gray-200 shrink-0">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="flex-1" disabled={isEditingAppointment}>
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" className="flex-1" disabled={isEditingAppointment || !hasChanges}>
                  {isEditingAppointment ? "Saving..." : selectedSlotId && selectedSlotId !== appointment.slotId ? "Reschedule" : "Update Details"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}


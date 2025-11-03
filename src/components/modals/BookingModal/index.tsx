import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateAppointment } from "../../../api/appointments";
import { CreateAppointmentSchema, type CreateAppointmentRequest, type Slot } from "../../../types/appointments";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { formatUTCToLocalDate, formatTimeRange } from "../../../utils/timeUtils";
import { getApiErrorMessage } from "../../../utils/errorHandlers";
import BookingForm from "./BookingForm";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: Slot | null;
  sharableId: string;
}

export default function BookingModal({ isOpen, onClose, slot, sharableId }: BookingModalProps) {
  const [guestInputs, setGuestInputs] = useState<string[]>([]);
  const [guestErrors, setGuestErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Omit<CreateAppointmentRequest, "sharableId" | "slotId">>({
    resolver: zodResolver(CreateAppointmentSchema.omit({ sharableId: true, slotId: true })),
  });

  const emailValue = watch("email");

  // Use React Query mutation with onSuccess/onError callbacks
  const { mutate: createAppointment, isPending } = useCreateAppointment({
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      reset();
      setGuestInputs([]);
      setGuestErrors([]);
      onClose();
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error, "Failed to book appointment");
      toast.error(errorMessage);
    },
  });

  const validateGuestEmail = (guestEmail: string, index: number): boolean => {
    const trimmedGuest = guestEmail.trim().toLowerCase();
    const primaryEmail = emailValue?.toLowerCase();

    // Check if guest email matches primary email
    if (trimmedGuest && primaryEmail && trimmedGuest === primaryEmail) {
      const newErrors = [...guestErrors];
      newErrors[index] = "Guest email cannot be the same as primary email";
      setGuestErrors(newErrors);
      return false;
    }

    // Check for duplicates in guest list
    const duplicateIndex = guestInputs.findIndex((email, i) => i !== index && email.trim().toLowerCase() === trimmedGuest);
    if (trimmedGuest && duplicateIndex !== -1) {
      const newErrors = [...guestErrors];
      newErrors[index] = "This email is already added as a guest";
      setGuestErrors(newErrors);
      return false;
    }

    // Clear error for this index
    const newErrors = [...guestErrors];
    newErrors[index] = "";
    setGuestErrors(newErrors);
    return true;
  };

  const onSubmit = (data: Omit<CreateAppointmentRequest, "sharableId" | "slotId">) => {
    if (!slot) return;

    // Validate all guest emails before submitting
    const validGuests = guestInputs
      .map((email) => {
        const trimmed = email.trim();
        if (!trimmed) return null;

        // Check against primary email
        if (trimmed.toLowerCase() === data.email.toLowerCase()) {
          toast.error("Guest email cannot be the same as primary email");
          return null;
        }

        return trimmed;
      })
      .filter((email): email is string => email !== null);

    // Check if there were any validation errors
    if (validGuests.length !== guestInputs.filter((g) => g.trim()).length) {
      return;
    }

    const appointmentData: CreateAppointmentRequest = {
      ...data,
      sharableId,
      slotId: slot._id,
      guests: validGuests,
    };

    // No try-catch needed - React Query handles errors in onError callback
    createAppointment(appointmentData);
  };

  const handleClose = () => {
    reset();
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

    // Validate on change
    if (value.trim()) {
      validateGuestEmail(value, index);
    } else {
      const newErrors = [...guestErrors];
      newErrors[index] = "";
      setGuestErrors(newErrors);
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0" showCloseButton={false}>
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200">
          <DialogTitle className="text-lg sm:text-xl">Book Appointment</DialogTitle>
        </DialogHeader>

        {/* Slot Details */}
        <div className="bg-blue-50 p-3 sm:p-4 border-b border-blue-100">
          <p className="text-xs sm:text-sm font-medium text-blue-900">{formatUTCToLocalDate(slot.date)}</p>
          <p className="text-base sm:text-lg font-semibold text-blue-700">{formatTimeRange(slot.startTime, slot.endTime)}</p>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="p-4 sm:p-6 overflow-y-auto">
            <BookingForm
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
          <DialogFooter className="p-4 sm:p-6 border-t border-gray-200 shrink-0 sm:flex-row flex-col gap-3">
            <Button type="button" onClick={handleClose} variant="outline" className="flex-1 w-full sm:w-auto" disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 w-full sm:w-auto" disabled={isPending}>
              {isPending ? "Booking..." : "Book Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


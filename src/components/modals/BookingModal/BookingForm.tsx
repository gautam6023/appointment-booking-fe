import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import type { CreateAppointmentRequest } from "../../../types/appointments";
import GuestEmailInput from "./GuestEmailInput";

interface BookingFormProps {
  register: UseFormRegister<Omit<CreateAppointmentRequest, "sharableId" | "slotId">>;
  errors: FieldErrors<Omit<CreateAppointmentRequest, "sharableId" | "slotId">>;
  guestInputs: string[];
  guestErrors: string[];
  onAddGuest: () => void;
  onRemoveGuest: (index: number) => void;
  onUpdateGuest: (index: number, value: string) => void;
  onValidateGuest: (index: number) => void;
}

export default function BookingForm({
  register,
  errors,
  guestInputs,
  guestErrors,
  onAddGuest,
  onRemoveGuest,
  onUpdateGuest,
  onValidateGuest,
}: BookingFormProps) {
  return (
    <div className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input type="text" id="name" {...register("name")} placeholder="John Doe" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input type="email" id="email" {...register("email")} placeholder="john@example.com" />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input type="tel" id="phone" {...register("phone")} placeholder="+1234567890" />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      {/* Guests Field */}
      <div className="space-y-2">
        <Label>Additional Guests</Label>
        {guestInputs.map((guest, index) => (
          <GuestEmailInput
            key={index}
            value={guest}
            error={guestErrors[index]}
            onUpdate={(value) => onUpdateGuest(index, value)}
            onRemove={() => onRemoveGuest(index)}
            onBlur={() => guest.trim() && onValidateGuest(index)}
          />
        ))}
        <Button type="button" variant="link" onClick={onAddGuest} className="h-auto p-0 text-sm">
          + Add Guest
        </Button>
      </div>

      {/* Reason Field */}
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Appointment</Label>
        <Textarea id="reason" {...register("reason")} rows={3} placeholder="Brief description of the appointment" />
        {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import type { EditAppointmentRequest } from "../../../types/appointments";

interface DetailsSectionProps {
  register: UseFormRegister<Omit<EditAppointmentRequest, "newSlotId">>;
  errors: FieldErrors<Omit<EditAppointmentRequest, "newSlotId">>;
  guestInputs: string[];
  guestErrors: string[];
  onAddGuest: () => void;
  onRemoveGuest: (index: number) => void;
  onUpdateGuest: (index: number, value: string) => void;
  onValidateGuest: (index: number) => void;
}

export default function DetailsSection({
  register,
  errors,
  guestInputs,
  guestErrors,
  onAddGuest,
  onRemoveGuest,
  onUpdateGuest,
  onValidateGuest,
}: DetailsSectionProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">Update Details</h3>

      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" {...register("name")} placeholder="John Doe" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
            <div key={index} className="space-y-1">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={guest}
                  onChange={(e) => onUpdateGuest(index, e.target.value)}
                  onBlur={() => guest.trim() && onValidateGuest(index)}
                  placeholder="guest@example.com"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveGuest(index)}
                  className="text-destructive hover:text-destructive shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {guestErrors[index] && <p className="text-sm text-destructive">{guestErrors[index]}</p>}
            </div>
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
    </div>
  );
}

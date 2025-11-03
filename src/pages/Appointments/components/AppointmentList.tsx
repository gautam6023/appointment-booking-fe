import type { Appointment } from "../../../types/appointments";
import AppointmentCard from "./AppointmentCard";

interface AppointmentListProps {
  appointments: Appointment[];
  showActions: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

export default function AppointmentList({ appointments, showActions, onEdit, onDelete }: AppointmentListProps) {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


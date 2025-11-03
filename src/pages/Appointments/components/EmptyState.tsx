import { Calendar } from "lucide-react";
import type { AppointmentType } from "../../../types/appointments";

interface EmptyStateProps {
  filter: AppointmentType;
}

export default function EmptyState({ filter }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No {filter} appointments</h3>
      <p className="mt-2 text-sm text-gray-600">
        {filter === "future"
          ? "You don't have any upcoming appointments."
          : "You don't have any past appointments."}
      </p>
    </div>
  );
}


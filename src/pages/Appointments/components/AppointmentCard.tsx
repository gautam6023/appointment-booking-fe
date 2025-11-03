import { Trash2, Calendar, Clock, Mail, Phone, Users, FileText, Edit } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { formatUTCToLocalDate, formatTimeRange } from "../../../utils/timeUtils";
import type { Appointment } from "../../../types/appointments";

interface AppointmentCardProps {
  appointment: Appointment;
  showActions: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

export default function AppointmentCard({ appointment, showActions, onEdit, onDelete }: AppointmentCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Date and Time */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar className="h-5 w-5 shrink-0" />
              <span className="font-semibold text-sm sm:text-base">{formatUTCToLocalDate(appointment.slot.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-5 w-5 shrink-0" />
              <span className="font-medium text-sm sm:text-base">
                {formatTimeRange(appointment.slot.startTime, appointment.slot.endTime)}
              </span>
            </div>
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm sm:text-base text-gray-900">{appointment.name}</p>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm sm:text-base text-gray-900 break-all">{appointment.email}</p>
              </div>
            </div>
          </div>

          {/* Phone (if available) */}
          {appointment.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm sm:text-base text-gray-900">{appointment.phone}</p>
              </div>
            </div>
          )}

          {/* Guests (if available) */}
          {appointment.guests && appointment.guests.length > 0 && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Additional Guests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {appointment.guests.map((guest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 break-all"
                    >
                      {guest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reason (if available) */}
          {appointment.reason && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Reason</p>
                <p className="text-sm sm:text-base text-gray-700 break-words">{appointment.reason}</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                appointment.status === "done" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.status === "done" ? "Completed" : "Pending"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(appointment)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 flex-1 sm:flex-initial"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(appointment)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex-1 sm:flex-initial"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


import { useState } from "react";
import { Calendar, Clock, Mail, Phone, Users, FileText, Trash2, Edit } from "lucide-react";
import { type Appointment, type ApiError } from "../types/appointments";
import { formatUTCToLocalDate, formatTimeRange } from "../utils/timeUtils";
import { useDeleteAppointment } from "../api/appointments";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit?: (appointment: Appointment) => void;
  showActions?: boolean; // Whether to show edit/cancel buttons (for appointments page only)
}

export default function AppointmentDetailsModal({ isOpen, onClose, appointment, onEdit, showActions = false }: AppointmentDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteAppointmentMutation = useDeleteAppointment();

  const handleEditClick = () => {
    if (appointment && onEdit) {
      onClose(); // Close details modal first
      onEdit(appointment); // Open edit drawer
    }
  };

  const handleDeleteClick = () => {
    onClose(); // Close details modal first
    setShowDeleteConfirm(true); // Then open delete confirmation
  };

  const handleConfirmDelete = async () => {
    if (!appointment) return;

    try {
      await deleteAppointmentMutation.mutateAsync(appointment._id);
      toast.success("Appointment cancelled successfully");
      setShowDeleteConfirm(false);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || "Failed to cancel appointment";
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!appointment) return null;

  const isPastAppointment = appointment.status === "done";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          {/* Appointment Details */}
          <div className="space-y-4">
            {/* Date and Time */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold">{formatUTCToLocalDate(appointment.slot.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{formatTimeRange(appointment.slot.startTime, appointment.slot.endTime)}</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-900 font-medium">{appointment.name}</p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{appointment.email}</p>
              </div>
            </div>

            {/* Phone (if available) */}
            {appointment.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900">{appointment.phone}</p>
                </div>
              </div>
            )}

            {/* Guests (if available) */}
            {appointment.guests && appointment.guests.length > 0 && (
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Additional Guests</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {appointment.guests.map((guest, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                <FileText className="h-4 w-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Reason</label>
                  <p className="text-gray-700">{appointment.reason}</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appointment.status === "done" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {appointment.status === "done" ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            {!isPastAppointment && onEdit && (
              <Button onClick={handleEditClick} variant="default" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {showActions && !isPastAppointment && (
              <Button onClick={handleDeleteClick} variant="destructive" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteAppointmentMutation.isPending}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        appointment={appointment}
      />
    </>
  );
}

import { toast } from "sonner";
import { useDeleteAppointment, useEditAppointment } from "../api/appointments";
import { getApiErrorMessage } from "../utils/errorHandlers";
import type { EditAppointmentRequest } from "../types/appointments";

interface UseAppointmentActionsOptions {
  onDeleteSuccess?: () => void;
  onEditSuccess?: () => void;
}

/**
 * Hook that combines delete and edit appointment mutations with proper error handling
 */
export function useAppointmentActions(options: UseAppointmentActionsOptions = {}) {
  const { onDeleteSuccess, onEditSuccess } = options;

  const deleteMutation = useDeleteAppointment();
  const editMutation = useEditAppointment();

  const deleteAppointment = (id: string, onSuccess?: () => void) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Appointment deleted successfully");
        onSuccess?.();
        onDeleteSuccess?.();
      },
      onError: (error) => {
        const message = getApiErrorMessage(error, "Failed to delete appointment");
        toast.error(message);
      },
    });
  };

  const editAppointment = (
    id: string,
    data: EditAppointmentRequest,
    onSuccess?: () => void
  ) => {
    editMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          if (data.newSlotId) {
            toast.success("Appointment rescheduled successfully!");
          } else {
            toast.success("Appointment updated successfully!");
          }
          onSuccess?.();
          onEditSuccess?.();
        },
        onError: (error) => {
          const message = getApiErrorMessage(error, "Failed to update appointment");
          toast.error(message);
        },
      }
    );
  };

  return {
    deleteAppointment,
    editAppointment,
    isDeleting: deleteMutation.isPending,
    isEditing: editMutation.isPending,
  };
}


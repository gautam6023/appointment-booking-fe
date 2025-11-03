import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppointments, useDeleteAppointment } from "../../api/appointments";
import { toast } from "sonner";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import EditAppointmentDrawer from "../../components/modals/EditAppointmentDrawer";
import { AppointmentsListSkeleton } from "../../components/ui/skeleton-loaders";
import { type AppointmentType, type Appointment } from "../../types/appointments";
import { getApiErrorMessage } from "../../utils/errorHandlers";
import AppointmentFilters from "./components/AppointmentFilters";
import AppointmentList from "./components/AppointmentList";
import EmptyState from "./components/EmptyState";
import AppointmentPagination from "./components/AppointmentPagination";

export default function Appointments() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  // Read from URL params with defaults
  const filter = (searchParams.get("filter") as AppointmentType) || "future";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;

  const { data: appointmentsData, isLoading } = useAppointments(user?.sharableId, filter, page, limit);

  // Use React Query mutation with onSuccess/onError callbacks
  const { mutate: deleteAppointment, isPending: isDeleting } = useDeleteAppointment({
    onSuccess: () => {
      toast.success("Appointment deleted successfully");
      setDeleteModalOpen(false);
      setAppointmentToDelete(null);
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error, "Failed to delete appointment");
      toast.error(errorMessage);
    },
  });

  const appointments = appointmentsData?.appointments || [];
  const pagination = appointmentsData?.pagination;

  const handleEditClick = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setAppointmentToEdit(null);
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!appointmentToDelete) return;
    // No try-catch needed - React Query handles errors in onError callback
    deleteAppointment(appointmentToDelete._id);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const handleFilterChange = (newFilter: AppointmentType) => {
    setSearchParams({ filter: newFilter, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ filter, page: newPage.toString() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">View and manage your scheduled appointments.</p>
        </div>

        {/* Filter Tabs and Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <AppointmentFilters activeFilter={filter} onFilterChange={handleFilterChange} />

          {/* Appointments Content */}
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <AppointmentsListSkeleton count={5} />
            ) : appointments.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <>
                <AppointmentList
                  appointments={appointments}
                  showActions={filter === "future"}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />

                {/* Pagination Controls */}
                {pagination && (
                  <AppointmentPagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    limit={pagination.limit}
                    total={pagination.total}
                    hasPrevPage={pagination.hasPrevPage}
                    hasNextPage={pagination.hasNextPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        appointment={appointmentToDelete}
      />
      <EditAppointmentDrawer isOpen={isEditDrawerOpen} onClose={handleCloseEditDrawer} appointment={appointmentToEdit} />
    </div>
  );
}

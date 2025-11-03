import { Skeleton } from "./skeleton";

/**
 * Calendar Skeleton Loader
 * Shows loading state for the calendar grid
 */
export function CalendarSkeleton() {
  const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
        {DAYS_OF_WEEK.map((_, index) => (
          <div key={index} className="rounded-lg border bg-white border-gray-200">
            {/* Day Header */}
            <div className="p-3 border-b border-gray-200 bg-blue-50 space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>

            {/* Time Slots */}
            <div className="p-2 space-y-2 min-h-[200px]">
              {[...Array(6)].map((_, slotIndex) => (
                <Skeleton key={slotIndex} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info Message Skeleton */}
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>
  );
}

/**
 * Appointment Card Skeleton Loader
 * Shows loading state for a single appointment card
 */
export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>

        <Skeleton className="h-16 w-16 rounded-md shrink-0" />
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/**
 * Appointments List Skeleton Loader
 * Shows loading state for multiple appointment cards
 */
export function AppointmentsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <AppointmentCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Form Field Skeleton Loader
 * Shows loading state for form inputs
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * Form Skeleton Loader
 * Shows loading state for a complete form
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(fields)].map((_, index) => (
        <FormFieldSkeleton key={index} />
      ))}
      <Skeleton className="h-10 w-full mt-6" />
    </div>
  );
}

/**
 * Modal Content Skeleton Loader
 * Shows loading state for modal content
 */
export function ModalContentSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      <div className="flex gap-2 pt-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}

/**
 * Table Skeleton Loader
 * Shows loading state for tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 border-b px-4 py-3 flex gap-4">
        {[...Array(columns)].map((_, index) => (
          <Skeleton key={index} className="h-5 flex-1" />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3 flex gap-4">
            {[...Array(columns)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Dashboard Stats Skeleton Loader
 * Shows loading state for dashboard statistics
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * Page Header Skeleton Loader
 * Shows loading state for page headers
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
  );
}

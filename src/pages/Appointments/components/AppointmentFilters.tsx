import type { AppointmentType } from "../../../types/appointments";

interface AppointmentFiltersProps {
  activeFilter: AppointmentType;
  onFilterChange: (filter: AppointmentType) => void;
}

export default function AppointmentFilters({ activeFilter, onFilterChange }: AppointmentFiltersProps) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => onFilterChange("future")}
        className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors ${
          activeFilter === "future"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => onFilterChange("past")}
        className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors ${
          activeFilter === "past"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        Past
      </button>
    </div>
  );
}


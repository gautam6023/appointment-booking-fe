import { useParams } from "react-router-dom";
import Calendar from "../components/Calendar";
import { CalendarDays } from "lucide-react";

export default function PublicCalendar() {
  const { sharableId } = useParams<{ sharableId: string }>();

  if (!sharableId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <CalendarDays className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Invalid Booking Link</h2>
          <p className="mt-2 text-gray-600">The booking link you're trying to access is invalid or incomplete.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book an Appointment</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Select a time slot that works for you</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <Calendar sharableId={sharableId} isPublicView={true} />
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Powered by <span className="font-semibold text-blue-600">BirdChime</span>
          </p>
        </div>
      </main>
    </div>
  );
}

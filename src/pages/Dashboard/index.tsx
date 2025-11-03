import { useAuth } from "../../context/AuthContext";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Calendar from "../../components/Calendar";

export default function Dashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const bookingLink = user?.sharableId ? `${window.location.origin}/calendar/${user.sharableId}` : "";

  const handleCopyBookingLink = () => {
    if (bookingLink) {
      navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      toast.success("Booking link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your appointments and availability from your dashboard.</p>
        </div>

        {/* Calendar Component */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <Calendar sharableId={user?.sharableId || ""} />
        </div>
        {/* Booking Link Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Your Booking Link</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Share this link with others so they can book appointments with you.</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-md overflow-x-auto">
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-blue-700 hover:text-blue-800 underline break-all"
              >
                {bookingLink}
              </a>
            </div>
            <button
              onClick={handleCopyBookingLink}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 flex-shrink-0"
              title="Copy link to clipboard"
            >
              {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              <span className="text-sm sm:hidden">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { formatWeekRange } from "../../utils/timeUtils";

interface CalendarHeaderProps {
  weekOffset: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export default function CalendarHeader({ weekOffset, onPreviousWeek, onNextWeek }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Availability</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">{formatWeekRange(weekOffset)}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onPreviousWeek} variant="outline" size="sm" className="flex items-center gap-1 flex-1 sm:flex-initial">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <Button onClick={onNextWeek} variant="outline" size="sm" className="flex items-center gap-1 flex-1 sm:flex-initial">
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


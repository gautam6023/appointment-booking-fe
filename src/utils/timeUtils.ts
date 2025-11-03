/**
 * Converts a UTC time string to local time and returns a Date object
 */
export const utcToLocal = (utcTimeString: string): Date => {
  return new Date(utcTimeString);
};

/**
 * Formats a UTC time string to local time string
 * @param utcTimeString - ISO 8601 UTC time string
 * @param options - Intl.DateTimeFormatOptions for formatting
 */
export const formatUTCToLocalTime = (
  utcTimeString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = utcToLocal(utcTimeString);
  return date.toLocaleTimeString("en-US", options || {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Formats a UTC date string to local date string
 */
export const formatUTCToLocalDate = (
  utcDateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = utcToLocal(utcDateString);
  return date.toLocaleDateString("en-US", options || {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a UTC date string to short date (e.g., "Jan 15")
 */
export const formatShortDate = (utcDateString: string): string => {
  const date = utcToLocal(utcDateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Formats time range from start and end UTC times
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  const start = formatUTCToLocalTime(startTime);
  const end = formatUTCToLocalTime(endTime);
  return `${start} - ${end}`;
};

/**
 * Gets the start of the week for a given week offset
 * @param weekOffset - Number of weeks from current week (0 = current, 1 = next, -1 = previous)
 * @param startDay - Day to start week on (0 = Sunday, 1 = Monday)
 */
export const getWeekStart = (weekOffset: number = 0, startDay: number = 1): Date => {
  const today = new Date();
  const currentDay = today.getDay();
  
  // Calculate difference to get to start day
  let diff = currentDay - startDay;
  if (diff < 0) {
    diff += 7;
  }
  
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - diff + (weekOffset * 7));
  weekStart.setHours(0, 0, 0, 0);
  
  return weekStart;
};

/**
 * Gets the end of the week for a given week offset
 */
export const getWeekEnd = (weekOffset: number = 0, startDay: number = 1): Date => {
  const weekStart = getWeekStart(weekOffset, startDay);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

/**
 * Formats week range for display (e.g., "Jan 15 - Jan 21, 2024")
 */
export const formatWeekRange = (weekOffset: number = 0): string => {
  const weekStart = getWeekStart(weekOffset, 1); // Start with Monday
  const weekEnd = getWeekEnd(weekOffset, 1);
  
  const startStr = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = weekEnd.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
  
  return `${startStr} - ${endStr}`;
};

/**
 * Gets the date for a specific day of the week with offset
 * @param dayId - Day of week (0 = Sunday, 1 = Monday, etc.)
 * @param weekOffset - Week offset from current week
 */
export const getDateForDay = (dayId: number, weekOffset: number = 0): Date => {
  const weekStart = getWeekStart(weekOffset, 1); // Monday-based week
  
  // Adjust dayId for Monday-first week
  // API uses: 0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday
  // We want: Monday first, so Monday(1) -> 0, Tuesday(2) -> 1, ..., Sunday(0) -> 6
  let adjustedDayIndex = dayId === 0 ? 6 : dayId - 1;
  
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + adjustedDayIndex);
  
  return date;
};

/**
 * Checks if a date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

/**
 * Checks if a date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date >= now;
};

/**
 * Gets the user's current timezone offset in the format required by the API (e.g., "+05:30", "-08:00")
 * Uses the current date/time to account for daylight saving time
 */
export const getCurrentTimezoneOffset = (): string => {
  const date = new Date();
  const offsetMinutes = -date.getTimezoneOffset(); // getTimezoneOffset returns negative for ahead of UTC
  
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  
  return `${sign}${hoursStr}:${minutesStr}`;
};

/**
 * Working days constant (Monday to Friday)
 */
export const WORKING_DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
] as const;

/**
 * Gets the current week date range
 */
export const getCurrentWeekRange = () => {
  const start = getWeekStart(0);
  const end = getWeekEnd(0);
  return { start, end };
};

/**
 * Checks if a day is in the past based on dayId
 * @param dayId - Day of week (1=Monday, 2=Tuesday, ..., 5=Friday)
 * @returns true if the day is in the past
 */
export const isDayInPast = (dayId: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate the date for this dayId in current week
  const weekStart = getWeekStart(0);
  // dayId: 1=Monday, 2=Tuesday, ..., 5=Friday
  const dayDate = new Date(weekStart);
  dayDate.setDate(weekStart.getDate() + (dayId - 1));
  
  return dayDate < today;
};


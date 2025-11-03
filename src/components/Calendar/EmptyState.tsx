interface EmptyStateProps {
  isWorkingDay: boolean;
}

export default function EmptyState({ isWorkingDay }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[180px]">
      <p className="text-xs text-gray-500 text-center">
        {isWorkingDay ? "No slots" : "Not Available"}
      </p>
    </div>
  );
}


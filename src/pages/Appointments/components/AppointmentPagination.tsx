import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../../components/ui/pagination";

interface AppointmentPaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  total: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export default function AppointmentPagination({
  currentPage,
  totalPages,
  limit,
  total,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}: AppointmentPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * limit, total)}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
                className={!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis before or after current range
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink onClick={() => onPageChange(pageNum)} isActive={pageNum === currentPage} className="cursor-pointer">
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => hasNextPage && onPageChange(currentPage + 1)}
                className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}


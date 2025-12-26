"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/helpers";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  perPage = 25,
  onPageChange,
  onPerPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage);
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) end = 3;
      if (currentPage >= totalPages - 1) start = totalPages - 2;

      if (start > 2) pages.push("ellipsis-left");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("ellipsis-right");

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full space-x-2 mt-4",
        className ?? ""
      )}
    >
      <div className="flex gap-2 items-center text-sm text-neutral-black">
        Show:
        <div className="relative">
          <Select
            value={perPage ? String(perPage) : undefined}
            onValueChange={(val: any) => onPerPageChange(Number(val))}
          >
            <SelectTrigger className="w-15 p-2 border-2 border-neutral-gray2 rounded-md text-sm bg-neutral-white text-neutral-black focus:ring-2 focus:ring-primary-main">
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>

            <SelectContent className="bg-neutral-white w-40 border border-neutral-gray2 rounded-md">
              {[25, 35, 45].map((val) => (
                <SelectItem
                  key={val}
                  value={String(val)}
                  className="text-neutral-black hover:bg-neutral-gray2 cursor-pointer"
                >
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="text-neutral-black w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-1/2">
        {currentPage !== 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-white text-neutral-gray1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-gray3 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {pageNumbers.map((page) =>
          typeof page === "string" ? (
            <span
              key={page}
              className="flex items-center justify-center w-8 h-8 text-neutral-black"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors cursor-pointer",
                currentPage === page
                  ? "bg-primary-main text-neutral-white"
                  : "hover:bg-neutral-gray3 text-neutral-gray1"
              )}
            >
              {page}
            </button>
          )
        )}
        {currentPage !== totalPages && (
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-white text-neutral-gray1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-gray3 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

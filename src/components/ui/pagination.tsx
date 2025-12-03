import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-xs font-medium text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={handleNext}
        disabled={!canGoNext}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

export { Pagination };

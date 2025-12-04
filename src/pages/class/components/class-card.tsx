import { motion } from "framer-motion";
import { CheckCircle, Pencil } from "lucide-react";
import type { Classroom } from "@/types/classroom";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  classroom: Classroom;
  studentCount: number;
  isSelected: boolean;
  onClick: (classroom: Classroom) => void;
  onEdit?: (classroom: Classroom) => void;
}

export function ClassCard({
  classroom,
  studentCount,
  isSelected,
  onClick,
  onEdit,
}: ClassCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(classroom);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(classroom)}
      className={cn(
        "group relative min-w-[140px] px-2.5 py-2 rounded-[8px] flex items-center gap-2.5 transition-all cursor-pointer border",
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-md"
          : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[8px] text-xs font-bold",
          isSelected
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {studentCount}
      </div>

      <div className="min-w-0 text-left">
        <h3
          className={cn(
            "truncate text-sm font-bold leading-tight",
            isSelected ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {classroom.name}
        </h3>
        <p className="truncate text-[10px] opacity-80">
          {classroom.grade || "No grade"}
        </p>
      </div>

      {isSelected && (
        <CheckCircle className="ml-auto size-5 shrink-0" />
      )}
      {onEdit && !isSelected && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={handleEditClick}
            className="flex size-6 items-center justify-center rounded-full bg-background/80 border border-border shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <Pencil className="size-3" />
          </button>
        </div>
      )}
    </motion.button>
  );
}

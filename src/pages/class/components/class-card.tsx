import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Classroom } from "@/types/classroom";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  classroom: Classroom;
  studentCount: number;
  isSelected: boolean;
  onClick: (classroom: Classroom) => void;
}

export function ClassCard({
  classroom,
  studentCount,
  isSelected,
  onClick,
}: ClassCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(classroom)}
      className={cn(
        "min-w-[200px] h-[120px] p-4 rounded-md flex flex-col items-start text-left transition-all cursor-pointer group justify-between relative overflow-hidden",
        isSelected
          ? "border-2 border-primary bg-primary/5 shadow-md"
          : "border border-border bg-card hover:border-primary/50 hover:shadow-md"
      )}
    >

      <div className="flex justify-between w-full z-10">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">
          {studentCount}
        </div>
        {isSelected && <CheckCircle className="size-5 text-primary fill-primary/20" />}
      </div>


      <div className="z-10">
        <h3
          className={cn(
            "font-bold text-lg leading-tight",
            isSelected ? "text-primary" : "text-foreground"
          )}
        >
          {classroom.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {classroom.grade || "No grade"}
        </p>
      </div>
    </motion.button>
  );
}

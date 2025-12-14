import { cn } from "@/lib/utils";
import { memo } from "react";

interface ProficiencyPillProps {
  level: string;
  isSelected: boolean;
  onClick: () => void;
}

export const ProficiencyPill = memo(function ProficiencyPill({ 
  level, 
  isSelected, 
  onClick 
}: ProficiencyPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border text-xs font-medium transition-all",
        isSelected
          ? "border-primary bg-primary text-primary-foreground shadow-md"
          : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
      )}
      aria-pressed={isSelected}
      aria-label={`Set proficiency level to ${level}`}
    >
      {level}
    </button>
  );
});

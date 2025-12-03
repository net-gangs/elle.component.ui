import { format } from "date-fns";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/classroom";

interface LessonGridCardProps {
  lesson: Lesson;
  isSelected?: boolean;
  onClick?: (lesson: Lesson) => void;
}

function LessonGridCard({
  lesson,
  isSelected = false,
  onClick,
}: LessonGridCardProps) {
  const scheduledDate = lesson.scheduledOn
    ? new Date(lesson.scheduledOn)
    : null;

  return (
    <div
      onClick={() => onClick?.(lesson)}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center rounded-md border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md",
        isSelected && "border-2 border-primary shadow-md"
      )}
    >
      {/* Date badge or icon */}
      <div className="relative mb-3">
        {scheduledDate ? (
          <div className="flex size-16 flex-col items-center justify-center rounded-full border border-border bg-secondary text-center leading-none transition-transform group-hover:scale-105">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              {format(scheduledDate, "MMM")}
            </span>
            <span className="text-lg font-bold text-foreground">
              {format(scheduledDate, "dd")}
            </span>
          </div>
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full border border-border bg-secondary transition-transform group-hover:scale-105">
            <BookOpen className="size-6 text-muted-foreground" />
          </div>
        )}
        {/* Status badge */}
        {lesson.status && (
          <div
            className={cn(
              "absolute -bottom-1 -right-1 rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize",
              lesson.status === "scheduled" &&
                "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
              lesson.status === "completed" &&
                "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400",
              lesson.status === "in_progress" &&
                "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
              lesson.status === "draft" &&
                "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
              lesson.status === "cancelled" &&
                "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {lesson.status.replace("_", " ")}
          </div>
        )}
      </div>

      {/* Title */}
      <h3
        className={cn(
          "line-clamp-2 w-full text-sm",
          isSelected ? "font-bold" : "font-semibold"
        )}
      >
        {lesson.title}
      </h3>

      {/* Topic */}
      {lesson.topic && (
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {lesson.topic}
        </p>
      )}
    </div>
  );
}

export { LessonGridCard };
export type { LessonGridCardProps };

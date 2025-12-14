import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Lesson, Student } from "@/types/classroom";

interface LessonCardProps {
  lesson: Lesson;
  participants?: Student[];
  onClick?: (lesson: Lesson) => void;
}

function LessonCard({ lesson, participants = [], onClick }: LessonCardProps) {
  const scheduledDate = lesson.scheduledOn
    ? new Date(lesson.scheduledOn)
    : null;

  return (
    <div
      onClick={() => onClick?.(lesson)}
      className={cn(
        "group flex cursor-pointer flex-col justify-between gap-4 rounded-[8px] border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md md:flex-row md:items-center"
      )}
    >
      <div className="flex items-center gap-4">

        {scheduledDate && (
          <div className="flex size-12 flex-col items-center justify-center rounded-full border border-border bg-secondary text-center leading-none">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              {format(scheduledDate, "MMM")}
            </span>
            <span className="text-lg font-bold text-foreground">
              {format(scheduledDate, "dd")}
            </span>
          </div>
        )}


        <div>
          <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">
            {lesson.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {lesson.topic && (
              <span className="flex items-center gap-1">
                <span className="size-1 rounded-full bg-muted-foreground" />
                {lesson.topic}
              </span>
            )}
            {lesson.durationMinutes && (
              <span className="flex items-center gap-1">
                <span className="size-1 rounded-full bg-muted-foreground" />
                {lesson.durationMinutes} min
              </span>
            )}
            {lesson.status && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                  lesson.status === "scheduled" &&
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  lesson.status === "completed" &&
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  lesson.status === "in_progress" &&
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                  lesson.status === "draft" &&
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                  lesson.status === "cancelled" &&
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {lesson.status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>
      </div>


      <div className="flex items-center gap-3 md:mt-0">
        {participants.length > 0 && (
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((student) => (
              <Avatar
                key={student.id}
                className="size-6 border-2 border-card"
              >
                <AvatarImage
                  src={
                    student.avatarUrl ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                      student.fullName
                    )}`
                  }
                  alt={student.fullName}
                />
                <AvatarFallback className="text-[8px]">
                  {student.fullName[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 3 && (
              <div className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[8px] font-bold">
                +{participants.length - 3}
              </div>
            )}
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(lesson);
          }}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export { LessonCard };
export type { LessonCardProps };

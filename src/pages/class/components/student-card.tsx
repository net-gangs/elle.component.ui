import { Check, BookOpen, Pencil, MessageCircle, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Student, CefrLevel, CefrLevels } from "@/types/classroom";

const skillColors = {
  reading: "bg-blue-100 text-blue-700",
  writing: "bg-amber-100 text-amber-700",
  speaking: "bg-purple-100 text-purple-700",
  listening: "bg-emerald-100 text-emerald-700",
} as const;

interface StudentCardProps {
  student: Student;
  isSelected?: boolean;
  onClick?: (student: Student) => void;
}

function getAvatarUrl(student: Student): string {
  if (student.avatarUrl) return student.avatarUrl;
  const seed = encodeURIComponent(student.fullName);
  const colors = ["a855f7", "e9d5ff", "fbcfe8", "c4b5fd", "bae6fd", "ddd6fe"];
  const colorIndex =
    student.fullName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=${colors[colorIndex]}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Calculate overall/average level from CEFR levels
function getOverallLevel(cefrLevels?: CefrLevels): CefrLevel | undefined {
  if (!cefrLevels) return undefined;
  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const values = [
    cefrLevels.reading,
    cefrLevels.writing,
    cefrLevels.speaking,
    cefrLevels.listening,
  ].filter(Boolean) as CefrLevel[];

  if (values.length === 0) return undefined;
  const indices = values.map((v) => levels.indexOf(v));
  const minIndex = Math.min(...indices);
  return levels[minIndex];
}

interface SkillIndicatorProps {
  icon: React.ElementType;
  level?: CefrLevel;
  skill: keyof typeof skillColors;
}

function SkillIndicator({ icon: Icon, level, skill }: SkillIndicatorProps) {
  if (!level) return null;
  
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md px-1.5 py-0.5",
        skillColors[skill]
      )}
    >
      <Icon className="size-3" />
      <span className="text-[10px] font-semibold">{level}</span>
    </div>
  );
}

function StudentCard({ student, isSelected = false, onClick }: StudentCardProps) {
  const overallLevel = getOverallLevel(student.cefrLevels);
  const hasCefrLevels = student.cefrLevels && Object.values(student.cefrLevels).some(Boolean);

  return (
    <div
      onClick={() => onClick?.(student)}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center rounded-[8px] border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md",
        isSelected && "border-2 border-primary shadow-md"
      )}
    >

      {isSelected && (
        <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </div>
      )}

   
      <div className="relative mb-3">
        <Avatar className="size-16 border border-border bg-secondary p-1 transition-transform group-hover:scale-105">
          <AvatarImage src={getAvatarUrl(student)} alt={student.fullName} />
          <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
        </Avatar>
        {overallLevel && (
          <div
            className={cn(
              "absolute -bottom-1 -right-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
              isSelected
                ? "border-background bg-foreground text-background"
                : "border-card bg-secondary text-secondary-foreground"
            )}
          >
            {overallLevel}
          </div>
        )}
      </div>

      <h3
        className={cn(
          "w-full truncate text-sm",
          isSelected ? "font-bold" : "font-semibold"
        )}
      >
        {student.fullName}
      </h3>

      {student.hobby && (
        <p className="w-full truncate text-xs italic text-muted-foreground/80 font-serif">
          "{student.hobby}"
        </p>
      )}

      {hasCefrLevels && (
        <div className="mt-2 grid grid-cols-2 gap-1">
          <SkillIndicator icon={BookOpen} level={student.cefrLevels?.reading} skill="reading" />
          <SkillIndicator icon={Headphones} level={student.cefrLevels?.listening} skill="listening" />
          <SkillIndicator icon={Pencil} level={student.cefrLevels?.writing} skill="writing" />
          <SkillIndicator icon={MessageCircle} level={student.cefrLevels?.speaking} skill="speaking" />
        </div>
      )}
    </div>
  );
}

export { StudentCard };
export type { StudentCardProps };

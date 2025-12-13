import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Pencil } from "lucide-react";
import { StudentForm } from "@/components/forms/student-form";
import type { Student } from "@/types/classroom";

export type StudentFormData = {
  fullName: string;
  grade: string;
  hobby: string;
  notes: string;
  avatarUrl?: string;
  specialNeeds: string[];
  cefrLevels: {
    reading: string;
    writing: string;
    speaking: string;
    listening: string;
  };
};

interface StudentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSubmit: (data: StudentFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

function getAvatarUrl(student?: Student | null): string {
  if (student?.avatarUrl) return student.avatarUrl;
  const seed = student?.fullName || "New";
  const encodedSeed = encodeURIComponent(seed);
  const colors = ["a855f7", "e9d5ff", "fbcfe8", "c4b5fd", "bae6fd", "ddd6fe"];
  const colorIndex =
    seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedSeed}&backgroundColor=${colors[colorIndex]}`;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function StudentDrawer({
  open,
  onOpenChange,
  student,
  onSubmit,
  isSubmitting = false,
}: StudentDrawerProps) {
  const isEditMode = !!student;

  const initialData = student
    ? {
        fullName: student.fullName || "",
        grade: student.grade || "",
        hobby: student.hobby || "",
        notes: student.notes || "",
        avatarUrl: student.avatarUrl || "",
        specialNeeds: (student.specialNeeds as string[]) || [],
        cefrLevels: {
          reading: student.cefrLevels?.reading || "A1",
          writing: student.cefrLevels?.writing || "A1",
          speaking: student.cefrLevels?.speaking || "A1",
          listening: student.cefrLevels?.listening || "A1",
        },
      }
    : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl [&>button]:hidden"
      >
        <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background/80 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-12 border bg-secondary p-0.5">
                <AvatarImage
                  src={getAvatarUrl(student)}
                  alt={student?.fullName || "New Student"}
                />
                <AvatarFallback>
                  {getInitials(student?.fullName)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border bg-card text-[10px] shadow-sm transition-colors hover:text-primary"
              >
                <Pencil className="size-2.5" />
              </button>
            </div>

            <div>
              <SheetTitle className="text-lg font-bold">
                {isEditMode ? "Edit Student" : "Add New Student"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {isEditMode
                  ? "Update profile details"
                  : "Create a new student profile"}
              </SheetDescription>
            </div>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="size-8 shrink-0 rounded-full transition-colors hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <div className="flex-1 p-6">
          <StudentForm
            key={student?.id ?? "new"}
            initialData={initialData}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

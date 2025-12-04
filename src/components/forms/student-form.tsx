import { useId, useRef, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Camera,
  Dices,
  Heart,
  Languages,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SPECIAL_NEEDS_OPTIONS = [
  "ADHD",
  "ODD",
  "ASD",
  "Depression",
  "ACEs",
  "Dysgraphia",
  "Dyslexia",
  "Anxiety Disorders",
];

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const studentSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  grade: z.string(),
  hobby: z.string(),
  notes: z.string(),
  avatarUrl: z.string().optional(),
  specialNeeds: z.array(z.string()),
  cefrLevels: z.object({
    reading: z.string(),
    writing: z.string(),
    speaking: z.string(),
    listening: z.string(),
  }),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: StudentFormData;
  onSubmit: (data: StudentFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

// Generate random dicebear avatar URL
function generateRandomAvatar(): string {
  const seed = Math.random().toString(36).substring(2, 10);
  const colors = ["a855f7", "e9d5ff", "fbcfe8", "c4b5fd", "bae6fd", "ddd6fe", "6366f1", "ec4899"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=${color}`;
}

// Proficiency Pill Component (mockup style)
interface ProficiencyPillProps {
  level: string;
  isSelected: boolean;
  onClick: () => void;
}

function ProficiencyPill({ level, isSelected, onClick }: ProficiencyPillProps) {
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
    >
      {level}
    </button>
  );
}

export function StudentForm({
  initialData,
  onSubmit,
  isSubmitting,
}: StudentFormProps) {
  const uniqueId = useId();
  const isEditMode = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: initialData || {
      fullName: "",
      grade: "",
      hobby: "",
      notes: "",
      avatarUrl: "",
      specialNeeds: [],
      cefrLevels: {
        reading: "A1",
        writing: "A1",
        speaking: "A1",
        listening: "A1",
      },
    },
    validators: {
      onSubmit: studentSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  // Handle file upload and convert to base64/data URL
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          form.setFieldValue("avatarUrl", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          form.setFieldValue("avatarUrl", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRandomize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.setFieldValue("avatarUrl", generateRandomAvatar());
    },
    [form]
  );

  return (
    <form
      id={uniqueId}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* ===== SECTION 1: Personal Information ===== */}
      <div className="space-y-4">
        {/* Avatar Upload - Centered */}
        <form.Field
          name="avatarUrl"
          children={(field) => (
            <div className="flex flex-col items-center">
              {/* Avatar Container with Upload/Randomize */}
              <div className="group relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="size-20 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary p-1 transition-colors group-hover:border-primary"
                >
                  {field.state.value ? (
                    <img
                      src={field.state.value}
                      alt="Avatar"
                      className="size-full rounded-full object-cover"
                      onError={() => {
                        field.handleChange("");
                      }}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-full bg-muted">
                      <Camera className="size-6 text-muted-foreground" />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="size-5" />
                    <span className="mt-0.5 text-[8px] font-bold uppercase">
                      Upload
                    </span>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Randomize Button */}
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="absolute -bottom-1 -right-1 z-10 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-110"
                  title="Randomize Avatar"
                >
                  <Dices className="size-4" />
                </button>
              </div>
            </div>
          )}
        />

        {/* Name and Grade Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.Field
            name="fullName"
            children={(nameField) => (
              <Field>
                <FieldLabel
                  htmlFor={`${uniqueId}-name`}
                  className="text-xs font-bold uppercase tracking-wide"
                >
                  Full Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={`${uniqueId}-name`}
                  name={nameField.name}
                  value={nameField.state.value}
                  onBlur={nameField.handleBlur}
                  onChange={(e) => nameField.handleChange(e.target.value)}
                  placeholder="Enter student name"
                  className="h-11 rounded-xl"
                />
                <FieldError errors={nameField.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="grade"
            children={(gradeField) => (
              <Field>
                <FieldLabel
                  htmlFor={`${uniqueId}-grade`}
                  className="text-xs font-bold uppercase tracking-wide"
                >
                  Grade <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={`${uniqueId}-grade`}
                  name={gradeField.name}
                  value={gradeField.state.value}
                  onBlur={gradeField.handleBlur}
                  onChange={(e) => gradeField.handleChange(e.target.value)}
                  placeholder="e.g. 7A"
                  className="h-11 rounded-xl"
                />
              </Field>
            )}
          />
        </div>
      </div>

      {/* ===== SECTION 2: Proficiency Levels ===== */}
      <div className="space-y-5 rounded-2xl border bg-secondary/30 p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold text-primary">
          <Languages className="size-4" />
          Proficiency Levels
        </h4>

        <div className="space-y-4">
          {(["reading", "writing", "listening", "speaking"] as const).map(
            (skill) => (
              <form.Field
                key={skill}
                name={`cefrLevels.${skill}`}
                children={(field) => (
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase text-muted-foreground">
                      {skill}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CEFR_LEVELS.map((level) => (
                        <ProficiencyPill
                          key={level}
                          level={level}
                          isSelected={field.state.value === level}
                          onClick={() => field.handleChange(level)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              />
            )
          )}
        </div>
      </div>

      {/* ===== SECTION 3: Interests & Notes ===== */}
      <div className="space-y-4">
        <form.Field
          name="hobby"
          children={(field) => (
            <Field>
              <FieldLabel
                htmlFor={`${uniqueId}-hobby`}
                className="text-xs font-bold uppercase tracking-wide"
              >
                Interests
              </FieldLabel>
              <div className="relative">
                <Heart className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={`${uniqueId}-hobby`}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Robotics, Chess..."
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </Field>
          )}
        />

        <form.Field
          name="notes"
          children={(field) => (
            <Field>
              <FieldLabel
                htmlFor={`${uniqueId}-notes`}
                className="text-xs font-bold uppercase tracking-wide"
              >
                Notes
              </FieldLabel>
              <Textarea
                id={`${uniqueId}-notes`}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Add private notes..."
                className="min-h-24 resize-none rounded-xl"
              />
            </Field>
          )}
        />
      </div>

      {/* ===== SECTION 4: Accommodations ===== */}
      <form.Field
        name="specialNeeds"
        children={(field) => (
          <Field>
            <FieldLabel className="text-xs font-bold uppercase tracking-wide">
              Accommodations
            </FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  type="button"
                  className={cn(
                    "h-auto min-h-11 w-full justify-between rounded-xl text-left font-normal",
                    !field.state.value.length && "text-muted-foreground"
                  )}
                >
                  {field.state.value.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {field.state.value.map((val) => (
                        <span
                          key={val}
                          className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Select accommodations..."
                  )}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search conditions..." />
                  <CommandList>
                    <CommandEmpty>No condition found.</CommandEmpty>
                    <CommandGroup>
                      {SPECIAL_NEEDS_OPTIONS.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => {
                            const current = field.state.value;
                            if (current.includes(option)) {
                              field.handleChange(
                                current.filter((v) => v !== option)
                              );
                            } else {
                              field.handleChange([...current, option]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              field.state.value.includes(option)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Field>
        )}
      />

      {/* ===== Footer Buttons ===== */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 rounded-xl font-bold"
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="h-12 flex-2 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {isEditMode ? "Save Changes" : "Create Student"}
        </Button>
      </div>
    </form>
  );
}

export type { StudentFormData };

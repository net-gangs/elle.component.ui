import { useId } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronsUpDown, Loader2, User } from "lucide-react";
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
import { Label } from "@/components/ui/label";

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

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

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

export function StudentForm({
  initialData,
  onSubmit,
  isSubmitting,
}: StudentFormProps) {
  const uniqueId = useId();
  const isEditMode = !!initialData;

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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Student" : "Add Student"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update student profile details."
            : "Create a new student profile."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id={uniqueId}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="fullName"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={`${uniqueId}-name`}>
                    Full Name
                  </FieldLabel>
                  <Input
                    id={`${uniqueId}-name`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John Doe"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="grade"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={`${uniqueId}-grade`}>Grade</FieldLabel>
                  <Input
                    id={`${uniqueId}-grade`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. 5th Grade"
                  />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="hobby"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={`${uniqueId}-hobby`}>Hobby</FieldLabel>
                  <Input
                    id={`${uniqueId}-hobby`}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Reading, Sports..."
                  />
                </Field>
              )}
            />

            <form.Field
              name="avatarUrl"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={`${uniqueId}-avatar`}>
                    Avatar URL
                  </FieldLabel>
                  <div className="flex gap-3 items-center">
                    {/* The Preview Circle */}
                    <div className="shrink-0 size-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
                      {field.state.value ? (
                        <img
                          src={field.state.value}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.src = "";
                            // Optionally clear the value or just show icon
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <User className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* The Input */}
                    <Input
                      id={`${uniqueId}-avatar`}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                  </div>
                </Field>
              )}
            />
          </div>

          <form.Field
            name="specialNeeds"
            children={(field) => (
              <div className="space-y-3">
                <FieldLabel>Special Needs / Conditions</FieldLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      type="button"
                      className={cn(
                        "w-full justify-between h-auto min-h-10 text-left font-normal",
                        !field.state.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.state.value.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {field.state.value.map((val) => (
                            <span
                              key={val}
                              className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm text-xs"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "Select conditions..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
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
                                  "mr-2 h-4 w-4",
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
              </div>
            )}
          />

          <div className="space-y-6">
            <FieldLabel>Detailed Proficiency</FieldLabel>

            <div className="grid grid-cols-1 gap-6">
              {["reading", "writing", "speaking", "listening"].map((skill) => (
                <form.Field
                  key={skill}
                  name={`cefrLevels.${skill}` as any}
                  children={(field) => (
                    <RadioGroup
                      onValueChange={field.handleChange}
                      value={field.state.value}
                      className="flex justify-between"
                    >
                      {CEFR_LEVELS.map((level) => (
                        <div
                          key={level}
                          className="flex flex-col items-center gap-2"
                        >
                          <RadioGroupItem
                            value={level}
                            id={`${uniqueId}-${skill}-${level}`}
                            className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                          />

                          <Label
                            htmlFor={`${uniqueId}-${skill}-${level}`}
                            className="text-xs font-normal cursor-pointer text-muted-foreground"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              ))}
            </div>
          </div>

          <form.Field
            name="notes"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={`${uniqueId}-notes`}>Notes</FieldLabel>
                <Textarea
                  id={`${uniqueId}-notes`}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Extra help with pronunciation..."
                  className="min-h-20"
                />
              </Field>
            )}
          />
        </form>
      </CardContent>

      <CardFooter>
        <div className="grid w-full gap-2 grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="w-full"
            form={uniqueId}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Save Changes" : "Create Student"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

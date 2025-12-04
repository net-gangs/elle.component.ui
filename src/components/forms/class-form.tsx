import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, Save, BookOpen } from "lucide-react";
import type { Classroom } from "@/types/classroom";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Class name must be at least 3 characters.")
    .max(50, "Class name must be at most 50 characters."),
  grade: z.string(),
});

export type ClassFormData = z.infer<typeof formSchema>;

interface ClassFormProps {
  initialData?: ClassFormData;
  onSubmit: (data: ClassFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function ClassForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ClassFormProps) {
  const isEditMode = !!initialData;

  const form = useForm({
    defaultValues: initialData || {
      name: "",
      grade: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Class" : "Create New Class"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the details of this classroom."
            : "Enter the details below to set up a new classroom."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="class-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Field: Class Name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Class Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Advanced English A"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Field: Grade */}
            <form.Field
              name="grade"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Grade / Level{" "}
                      <span className="text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Grade 5"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="grid grid-cols-2 w-full gap-2">
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
            form="class-form"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditMode ? "Save Changes" : "Create Class"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// ============================================
// CLASS DIALOG - Dialog wrapper for ClassForm
// ============================================

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom?: Classroom | null;
  onSubmit: (data: ClassFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function ClassDialog({
  open,
  onOpenChange,
  classroom,
  onSubmit,
  isSubmitting = false,
}: ClassDialogProps) {
  const isEditMode = !!classroom;

  const form = useForm({
    defaultValues: {
      name: "",
      grade: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  // Reset form when classroom changes or dialog opens
  useEffect(() => {
    if (open) {
      if (classroom) {
        form.reset({
          name: classroom.name || "",
          grade: classroom.grade || "",
        });
      } else {
        form.reset({
          name: "",
          grade: "",
        });
      }
    }
  }, [open, classroom, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isEditMode ? "Edit Class" : "Create New Class"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditMode
              ? "Update the details of this classroom."
              : "Enter the details below to set up a new classroom."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="class-dialog-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 py-4"
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wide"
                    >
                      Class Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Advanced English A"
                      autoComplete="off"
                      className="h-11 rounded-xl"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="grade"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wide"
                    >
                      Grade / Level{" "}
                      <span className="font-normal text-muted-foreground">
                        (Optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Grade 5"
                      autoComplete="off"
                      className="h-11 rounded-xl"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="class-dialog-form"
            className="flex-1 rounded-xl shadow-lg shadow-primary/25"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            {isEditMode ? "Save Changes" : "Create Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

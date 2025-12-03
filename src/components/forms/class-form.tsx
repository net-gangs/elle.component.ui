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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Class name must be at least 3 characters.")
    .max(50, "Class name must be at most 50 characters."),
  grade: z.string(),
});

type ClassFormData = z.infer<typeof formSchema>;

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

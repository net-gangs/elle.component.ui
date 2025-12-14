import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addChatToClass,
  setSelectedChatId,
  setSelectedClassId,
} from "@/stores/lesson-store";
import { School } from "lucide-react";
import type { Classroom } from "@/types";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useCreateChat } from "@/hooks/@ella/use-chats";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetClass: Classroom | undefined;
}

const newChatSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "lessonPlanning.chats.validation.titleRequired"),
  lessonTopic: z
    .string()
    .trim()
    .min(1, "lessonPlanning.chats.validation.topicRequired"),
  gradeYear: z.string().trim().optional(),
  durationMinutes: z
    .number()
    .min(1, "lessonPlanning.chats.validation.durationMin"),
  learningObjectives: z.string().trim().optional(),
  teachingActivities: z.string().trim().optional(),
  assessmentType: z.string().trim().optional(),
});

type NewChatPayload = z.infer<typeof newChatSchema>;

const defaultValues: NewChatPayload = {
  title: "",
  lessonTopic: "",
  gradeYear: "",
  durationMinutes: 45,
  learningObjectives: "",
  teachingActivities: "",
  assessmentType: "",
};

export function NewChatDialog({
  open,
  onOpenChange,
  targetClass,
}: NewChatDialogProps) {
  const { t } = useTranslation();
  const createChatMutation = useCreateChat();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: newChatSchema,
    },
    onSubmit: async ({ value }) => {
      if (!targetClass?.id) return;

      const payload = {
        ...value,
        gradeYear: value.gradeYear || undefined,
        learningObjectives: value.learningObjectives || undefined,
        teachingActivities: value.teachingActivities || undefined,
        assessmentType: value.assessmentType || undefined,
      };

      const newChat = await createChatMutation.mutateAsync({
        classId: targetClass.id,
        data: payload,
      });

      addChatToClass(targetClass.id, {
        ...newChat,
        messages: [],
      });
      setSelectedClassId(targetClass.id);
      setSelectedChatId(newChat.id);

      onOpenChange(false);
      form.reset();
    },
  });

  // Reset form when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("lessonPlanning.chats.newChatTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("lessonPlanning.chats.newChatDescription")}
          </DialogDescription>
        </DialogHeader>

        {targetClass && (
          <div className="bg-muted/50 flex items-center gap-3 rounded-md p-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <School className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs font-medium">
                {t("lessonPlanning.chats.currentClass")}
              </span>
              <span className="text-sm font-semibold">{targetClass.name}</span>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="py-4"
        >
          <FieldGroup>
            {/* Title */}
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      {t("lessonPlanning.chats.chatTitleLabel")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t(
                        "lessonPlanning.chats.chatTitlePlaceholder",
                      )}
                      aria-invalid={isInvalid}
                      aria-describedby={
                        isInvalid ? `${field.name}-error` : undefined
                      }
                      autoFocus
                    />
                    {isInvalid && (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            />

            {/* Topic */}
            <form.Field
              name="lessonTopic"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      {t("lessonPlanning.chats.lessonTopicLabel")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t(
                        "lessonPlanning.chats.lessonTopicPlaceholder",
                      )}
                      aria-invalid={isInvalid}
                      aria-describedby={
                        isInvalid ? `${field.name}-error` : undefined
                      }
                    />
                    {isInvalid && (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Grade */}
              <form.Field
                name="gradeYear"
                children={(field) => (
                  <Field>
                    <FieldLabel>
                      {t("lessonPlanning.chats.gradeYearLabel")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t(
                        "lessonPlanning.chats.gradeYearPlaceholder",
                      )}
                    />
                  </Field>
                )}
              />

              {/* Duration */}
              <form.Field
                name="durationMinutes"
                children={(field) => (
                  <Field>
                    <FieldLabel>
                      {t("lessonPlanning.chats.lessonDurationLabel")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                  </Field>
                )}
              />
            </div>

            {/* Learning Objectives */}
            <form.Field
              name="learningObjectives"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    {t("lessonPlanning.chats.learningObjectivesLabel")}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t(
                      "lessonPlanning.chats.learningObjectivesPlaceholder",
                    )}
                    rows={3}
                  />
                </Field>
              )}
            />

            {/* Teaching Activities */}
            <form.Field
              name="teachingActivities"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    {t("lessonPlanning.chats.teachingActivitiesLabel")}
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t(
                      "lessonPlanning.chats.teachingActivitiesPlaceholder",
                    )}
                    rows={3}
                  />
                </Field>
              )}
            />

            {/* Assessment Type */}
            <form.Field
              name="assessmentType"
              children={(field) => (
                <Field>
                  <FieldLabel>
                    {t("lessonPlanning.chats.assessmentTypeLabel")}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t(
                      "lessonPlanning.chats.assessmentTypePlaceholder",
                    )}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={form.state.isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={form.handleSubmit}
            disabled={
              !targetClass?.id || !form.state.isValid || form.state.isSubmitting
            }
          >
            {form.state.isSubmitting && <Spinner className="mr-2" />}
            {t("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useTranslation } from "react-i18next";
import { Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { type LessonChatMessage } from "@/stores/lesson-store";

interface MessageBubbleProps {
  message: LessonChatMessage;
  teacherLabel?: string;
  assistantLabel?: string;
  onSaveToLesson?: () => void;
  onRemoveLesson?: () => void;
  isStreaming?: boolean;
  isSaving?: boolean;
  isRemoving?: boolean;
}

export default function MessageBubble({
  message,
  teacherLabel,
  assistantLabel,
  onSaveToLesson,
  onRemoveLesson,
  isStreaming,
  isSaving,
  isRemoving,
}: MessageBubbleProps) {
  const { t } = useTranslation();

  const isTeacher = message.role === "teacher";
  const isSavedLesson = !!message.lessonId;

  const isPersistedMessage = isTeacher
    ? !message.id.startsWith("temp-")
    : !message.id.startsWith("msg-");

  const roleLabel = isTeacher
    ? teacherLabel || t("lessonPlanning.conversation.teacherLabel", "Teacher")
    : assistantLabel ||
      t("lessonPlanning.conversation.assistantLabel", "Assistant");

  return (
    <div
      className={cn("flex w-full", isTeacher ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "relative max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all",
          isTeacher
            ? "bg-primary text-primary-foreground"
            : "bg-white border border-border"
        )}
      >
        <MessageHeader
          label={roleLabel}
          isTeacher={isTeacher}
          isSavedLesson={isSavedLesson}
        />

        {!isTeacher && isSavedLesson && (
          <SavedLessonBanner
            lessonTitle={message.lessonTitle}
            onRemove={onRemoveLesson}
            isRemoving={isRemoving}
          />
        )}

        <div
          className={cn(
            "text-sm",
            isTeacher && "whitespace-pre-wrap leading-relaxed"
          )}
        >
          {isTeacher ? (
            message.content
          ) : (
            <Markdown
              content={message.content}
              className="prose-sm max-w-none dark:prose-invert"
            />
          )}
          {isStreaming && (
            <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary align-middle" />
          )}
        </div>

        <MessageFooter
          timestamp={message.timestamp}
          isTeacher={isTeacher}
          isStreaming={isStreaming}
          isSavedLesson={isSavedLesson}
          isPersistedMessage={isPersistedMessage}
          isSaving={isSaving}
          isRemoving={isRemoving}
          onSave={onSaveToLesson}
          onRemove={onRemoveLesson}
        />
      </div>
    </div>
  );
}

function MessageHeader({
  label,
  isTeacher,
  isSavedLesson,
}: {
  label: string;
  isTeacher: boolean;
  isSavedLesson: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wide",
          isTeacher ? "text-primary-foreground/90" : "text-primary"
        )}
      >
        {label}
      </p>
      {!isTeacher && isSavedLesson && (
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm ring-1 ring-emerald-100">
          {t("lessonPlanning.conversation.savedBadge", "Saved")}
        </span>
      )}
    </div>
  );
}

function SavedLessonBanner({
  lessonTitle,
  onRemove,
  isRemoving,
}: {
  lessonTitle?: string | null;
  onRemove?: () => void;
  isRemoving?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-emerald-800">
      <div className="flex items-center gap-2 text-xs font-medium">
        <Sparkles className="size-3.5 shrink-0 text-emerald-600" />
        <span className="line-clamp-1 break-all">
          {lessonTitle ||
            t("lessonPlanning.conversation.savedLesson", "Saved as lesson")}
        </span>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
          onClick={onRemove}
          disabled={isRemoving}
          title={t("lessonPlanning.conversation.removeLesson", "Remove lesson")}
        >
          {isRemoving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Trash2 className="size-3" />
          )}
        </Button>
      )}
    </div>
  );
}

function MessageFooter({
  timestamp,
  isTeacher,
  isStreaming,
  isSavedLesson,
  isPersistedMessage,
  isSaving,
  isRemoving,
  onSave,
  onRemove,
}: {
  timestamp?: string;
  isTeacher: boolean;
  isStreaming?: boolean;
  isSavedLesson: boolean;
  isPersistedMessage: boolean;
  isSaving?: boolean;
  isRemoving?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
}) {
  const { t } = useTranslation();

  if (isStreaming) return null;

  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <p
        className={cn(
          "text-[10px] tabular-nums",
          isTeacher ? "text-primary-foreground/70" : "text-muted-foreground"
        )}
      >
        {timestamp}
      </p>

      {!isTeacher && (
        <div className="flex items-center gap-1">
          {isSavedLesson
            ? onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 gap-1.5 px-2 text-[10px] font-medium text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
                  onClick={onRemove}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                  {t("lessonPlanning.conversation.removeLesson", "Remove")}
                </Button>
              )
            : onSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 gap-1.5 px-2 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={onSave}
                  disabled={isSaving || !isPersistedMessage}
                >
                  {isSaving ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Save className="size-3" />
                  )}
                  {t(
                    "lessonPlanning.conversation.saveToLesson",
                    "Save to Lesson"
                  )}
                </Button>
              )}
        </div>
      )}
    </div>
  );
}

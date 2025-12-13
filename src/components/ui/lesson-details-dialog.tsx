import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Target,
  Sparkles,
} from "lucide-react";
import { Users, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClassroom } from "@/hooks/use-classrooms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Markdown } from "@/components/ui/markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { lessonService } from "@/services/lesson-service";
import type { Lesson } from "@/types/classroom";

interface LessonDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  lessonId: string;
  showContent?: boolean;
  classroomName?: string | null;
}

export function LessonDetailsDialog({
  open,
  onOpenChange,
  classroomId,
  lessonId,
  showContent = false,
  classroomName = null,
}: LessonDetailsDialogProps) {
  const { t } = useTranslation();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", classroomId, lessonId],
    queryFn: () => lessonService.getById(classroomId, lessonId),
    enabled: open && !!classroomId && !!lessonId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <LessonDetailsSkeleton />
        ) : lesson ? (
          <LessonDetailsBody
            lesson={lesson}
            showContent={showContent}
            classroomName={classroomName ?? undefined}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t("lessonDetails.notFound", "Lesson not found")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function LessonDetailsBody({
  lesson,
  showContent,
  classroomName,
  suppressHeader = false,
}: {
  lesson: Lesson;
  showContent: boolean;
  classroomName?: string | undefined | null;
  suppressHeader?: boolean;
}) {
  const { t } = useTranslation();

  const scheduledDate = lesson.scheduledOn
    ? new Date(lesson.scheduledOn)
    : null;

  // Determine which classroom to show
  const lessonClassroomId = lesson.classroomId || undefined;
  const classroomQuery = useClassroom(lessonClassroomId);
  const displayedClassName = classroomName ?? classroomQuery.data?.name ?? "";

  return (
    <>
      {!suppressHeader && (
        <DialogHeader>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-lg border-2",
              lesson.generated
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-primary/20 bg-primary/10 text-primary"
            )}
          >
            {lesson.generated ? (
              <Sparkles className="size-6" />
            ) : (
              <BookOpen className="size-6" />
            )}
          </div>
          <div className="flex-1">
            <DialogTitle className="text-left text-xl">
              {lesson.title}
            </DialogTitle>
            {lesson.topic && (
              <DialogDescription className="mt-1 text-left">
                {lesson.topic}
              </DialogDescription>
            )}
          </div>
        </div>

        {/* Classroom info */}
        {displayedClassName && (
          <div className="mt-2 flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{displayedClassName}</span>
            </div>
            {/* no navigation button - dialog is presentational */}
          </div>
        )}

        {/* Status Badge */}
        {lesson.status && (
          <div className="flex justify-start">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
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
          </div>
        )}
      </DialogHeader>
      )}

      <div className="space-y-6">
        {/* Metadata Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {scheduledDate && (
            <MetadataItem
              icon={<Calendar className="size-4" />}
              label={t("lessonDetails.scheduledOn", "Scheduled On")}
              value={format(scheduledDate, "PPP")}
            />
          )}
          {lesson.durationMinutes && (
            <MetadataItem
              icon={<Clock className="size-4" />}
              label={t("lessonDetails.duration", "Duration")}
              value={`${lesson.durationMinutes} ${t("lessonDetails.minutes", "minutes")}`}
            />
          )}
          {lesson.gradeYear && (
            <MetadataItem
              icon={<GraduationCap className="size-4" />}
              label={t("lessonDetails.grade", "Grade")}
              value={lesson.gradeYear}
            />
          )}
          {lesson.targetLanguage && (
            <MetadataItem
              icon={<BookOpen className="size-4" />}
              label={t("lessonDetails.targetLanguage", "Target Language")}
              value={lesson.targetLanguage}
            />
          )}
        </div>

        {/* CEFR Levels */}
        {(lesson.cefrReading ||
          lesson.cefrWriting ||
          lesson.cefrSpeaking ||
          lesson.cefrListening) && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 font-semibold text-sm">
              <Target className="size-4" />
              {t("lessonDetails.cefrLevels", "CEFR Levels")}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {lesson.cefrReading && (
                <CefrBadge
                  label={t("lessonDetails.reading", "Reading")}
                  level={lesson.cefrReading}
                />
              )}
              {lesson.cefrWriting && (
                <CefrBadge
                  label={t("lessonDetails.writing", "Writing")}
                  level={lesson.cefrWriting}
                />
              )}
              {lesson.cefrSpeaking && (
                <CefrBadge
                  label={t("lessonDetails.speaking", "Speaking")}
                  level={lesson.cefrSpeaking}
                />
              )}
              {lesson.cefrListening && (
                <CefrBadge
                  label={t("lessonDetails.listening", "Listening")}
                  level={lesson.cefrListening}
                />
              )}
            </div>
          </div>
        )}

        {/* Learning Objectives */}
        {lesson.learningObjectives && (
          <ContentSection
            title={t("lessonDetails.learningObjectives", "Learning Objectives")}
            content={lesson.learningObjectives}
          />
        )}

        {/* Teaching Activities */}
        {lesson.teachingActivities && (
          <ContentSection
            title={t("lessonDetails.teachingActivities", "Teaching Activities")}
            content={lesson.teachingActivities}
          />
        )}

        {/* Lesson Content - Only show when showContent is true */}
        {showContent && lesson.contentMd && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">
              {t("lessonDetails.lessonContent", "Lesson Content")}
            </h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <Markdown
                content={lesson.contentMd}
                className="prose-sm max-w-none dark:prose-invert"
              />
            </div>
            {lesson.generated && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground italic">
                <Sparkles className="size-3" />
                {t(
                  "lessonDetails.aiGenerated",
                  "This content was generated by AI"
                )}
              </p>
            )}
          </div>
        )}

        {/* Structured Content */}
        {lesson.structuredContent?.sections &&
          lesson.structuredContent.sections.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">
                {t("lessonDetails.lessonStructure", "Lesson Structure")}
              </h3>
              <div className="space-y-2">
                {lesson.structuredContent.sections.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border bg-card p-3"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm">{section.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {section.duration} {t("lessonDetails.min", "min")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {section.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Prompt (if available) */}
        {lesson.prompt && lesson.generated && (
          <details className="group">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              {t("lessonDetails.viewPrompt", "View generation prompt")}
            </summary>
            <div className="mt-2 rounded-lg border bg-muted/50 p-3 text-xs">
              {lesson.prompt}
            </div>
          </details>
        )}

        {/* Timestamps */}
        <div className="flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
          <span>
            {t("lessonDetails.created", "Created")}:{" "}
            {format(new Date(lesson.createdAt), "PPp")}
          </span>
          {lesson.updatedAt !== lesson.createdAt && (
            <span>
              {t("lessonDetails.updated", "Updated")}:{" "}
              {format(new Date(lesson.updatedAt), "PPp")}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export function LessonDetailsSheet({
  open,
  onOpenChange,
  classroomId,
  lessonId,
  showContent = false,
  classroomName = null,
}: LessonDetailsDialogProps) {
  const { t } = useTranslation();
  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", classroomId, lessonId, "sheet"],
    queryFn: () => lessonService.getById(classroomId, lessonId),
    enabled: open && !!classroomId && !!lessonId,
  });

  const lessonClassroomId = lesson?.classroomId || classroomId || undefined;
  const classroomQuery = useClassroom(lessonClassroomId);
  const displayedClassName = classroomName ?? classroomQuery.data?.name ?? "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between gap-3 border-b bg-background/80 p-6 backdrop-blur-sm">
          {lesson ? (
            <div className="flex items-center gap-3 w-full">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-lg border-2",
                  lesson.generated
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-primary/20 bg-primary/10 text-primary"
                )}
              >
                {lesson.generated ? (
                  <Sparkles className="size-6" />
                ) : (
                  <BookOpen className="size-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{lesson.title}</h3>
                {lesson.topic && (
                  <p className="text-xs text-muted-foreground mt-0.5">{lesson.topic}</p>
                )}
              </div>
              {displayedClassName && (
                <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                  {displayedClassName}
                </span>
              )}
              <Button variant="ghost" size="icon" className="size-8" onClick={() => onOpenChange(false)}>
                <XIcon className="size-4" />
              </Button>
            </div>
          ) : null}
        </SheetHeader>
        <div className="flex-1 p-6">
          {isLoading ? (
            <LessonDetailsSkeleton />
          ) : lesson ? (
            <LessonDetailsBody lesson={lesson} showContent={showContent} classroomName={classroomName ?? undefined} suppressHeader={true} />
          ) : (
            <div className="py-8 text-center text-muted-foreground">{t("lessonDetails.notFound", "Lesson not found")}</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetadataItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function CefrBadge({ label, level }: { label: string; level: string }) {
  return (
    <div className="rounded-lg border bg-card px-2 py-1.5 text-center">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-primary">{level}</p>
    </div>
  );
}

function ContentSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <div className="rounded-lg border bg-card p-3 text-sm">{content}</div>
    </div>
  );
}

function LessonDetailsSkeleton() {
  return (
    <>
      <DialogHeader>
        <div className="flex items-start gap-3">
          <Skeleton className="size-12 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </DialogHeader>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}

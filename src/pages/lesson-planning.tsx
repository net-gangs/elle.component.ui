import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useStore } from "@tanstack/react-store";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { lessonStore, mockProjects, type LessonChatMessage } from "@/stores/lesson-store";

const quickPromptKeys = [
  "lessonPlanning.conversation.promptGenerateHook",
  "lessonPlanning.conversation.promptRemix",
  "lessonPlanning.conversation.promptChecklist",
] as const;

export default function LessonPlanning() {
  const { t } = useTranslation();
  const { selectedProjectId, selectedChatId } = useStore(lessonStore);
  const [contextOpen, setContextOpen] = useState(true);

  const selectedProject = useMemo(
    () => mockProjects.find((project) => project.id === selectedProjectId),
    [selectedProjectId]
  );

  const selectedChat = useMemo(
    () => selectedProject?.chats.find((chat) => chat.id === selectedChatId),
    [selectedProject, selectedChatId]
  );

  return (
    <div className="flex h-full flex-col p-5 bg-white">
      <div className="flex h-full flex-col">

        <div className="flex flex-1 flex-col gap-4">
          {selectedProject ? (
            <Collapsible
              open={contextOpen}
              onOpenChange={setContextOpen}
              className="rounded-2xl border bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {t("lessonPlanning.snapshot.title")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {`${selectedProject.unit} · ${selectedProject.subject}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!selectedProject}
                  >
                    {t("lessonPlanning.actions.editContext")}
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("lessonPlanning.snapshot.toggle")}
                    >
                      {contextOpen ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent className="mt-4 grid gap-4 sm:grid-cols-3">
                <SnapshotItem
                  icon={Target}
                  label={t("lessonPlanning.snapshot.objectives")}
                  value={selectedProject.snapshot.objectives}
                />
                <SnapshotItem
                  icon={BookOpen}
                  label={t("lessonPlanning.snapshot.standards")}
                  value={selectedProject.snapshot.standards}
                />
                <SnapshotItem
                  icon={Users}
                  label={t("lessonPlanning.snapshot.students")}
                  value={selectedProject.snapshot.classes}
                />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
              {t("lessonPlanning.snapshot.empty")}
            </div>
          )}

          {selectedChat ? (
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex-1 space-y-4 overflow-auto pr-1">
                {selectedChat.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    teacherLabel={t(
                      "lessonPlanning.conversation.teacherLabel"
                    )}
                    assistantLabel={t(
                      "lessonPlanning.conversation.assistantLabel"
                    )}
                  />
                ))}
              </div>
              <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
                <Textarea
                  placeholder={t("lessonPlanning.conversation.placeholder")}
                  rows={4}
                  className="border-0 shadow-none focus-visible:ring-0 resize-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {quickPromptKeys.map((promptKey) => (
                      <button
                        key={promptKey}
                        type="button"
                        className="rounded-full border bg-transparent px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                      >
                        {t(promptKey)}
                      </button>
                    ))}
                  </div>
                  <Button className="whitespace-nowrap">
                    <Send className="size-4 mr-2" />
                    {t("lessonPlanning.conversation.send")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-10 text-center">
              <Sparkles className="size-10 text-muted-foreground" />
              <p className="text-base font-medium">
                {t("lessonPlanning.conversation.title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("lessonPlanning.chats.empty")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SnapshotItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1 rounded-2xl border bg-white p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

function MessageBubble({
  message,
  teacherLabel,
  assistantLabel,
}: {
  message: LessonChatMessage;
  teacherLabel: string;
  assistantLabel: string;
}) {
  const isTeacher = message.role === "teacher";

  return (
    <div className={cn("flex", isTeacher ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
          isTeacher
            ? "bg-primary text-primary-foreground"
            : "bg-white border"
        )}
      >
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            isTeacher ? "text-primary-foreground/80" : "text-primary"
          )}
        >
          {isTeacher ? teacherLabel : assistantLabel}
        </p>
        <p className="mt-1 leading-relaxed">{message.content}</p>
        <p
          className={cn(
            "mt-2 text-xs",
            isTeacher
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

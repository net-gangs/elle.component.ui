import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Loader2,
  Save,
  Sparkles,
  ClipboardCheck,
} from "lucide-react";
import { useStore } from "@tanstack/react-store";

import { Button } from "@/components/ui/button";
import { lessonStore, type LessonChatMessage } from "@/stores/lesson-store";
import { chatService } from "@/services/chat-service";
import { Markdown } from "@/components/ui/markdown";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatInputArea from "./components/chat-input-area";
import MessageBubble from "./components/message-bubble";

export default function LessonPlanning() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedClassId, selectedChatId, classes } = useStore(lessonStore);

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);

  const [contextOpen, setContextOpen] = useState(false);
  const [messageToSave, setMessageToSave] = useState<LessonChatMessage | null>(
    null
  );
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId]
  );

  const selectedChat = useMemo(
    () => selectedClass?.chats.find((chat) => chat.id === selectedChatId),
    [selectedClass, selectedChatId]
  );

  const messagesQueryKey = useMemo(
    () => ["class", selectedClassId, "chat", selectedChatId, "messages"],
    [selectedClassId, selectedChatId]
  );

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: messagesQueryKey,
    enabled: !!selectedClassId && !!selectedChatId,
    queryFn: async () => {
      const response = await chatService.getMessages(
        selectedClassId!,
        selectedChatId!,
        { limit: 100 }
      );

      return response.data.map((msg) => ({
        id: msg.id,
        role:
          msg.role === "user" ? ("teacher" as const) : ("assistant" as const),
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: msg.createdAt,
        lessonId: msg.lessonId ?? null,
        lessonTitle: msg.lessonTitle ?? null,
        lessonCreatedAt: msg.lessonCreatedAt ?? null,
      }));
    },
  });

  const saveToLessonMutation = useMutation({
    mutationFn: (messageId: string) =>
      chatService.saveToLesson(selectedClassId!, selectedChatId!, messageId),
    onSuccess: (result, messageId) => {
      queryClient.setQueryData<LessonChatMessage[]>(messagesQueryKey, (old) =>
        old?.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                lessonId: result.lessonId,
                lessonTitle: result.lessonTitle,
                lessonCreatedAt: new Date().toISOString(),
              }
            : msg
        )
      );
      toast.success(
        t("lessonPlanning.conversation.savedToLesson", "Saved successfully")
      );
      setIsSaveDialogOpen(false);
      setMessageToSave(null);
    },
  });

  const removeLessonMutation = useMutation({
    mutationFn: (messageId: string) =>
      chatService.removeSavedLesson(
        selectedClassId!,
        selectedChatId!,
        messageId
      ),
    onSuccess: (_, messageId) => {
      queryClient.setQueryData<LessonChatMessage[]>(messagesQueryKey, (old) =>
        old?.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                lessonId: null,
                lessonTitle: null,
                lessonCreatedAt: null,
              }
            : msg
        )
      );
      toast.success(
        t("lessonPlanning.conversation.lessonRemoved", "Lesson removed")
      );
    },
  });

  useEffect(() => {
    if (messages.length > 0 || streamingContent) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, streamingContent]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (
        !selectedClassId ||
        !selectedChatId ||
        !text.trim() ||
        isSendingMessage
      ) {
        return;
      }

      const userMessage: LessonChatMessage = {
        id: `temp-${Date.now()}`,
        role: "teacher",
        content: text.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      queryClient.setQueryData<LessonChatMessage[]>(messagesQueryKey, (old) => [
        ...(old || []),
        userMessage,
      ]);

      setIsSendingMessage(true);
      setStreamingContent("");

      let fullResponseText = "";

      abortControllerRef.current = chatService.sendMessageSSE(
        selectedClassId,
        selectedChatId,
        userMessage.content,
        (chunk) => {
          setStreamingContent((prev) => (prev || "") + chunk);
          fullResponseText += chunk;
        },
        (fullMessage, stopReason, savedMessageId) => {
          const assistantMsg: LessonChatMessage = {
            id: savedMessageId || `msg-${Date.now()}`,
            role: "assistant",
            content: fullMessage || fullResponseText,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          queryClient.setQueryData<LessonChatMessage[]>(
            messagesQueryKey,
            (old) => [...(old || []), assistantMsg]
          );

          setStreamingContent(null);
          setIsSendingMessage(false);

          if (stopReason === "length") {
            toast.warning("Response incomplete", {
              description: "The AI hit the maximum word limit.",
              duration: 5000,
            });
          }
        },
        (error) => {
          console.error("SSE error:", error);
          setStreamingContent(null);
          setIsSendingMessage(false);
          toast.error("Failed to send message");
        }
      );
    },
    [
      selectedClassId,
      selectedChatId,
      isSendingMessage,
      messagesQueryKey,
      queryClient,
    ]
  );

  const handleRequestSaveToLesson = (message: LessonChatMessage) => {
    if (!selectedClassId || !selectedChatId) return;
    if (message.id.startsWith("temp") || message.id.startsWith("msg-")) {
      toast.info(t("lessonPlanning.conversation.waitForMessage"));
      return;
    }
    setMessageToSave(message);
    setIsSaveDialogOpen(true);
  };

  if (!selectedChat) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-5">
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-10 text-center">
          <Sparkles className="size-10 text-muted-foreground" />
          <p className="text-base font-medium">
            {t("lessonPlanning.conversation.title")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("lessonPlanning.chats.empty")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-full bg-white">
        <div className="absolute inset-0 overflow-y-auto pb-72 px-5">
          <div className="flex flex-col gap-4 py-4">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 && !streamingContent ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("lessonPlanning.conversation.startConversation")}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    teacherLabel={t("lessonPlanning.conversation.teacherLabel")}
                    assistantLabel={t(
                      "lessonPlanning.conversation.assistantLabel"
                    )}
                    onSaveToLesson={() => handleRequestSaveToLesson(message)}
                    onRemoveLesson={
                      message.lessonId
                        ? () => removeLessonMutation.mutate(message.id)
                        : undefined
                    }
                    isSaving={
                      saveToLessonMutation.isPending &&
                      messageToSave?.id === message.id
                    }
                    isRemoving={
                      removeLessonMutation.isPending &&
                      removeLessonMutation.variables === message.id
                    }
                  />
                ))}

                {streamingContent && (
                  <MessageBubble
                    message={{
                      id: "streaming",
                      role: "assistant",
                      content: streamingContent,
                      timestamp: "",
                    }}
                    teacherLabel={t("lessonPlanning.conversation.teacherLabel")}
                    assistantLabel={t(
                      "lessonPlanning.conversation.assistantLabel"
                    )}
                    isStreaming
                  />
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-5 pt-3">
          <div className="space-y-3">
            <div className="px-1">
              <Collapsible
                open={contextOpen}
                onOpenChange={setContextOpen}
                className="rounded-xl border bg-linear-to-r from-blue-50/50 to-indigo-50/50 px-4 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-medium text-foreground">
                      {selectedChat.lessonTopic || selectedChat.title}
                    </span>
                    {selectedChat.gradeYear && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <GraduationCap className="size-3.5" />
                        {selectedChat.gradeYear}
                      </span>
                    )}
                    {selectedChat.durationMinutes && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3.5" />
                        {selectedChat.durationMinutes} min
                      </span>
                    )}
                    {selectedChat.assessmentType && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ClipboardCheck className="size-3.5" />
                        {selectedChat.assessmentType}
                      </span>
                    )}
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                    >
                      {contextOpen ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2 space-y-2 text-sm">
                  {selectedChat.learningObjectives && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        {t("lessonPlanning.chats.learningObjectivesLabel")}:
                      </span>{" "}
                      <span className="text-foreground">
                        {selectedChat.learningObjectives}
                      </span>
                    </div>
                  )}
                  {selectedChat.teachingActivities && (
                    <div>
                      <span className="font-medium text-muted-foreground">
                        {t("lessonPlanning.chats.teachingActivitiesLabel")}:
                      </span>{" "}
                      <span className="text-foreground">
                        {selectedChat.teachingActivities}
                      </span>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>

            <ChatInputArea
              onSendMessage={handleSendMessage}
              isSendingMessage={isSendingMessage}
              placeholder={t("lessonPlanning.conversation.placeholder")}
              t={t}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={isSaveDialogOpen}
        onOpenChange={(open) => {
          setIsSaveDialogOpen(open);
          if (!open) setMessageToSave(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("lessonPlanning.conversation.saveToLesson", "Save as lesson")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "lessonPlanning.conversation.verifySave",
                "Do you want to save this AI response as a lesson?"
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-auto rounded-md border bg-muted/40 p-3 text-sm">
            {messageToSave ? (
              <Markdown content={messageToSave.content} />
            ) : (
              <p className="text-muted-foreground text-sm">
                {t(
                  "lessonPlanning.conversation.noMessageSelected",
                  "No message selected"
                )}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsSaveDialogOpen(false);
                setMessageToSave(null);
              }}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={() =>
                messageToSave && saveToLessonMutation.mutate(messageToSave.id)
              }
              disabled={!messageToSave || saveToLessonMutation.isPending}
            >
              {saveToLessonMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {t("lessonPlanning.conversation.saveToLesson")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

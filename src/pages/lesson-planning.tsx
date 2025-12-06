import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Loader2,
  Mic,
  Plus,
  Save,
  Send,
  Sparkles,
  ClipboardCheck,
} from "lucide-react";
import { useStore } from "@tanstack/react-store";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  lessonStore,
  setCurrentMessages,
  setIsLoadingMessages,
  addMessage,
  setIsSendingMessage,
  setStreamingMessage,
  appendToStreamingMessage,
  type LessonChatMessage,
} from "@/stores/lesson-store";
import { chatService } from "@/services/chat-service";
import { lessonService } from "@/services/lesson-service";
import { Markdown } from "@/components/ui/markdown";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


export default function LessonPlanning() {
  const { t } = useTranslation();
  const {
    selectedClassId,
    selectedChatId,
    classes,
    currentMessages,
    isLoadingMessages,
    isSendingMessage,
    streamingMessage,
  } = useStore(lessonStore);
  const [contextOpen, setContextOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId]
  );

  const selectedChat = useMemo(
    () => selectedClass?.chats.find((chat) => chat.id === selectedChatId),
    [selectedClass, selectedChatId]
  );

  const fetchMessages = useCallback(async () => {
    if (!selectedClassId || !selectedChatId) return;

    setIsLoadingMessages(true);
    try {
      const response = await chatService.getMessages(selectedClassId, selectedChatId, {
        limit: 100,
      });
      const messages: LessonChatMessage[] = response.data.map((msg) => ({
        id: msg.id,
        role: msg.role === "user" ? "teacher" : "assistant",
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: msg.createdAt,
      }));
      setCurrentMessages(messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [selectedClassId, selectedChatId]);

  useEffect(() => {
    fetchMessages();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, streamingMessage]);

  const handleSendMessage = async () => {
    if (!selectedClassId || !selectedChatId || !messageInput.trim() || isSendingMessage) {
      return;
    }

    const userMessage: LessonChatMessage = {
      id: `temp-${Date.now()}`,
      role: "teacher",
      content: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(userMessage);
    setMessageInput("");
    setIsSendingMessage(true);
    setStreamingMessage("");

    abortControllerRef.current = chatService.sendMessageSSE(
      selectedClassId,
      selectedChatId,
      userMessage.content,
      (chunk) => {
        appendToStreamingMessage(chunk);
      },
      (fullMessage) => {
        addMessage({
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: fullMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
        setStreamingMessage(null);
        setIsSendingMessage(false);
      },
      (error) => {
        console.error("SSE error:", error);
        setStreamingMessage(null);
        setIsSendingMessage(false);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveToLesson = async (message: LessonChatMessage) => {
    if (!selectedClassId || !selectedChat) return;

    try {
      await lessonService.create(selectedClassId, {
        title: selectedChat.lessonTopic || selectedChat.title,
        topic: selectedChat.lessonTopic,
        gradeYear: selectedChat.gradeYear,
        durationMinutes: selectedChat.durationMinutes,
        learningObjectives: selectedChat.learningObjectives,
        teachingActivities: selectedChat.teachingActivities,
        contentMd: message.content,
        generated: true,
      });
      toast.success(t("lessonPlanning.conversation.savedToLesson", "Saved to lesson successfully"));
    } catch (error) {
      console.error("Failed to save to lesson:", error);
      toast.error(t("lessonPlanning.conversation.saveToLessonError", "Failed to save to lesson"));
    }
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
    <div className="relative h-full bg-white">
      {/* Messages area - scrollable with padding at bottom for input */}
      <div className="absolute inset-0 overflow-y-auto pb-72 px-5">
        <div className="flex flex-col gap-4 py-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : currentMessages.length === 0 && !streamingMessage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {t("lessonPlanning.conversation.startConversation")}
              </p>
            </div>
          ) : (
            <>
              {currentMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  teacherLabel={t("lessonPlanning.conversation.teacherLabel")}
                  assistantLabel={t("lessonPlanning.conversation.assistantLabel")}
                  onSaveToLesson={() => handleSaveToLesson(message)}
                />
              ))}
              {streamingMessage && (
                <MessageBubble
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: streamingMessage,
                    timestamp: "",
                  }}
                  teacherLabel={t("lessonPlanning.conversation.teacherLabel")}
                  assistantLabel={t("lessonPlanning.conversation.assistantLabel")}
                  isStreaming
                />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-5 pt-3">
        <div className="space-y-3">
          <div className="px-1">
            <Collapsible
              open={contextOpen}
              onOpenChange={setContextOpen}
              className="rounded-xl border bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-4 py-2"
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
                    <span className="text-foreground">{selectedChat.learningObjectives}</span>
                  </div>
                )}
                {selectedChat.teachingActivities && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {t("lessonPlanning.chats.teachingActivitiesLabel")}:
                    </span>{" "}
                    <span className="text-foreground">{selectedChat.teachingActivities}</span>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <Textarea
              placeholder={t("lessonPlanning.conversation.placeholder")}
              rows={3}
              className="min-h-12 border-0 shadow-none focus-visible:ring-0 resize-none"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSendingMessage}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:text-foreground"
                  disabled={isSendingMessage}
                >
                  <Plus className="size-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:text-foreground"
                  disabled={isSendingMessage}
                >
                  <Mic className="size-5" />
                </Button>
              </div>
              <Button
                className="whitespace-nowrap"
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || isSendingMessage}
              >
                {isSendingMessage ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : (
                  <Send className="size-4 mr-2" />
                )}
                {t("lessonPlanning.conversation.send")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  teacherLabel,
  assistantLabel,
  onSaveToLesson,
  isStreaming,
}: {
  message: LessonChatMessage;
  teacherLabel: string;
  assistantLabel: string;
  onSaveToLesson?: () => void;
  isStreaming?: boolean;
}) {
  const { t } = useTranslation();
  const isTeacher = message.role === "teacher";

  return (
    <div className={cn("flex", isTeacher ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isTeacher ? "bg-primary text-primary-foreground" : "bg-white border"
        )}
      >
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wide mb-2",
            isTeacher ? "text-primary-foreground/80" : "text-primary"
          )}
        >
          {isTeacher ? teacherLabel : assistantLabel}
        </p>
        {isTeacher ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <Markdown
            content={message.content}
            className={cn("text-sm", isTeacher && "prose-invert")}
          />
        )}
        {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
        <div className="mt-3 flex items-center justify-between gap-2">
          {message.timestamp && (
            <p className={cn("text-xs", isTeacher ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {message.timestamp}
            </p>
          )}
          {!isTeacher && !isStreaming && onSaveToLesson && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onSaveToLesson}
            >
              <Save className="size-3 mr-1" />
              {t("lessonPlanning.conversation.saveToLesson")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

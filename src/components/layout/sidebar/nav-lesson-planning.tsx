import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Loader2,
  MessageSquare,
  Pin,
  PinOff,
  Plus,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "@tanstack/react-store";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  lessonStore,
  setClasses,
  setIsLoadingClasses,
  setSelectedChatId,
  setSelectedClassId,
  setClassOpen,
  toggleClassOpen,
  addChatToClass,
  updateChatInClass,
  reorderClasses,
  type LessonClass,
  type LessonChat,
} from "@/stores/lesson-store";
import { classroomService } from "@/services/class-service";
import { chatService } from "@/services/chat-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NavLessonPlanning() {
  const { t } = useTranslation();
  const {
    selectedClassId,
    selectedChatId,
    classesOpen,
    classes,
    isLoadingClasses,
  } = useStore(lessonStore);
  const [draggingClassId, setDraggingClassId] = useState<string | null>(null);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [lessonTopic, setLessonTopic] = useState("");
  const [gradeYear, setGradeYear] = useState("");
  const [lessonDuration, setLessonDuration] = useState<number>(45);
  const [learningObjectives, setLearningObjectives] = useState("");
  const [teachingActivities, setTeachingActivities] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [creatingChatForClassId, setCreatingChatForClassId] = useState<
    string | null
  >(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const flattenedChats = classes.flatMap((classItem) =>
    classItem.chats.map((chat) => ({
      classId: classItem.id,
      className: classItem.name,
      chat,
    }))
  );

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    const results: {
      classId: string;
      className: string;
      chat: LessonChat;
      matchedMessages: LessonChat["messages"];
    }[] = [];
    for (const { classId, className, chat } of flattenedChats) {
      const matchedMessages = chat.messages.filter((msg) =>
        msg.content.toLowerCase().includes(term)
      );
      const matchesChat =
        className.toLowerCase().includes(term) ||
        chat.title.toLowerCase().includes(term) ||
        (chat.lessonTopic && chat.lessonTopic.toLowerCase().includes(term));
      if (matchesChat || matchedMessages.length > 0) {
        results.push({ classId, className, chat, matchedMessages });
      }
    }
    return results;
  }, [flattenedChats, searchTerm]);

  const fetchClasses = useCallback(async () => {
    setIsLoadingClasses(true);
    try {
      const response = await classroomService.getAll({ limit: 50 });
      const classesWithChats: LessonClass[] = await Promise.all(
        response.data.map(async (classroom) => {
          try {
            const chatsResponse = await chatService.getAll(classroom.id, {
              limit: 50,
            });
            const chats: LessonChat[] = chatsResponse.data.map((chat) => ({
              id: chat.id,
              classroomId: chat.classroomId,
              title: chat.title,
              focus: chat.focus,
              tone: chat.tone,
              pinned: chat.pinned,
              messages: [],
              lessonTopic: chat.lessonTopic,
              gradeYear: chat.gradeYear,
              durationMinutes: chat.durationMinutes,
              learningObjectives: chat.learningObjectives,
              teachingActivities: chat.teachingActivities,
              assessmentType: chat.assessmentType,
              targetCefrLevel: chat.targetCefrLevel,
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
            }));
            return {
              id: classroom.id,
              name: classroom.name,
              grade: classroom.grade,
              totalStudents: classroom.totalStudents,
              pinned: classroom.pinned,
              chats,
              createdAt: classroom.createdAt,
              updatedAt: classroom.updatedAt,
            };
          } catch {
            return {
              id: classroom.id,
              name: classroom.name,
              grade: classroom.grade,
              totalStudents: classroom.totalStudents,
              pinned: classroom.pinned,
              chats: [],
              createdAt: classroom.createdAt,
              updatedAt: classroom.updatedAt,
            };
          }
        })
      );
      setClasses(classesWithChats);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoadingClasses(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedChat = selectedClass?.chats.find(
    (c) => c.id === selectedChatId
  );

  const handleToggleChatPin = async (classId: string, chat: LessonChat) => {
    try {
      const updated = await chatService.update(classId, chat.id, {
        pinned: !chat.pinned,
      });
      updateChatInClass(classId, chat.id, { pinned: updated.pinned });
    } catch (error) {
      console.error("Failed to pin chat", error);
    }
  };

  const handleDragStart = (classId: string) => setDraggingClassId(classId);

  const handleDragOver = (
    event: React.DragEvent<HTMLLIElement>,
    targetId: string
  ) => {
    event.preventDefault();
    if (!draggingClassId || draggingClassId === targetId) return;
    const currentOrder = [...classes];
    const fromIndex = currentOrder.findIndex((c) => c.id === draggingClassId);
    const toIndex = currentOrder.findIndex((c) => c.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const updated = [...currentOrder];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    reorderClasses(updated);
  };

  const handleDragEnd = () => setDraggingClassId(null);

  const handleCreateChat = async () => {
    if (!creatingChatForClassId || !newChatTitle.trim() || !lessonTopic.trim())
      return;

    setIsCreatingChat(true);
    try {
      const newChat = await chatService.create(creatingChatForClassId, {
        title: newChatTitle.trim(),
        lessonTopic: lessonTopic.trim(),
        gradeYear: gradeYear.trim() || undefined,
        durationMinutes: lessonDuration || undefined,
        learningObjectives: learningObjectives.trim() || undefined,
        teachingActivities: teachingActivities.trim() || undefined,
        assessmentType: assessmentType.trim() || undefined,
      });
      addChatToClass(creatingChatForClassId, {
        id: newChat.id,
        classroomId: newChat.classroomId,
        title: newChat.title,
        focus: newChat.focus,
        tone: newChat.tone,
        pinned: newChat.pinned,
        messages: [],
        lessonTopic: newChat.lessonTopic,
        gradeYear: newChat.gradeYear,
        durationMinutes: newChat.durationMinutes,
        learningObjectives: newChat.learningObjectives,
        teachingActivities: newChat.teachingActivities,
        assessmentType: newChat.assessmentType,
        targetCefrLevel: newChat.targetCefrLevel,
        createdAt: newChat.createdAt,
        updatedAt: newChat.updatedAt,
      });
      setSelectedClassId(creatingChatForClassId);
      setSelectedChatId(newChat.id);
      setIsNewChatDialogOpen(false);
      setNewChatTitle("");
      setCreatingChatForClassId(null);
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const openNewChatDialog = (classId: string | null) => {
    setCreatingChatForClassId(classId);
    setNewChatTitle("");
    setLessonTopic("");
    setGradeYear("");
    setLessonDuration(45);
    setLearningObjectives("");
    setTeachingActivities("");
    setAssessmentType("");
    setIsNewChatDialogOpen(true);
  };

  return (
    <>
      <SidebarGroup className="sticky top-0 z-10 bg-muted/40">
        <SidebarGroupLabel>
          {t("lessonPlanning.classes.title")}
        </SidebarGroupLabel>
        <SidebarMenu className="hidden gap-1 group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("common.search")}
              onClick={() => setIsSearchDialogOpen(true)}
            >
              <Search className="size-4" />
              <span>{t("common.search")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("lessonPlanning.chats.newChat")}
              onClick={() => openNewChatDialog(classes[0]?.id ?? null)}
            >
              <Plus className="size-4" />
              <span>{t("lessonPlanning.chats.newChat")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="group-data-[collapsible=icon]:hidden">
          {isLoadingClasses ? (
            <SidebarMenuItem>
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            </SidebarMenuItem>
          ) : classes.length === 0 ? (
            <SidebarMenuItem>
              <p className="px-2 py-4 text-xs text-muted-foreground text-center">
                {t("lessonPlanning.classes.empty")}
              </p>
            </SidebarMenuItem>
          ) : (
            classes.map((classItem) => (
              <SidebarMenuItem
                key={classItem.id}
                draggable
                onDragStart={() => handleDragStart(classItem.id)}
                onDragOver={(e) => handleDragOver(e, classItem.id)}
                onDragEnd={handleDragEnd}
                className="cursor-grab"
              >
                <Collapsible
                  open={classesOpen[classItem.id] ?? false}
                  onOpenChange={() => toggleClassOpen(classItem.id)}
                >
                  <div
                    className={cn(
                      "w-full rounded-md border transition",
                      classItem.id === selectedClassId &&
                        "border-primary/50 bg-sidebar-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2 px-2 pt-2 pb-1">
                      <CollapsibleTrigger
                        onClick={() => setSelectedClassId(classItem.id)}
                        className="flex-1 px-1 py-1 text-left flex items-center gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md"
                      >
                        {classesOpen[classItem.id] ? (
                          <ChevronDown className="size-4 shrink-0" />
                        ) : (
                          <ChevronRight className="size-4 shrink-0" />
                        )}
                        <Folder className="size-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium">
                            {classItem.name}
                          </p>
                          {classItem.grade && (
                            <p className="truncate text-xs text-muted-foreground">
                              {classItem.grade}
                              {classItem.totalStudents !== undefined &&
                                ` · ${classItem.totalStudents} students`}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {classItem.chats.length}
                        </span>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="border-t px-2 py-2 space-y-1">
                        {classItem.chats.map((chat) => (
                          <div
                            key={chat.id}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              chat.id === selectedChat?.id &&
                                "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClassId(classItem.id);
                                setSelectedChatId(chat.id);
                              }}
                              className="flex-1 flex items-center gap-2 text-left"
                            >
                              <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="truncate text-sm">
                                {chat.title}
                              </span>
                            </button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7",
                                chat.pinned && "text-amber-500"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleChatPin(classItem.id, chat);
                              }}
                              aria-label={
                                chat.pinned
                                  ? t("lessonPlanning.chats.unpin")
                                  : t("lessonPlanning.chats.pin")
                              }
                            >
                              {chat.pinned ? (
                                <PinOff className="size-3.5" />
                              ) : (
                                <Pin className="size-3.5" />
                              )}
                            </Button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => openNewChatDialog(classItem.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <Plus className="size-3.5" />
                          <span>{t("lessonPlanning.chats.newChat")}</span>
                        </button>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroup>

      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("lessonPlanning.chats.newChatTitle")}</DialogTitle>
            <DialogDescription>
              {t("lessonPlanning.chats.newChatDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="class-select">
                {t("lessonPlanning.classes.title")}
              </Label>
              <select
                id="class-select"
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={creatingChatForClassId ?? ""}
                onChange={(e) =>
                  setCreatingChatForClassId(e.target.value || null)
                }
              >
                <option value="" disabled>
                  {t("lessonPlanning.classes.title")}
                </option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chat Title */}
            <div className="grid gap-2">
              <Label htmlFor="chat-title">
                {t("lessonPlanning.chats.chatTitleLabel")}
              </Label>
              <Input
                id="chat-title"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder={t("lessonPlanning.chats.chatTitlePlaceholder")}
              />
            </div>

            {/* Lesson Topic (Required) */}
            <div className="grid gap-2">
              <Label htmlFor="lesson-topic">
                {t("lessonPlanning.chats.lessonTopicLabel")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lesson-topic"
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                placeholder={t("lessonPlanning.chats.lessonTopicPlaceholder")}
              />
            </div>

            {/* Grade/Year */}
            <div className="grid gap-2">
              <Label htmlFor="grade-year">
                {t("lessonPlanning.chats.gradeYearLabel")}
              </Label>
              <Input
                id="grade-year"
                value={gradeYear}
                onChange={(e) => setGradeYear(e.target.value)}
                placeholder={t("lessonPlanning.chats.gradeYearPlaceholder")}
              />
            </div>

            {/* Lesson Duration */}
            <div className="grid gap-2">
              <Label htmlFor="lesson-duration">
                {t("lessonPlanning.chats.lessonDurationLabel")}
              </Label>
              <Input
                id="lesson-duration"
                type="number"
                min={1}
                max={480}
                value={lessonDuration}
                onChange={(e) =>
                  setLessonDuration(parseInt(e.target.value) || 45)
                }
                placeholder="45"
              />
            </div>

            {/* Learning Objectives */}
            <div className="grid gap-2">
              <Label htmlFor="learning-objectives">
                {t("lessonPlanning.chats.learningObjectivesLabel")}
              </Label>
              <Textarea
                id="learning-objectives"
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                placeholder={t(
                  "lessonPlanning.chats.learningObjectivesPlaceholder"
                )}
                rows={3}
              />
            </div>

            {/* Teaching Activities */}
            <div className="grid gap-2">
              <Label htmlFor="teaching-activities">
                {t("lessonPlanning.chats.teachingActivitiesLabel")}
              </Label>
              <Textarea
                id="teaching-activities"
                value={teachingActivities}
                onChange={(e) => setTeachingActivities(e.target.value)}
                placeholder={t(
                  "lessonPlanning.chats.teachingActivitiesPlaceholder"
                )}
                rows={3}
              />
            </div>

            {/* Assessment Type */}
            <div className="grid gap-2">
              <Label htmlFor="assessment-type">
                {t("lessonPlanning.chats.assessmentTypeLabel")}
              </Label>
              <Input
                id="assessment-type"
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                placeholder={t(
                  "lessonPlanning.chats.assessmentTypePlaceholder"
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewChatDialogOpen(false)}
              disabled={isCreatingChat}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleCreateChat}
              disabled={
                !creatingChatForClassId ||
                !newChatTitle.trim() ||
                !lessonTopic.trim() ||
                isCreatingChat
              }
            >
              {isCreatingChat && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("common.search")}</DialogTitle>
            <DialogDescription>
              {t(
                "lessonPlanning.chats.searchPlaceholder",
                "Search chats and classes"
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              placeholder={t(
                "lessonPlanning.chats.searchPlaceholder",
                "Search by title or class"
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {searchTerm.trim() && searchResults.length === 0 && (
                <p className="px-1 py-2 text-sm text-muted-foreground">
                  {t("common.noResults", "No results found")}
                </p>
              )}
              {searchResults.map(
                ({ classId, className, chat, matchedMessages }) => (
                  <button
                    key={chat.id}
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      setSelectedClassId(classId);
                      setClassOpen(classId, true);
                      setSelectedChatId(chat.id);
                      setIsSearchDialogOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {className}
                    </p>
                    {matchedMessages.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {matchedMessages.slice(0, 2).map((msg) => (
                          <p
                            key={msg.id}
                            className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 truncate"
                          >
                            <span className="font-medium">
                              {msg.role === "teacher" ? "You" : "AI"}:
                            </span>{" "}
                            {msg.content.length > 80
                              ? `${msg.content.slice(0, 80)}...`
                              : msg.content}
                          </p>
                        ))}
                        {matchedMessages.length > 2 && (
                          <p className="text-xs text-muted-foreground italic px-2">
                            +{matchedMessages.length - 2} more matches
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                )
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSearchDialogOpen(false)}
            >
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

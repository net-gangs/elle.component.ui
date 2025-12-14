import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "@tanstack/react-store";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  lessonStore,
  setClasses,
  setIsLoadingClasses,
  setSelectedChatId,
  setSelectedClassId,
  toggleClassOpen,
  reorderClasses,
} from "@/stores/lesson-store";
import { Spinner } from "@/components/ui/spinner";
import { LessonClassItem } from "./lesson-class-item";
import { NewChatDialog } from "./new-chat-dialog";
import { useClassrooms } from "@/hooks/@ella/use-classrooms";
import type { Chat } from "@/types/chat";
import { useToggleChatPin } from "@/hooks/@ella/use-chats";

export function NavLessonPlanning() {
  const { t } = useTranslation();
  const { selectedClassId, selectedChatId, classesOpen, isLoadingClasses } =
    useStore(lessonStore);
  const { state } = useSidebar();

  const { data: classroomsResponse, isLoading } = useClassrooms();
  const classes = useMemo(
    () => classroomsResponse?.data ?? [],
    [classroomsResponse],
  );

  const [draggingClassId, setDraggingClassId] = useState<string | null>(null);

  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [targetClassIdForNewChat, setTargetClassIdForNewChat] = useState<
    string | null
  >(null);

  const { mutate: togglePin } = useToggleChatPin();

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
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

  const openNewChat = (classId: string | null) => {
    setTargetClassIdForNewChat(classId);
    setIsNewChatOpen(true);
  };

  const onPinChat = (classId: string, chat: Chat) => {
    togglePin({ classId, chat });
  };

  useEffect(() => {
    setIsLoadingClasses(isLoading);
    if (classes.length > 0) {
      const storeClasses = classes.map((c) => ({ ...c, chats: [] }));
      setClasses(storeClasses);
    }
  }, [classes, isLoading]);

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
              //onClick={() => setIsSearchOpen(true)}
            >
              <Search className="size-4" />
              <span>{t("common.search")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {isLoadingClasses ? (
            <SidebarMenuItem>
              <div className="flex justify-center pt-2">
                <Spinner className="size-4" />
              </div>
            </SidebarMenuItem>
          ) : classes.length === 0 && state !== "collapsed" ? (
            <SidebarMenuItem>
              <p className="px-2 py-4 text-xs text-muted-foreground text-center">
                {t("lessonPlanning.classes.empty")}
              </p>
            </SidebarMenuItem>
          ) : (
            classes.map((classItem) => (
              <LessonClassItem
                key={classItem.id}
                classItem={classItem}
                isCollapsed={state === "collapsed"}
                isSelectedClass={classItem.id === selectedClassId}
                selectedChatId={selectedChatId}
                isOpen={classesOpen[classItem.id] ?? false}
                onToggleOpen={() => toggleClassOpen(classItem.id)}
                onSelectClass={() => setSelectedClassId(classItem.id)}
                onSelectChat={(chatId) => setSelectedChatId(chatId)}
                onPinChat={(chat) => onPinChat(classItem.id, chat)}
                onNewChat={() => openNewChat(classItem.id)}
                dragHandlers={{
                  onDragStart: () => setDraggingClassId(classItem.id),
                  onDragOver: (e) => handleDragOver(e, classItem.id),
                  onDragEnd: () => setDraggingClassId(null),
                }}
              />
            ))
          )}
        </SidebarMenu>
      </SidebarGroup>

      <NewChatDialog
        open={isNewChatOpen}
        targetClass={classes.find((c) => c.id === targetClassIdForNewChat)}
        onOpenChange={setIsNewChatOpen}
      />

      {/* <SearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        classes={classes}
        onSelect={(classId, chatId) => {
          setSelectedClassId(classId);
          setClassOpen(classId, true);
          setSelectedChatId(chatId);
          setIsSearchOpen(false);
        }}
      /> */}
    </>
  );
}

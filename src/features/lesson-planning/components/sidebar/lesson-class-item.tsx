import {
  ChevronDown,
  ChevronRight,
  Folder,
  MessageSquare,
  Pin,
  PinOff,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/@ella/use-chats";
import type { Chat } from "@/types/chat";
import { Spinner } from "@/components/ui/spinner";
import type { Classroom } from "@/types";
import { Badge } from "@/components/ui/badge";

interface LessonClassItemProps {
  classItem: Classroom;
  isCollapsed: boolean;
  isSelectedClass: boolean;
  selectedChatId: string | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectClass: () => void;
  onSelectChat: (chatId: string) => void;
  onPinChat: (chat: Chat) => void;
  onNewChat: () => void;
  dragHandlers: {
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
}

export function LessonClassItem({
  classItem,
  isCollapsed,
  isSelectedClass,
  selectedChatId,
  isOpen,
  onToggleOpen,
  onSelectClass,
  onSelectChat,
  onPinChat,
  onNewChat,
  dragHandlers,
}: LessonClassItemProps) {
  const { t } = useTranslation();
  const { data: chatsData, isLoading: isChatsLoading } = useChats(classItem.id);
  const chats = chatsData?.data || [];

  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={classItem.name}>
              <Folder className="size-4" />
              <span>{classItem.name}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="min-w-56">
            <DropdownMenuLabel className="truncate">
              {classItem.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Loading State for Dropdown */}
            {isChatsLoading ? (
              <div className="flex items-center justify-center py-2">
                <Spinner />
              </div>
            ) : chats.length === 0 ? (
              <div className="px-2 py-2 text-xs text-muted-foreground">
                No chats
              </div>
            ) : (
              chats.map((chat) => (
                <DropdownMenuItem
                  key={chat.id}
                  onClick={() => {
                    onSelectClass();
                    onSelectChat(chat.id);
                  }}
                  className="flex justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  {chat.pinned && (
                    <Pin className="size-3 shrink-0 text-primary" />
                  )}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onNewChat}>
              <Plus className="mr-2 size-4" />
              {t("lessonPlanning.chats.newChat")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDragEnd={dragHandlers.onDragEnd}
      className="cursor-grab"
    >
      <Collapsible open={isOpen} onOpenChange={onToggleOpen}>
        <div
          className={cn(
            "w-full rounded-md border transition",
            isSelectedClass && "border-primary/50 bg-sidebar-accent/50",
          )}
        >
          <div className="flex items-center gap-2 p-2">
            <CollapsibleTrigger
              onClick={onSelectClass}
              className="flex flex-1 items-center gap-2 rounded-md px-1 py-1 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {isOpen ? (
                <ChevronDown className="size-4 shrink-0" />
              ) : (
                <ChevronRight className="size-4 shrink-0" />
              )}
              <Folder className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{classItem.name}</p>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {/* Grade Badge */}
                  {classItem.grade && (
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground border-muted-foreground/30"
                    >
                      {classItem.grade}
                    </Badge>
                  )}

                  {/* Student Count Badge */}
                  {classItem.totalStudents !== undefined && (
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground border-muted-foreground/30"
                    >
                      {t("lessonPlanning.snapshot.studentsCount", {
                        current: classItem.totalStudents,
                      })}
                    </Badge>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {/* Show spinner in count badge if loading */}
                {isChatsLoading ? <Spinner /> : chats.length}
              </span>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="space-y-1 border-t px-2 py-2">
              {/* Loading State for List */}
              {isChatsLoading && (
                <div className="py-2 text-center">
                  <Spinner />
                </div>
              )}

              {!isChatsLoading &&
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      chat.id === selectedChatId &&
                        "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectClass();
                        onSelectChat(chat.id);
                      }}
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">{chat.title}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10",
                        chat.pinned &&
                          "text-primary bg-primary/10 hover:bg-primary/20",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPinChat(chat);
                      }}
                    >
                      {chat.pinned ? (
                        <PinOff className="size-3.5 fill-current" />
                      ) : (
                        <Pin className="size-3.5" />
                      )}
                    </Button>
                  </div>
                ))}

              <button
                type="button"
                onClick={onNewChat}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent"
              >
                <Plus className="size-3.5" />
                <span>{t("lessonPlanning.chats.newChat")}</span>
              </button>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </SidebarMenuItem>
  );
}

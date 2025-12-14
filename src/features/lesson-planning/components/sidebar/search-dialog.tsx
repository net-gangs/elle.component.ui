import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
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
import type { LessonClass, LessonChat } from "@/stores/lesson-store";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: LessonClass[];
  onSelect: (classId: string, chatId: string) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  classes,
  onSelect,
}: SearchDialogProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const flattenedChats = useMemo(() => {
    return classes.flatMap((classItem) =>
      classItem.chats.map((chat) => ({
        classId: classItem.id,
        className: classItem.name,
        chat,
      })),
    );
  }, [classes]);

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
        msg.content.toLowerCase().includes(term),
      );

      const matchesMetadata =
        className.toLowerCase().includes(term) ||
        chat.title.toLowerCase().includes(term) ||
        (chat.lessonTopic && chat.lessonTopic.toLowerCase().includes(term));

      if (matchesMetadata || matchedMessages.length > 0) {
        results.push({ classId, className, chat, matchedMessages });
      }
    }
    return results;
  }, [flattenedChats, searchTerm]);

  const handleClose = () => {
    onOpenChange(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("common.search")}</DialogTitle>
          <DialogDescription>
            {t(
              "lessonPlanning.chats.searchPlaceholder",
              "Search chats and classes",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={t(
                "lessonPlanning.chats.searchPlaceholder",
                "Search by title or class",
              )}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-80 space-y-1 overflow-y-auto">
            {searchTerm.trim() && searchResults.length === 0 && (
              <p className="px-1 py-4 text-center text-sm text-muted-foreground">
                {t("common.noResults", "No results found")}
              </p>
            )}

            {searchResults.map(
              ({ classId, className, chat, matchedMessages }) => (
                <button
                  key={chat.id}
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                  onClick={() => {
                    onSelect(classId, chat.id);
                    setSearchTerm("");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {className}
                    </span>
                  </div>

                  {/* Optional: Show matching Topic */}
                  {chat.lessonTopic &&
                    chat.lessonTopic
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) && (
                      <p className="text-xs text-muted-foreground truncate">
                        Topic: {chat.lessonTopic}
                      </p>
                    )}

                  {/* Show Matching Messages Snippets */}
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
              ),
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("common.close", "Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

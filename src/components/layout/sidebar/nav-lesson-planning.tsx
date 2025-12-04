import {
  ChevronDown,
  Folder,
  MessageSquare,
  Pin,
  Plus,
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
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  lessonStore,
  mockProjects,
  setChatsOpen,
  setProjectsOpen,
  setSelectedChatId,
  setSelectedProjectId,
} from "@/stores/lesson-store";

const statusStyles = {
  draft:
    "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200",
  ready:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200",
};

export function NavLessonPlanning() {
  const { t } = useTranslation();
  const { selectedProjectId, selectedChatId, projectsOpen, chatsOpen } = useStore(
    lessonStore
  );

  const selectedProject = mockProjects.find((p) => p.id === selectedProjectId);
  const selectedChat = selectedProject?.chats.find(
    (c) => c.id === selectedChatId
  );

  return (
    <>
      <Collapsible
        open={projectsOpen}
        onOpenChange={setProjectsOpen}
        className="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel>{t("lessonPlanning.projects.title")}</SidebarGroupLabel>
          <CollapsibleTrigger asChild>
            <SidebarGroupAction title={t("lessonPlanning.projects.toggle")}>
              <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupAction>
          </CollapsibleTrigger>
          <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t("lessonPlanning.projects.title")}>
                <Folder className="size-4" />
                <span>{t("lessonPlanning.projects.title")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <CollapsibleContent>
            <SidebarMenu className="group-data-[collapsible=icon]:hidden">
              {mockProjects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={cn(
                      "w-full rounded-md border px-3 py-2 text-left transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      project.id === selectedProjectId &&
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="overflow-hidden">
                        <p className="truncate text-sm">{project.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {project.subject} · {project.grade}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          statusStyles[project.status]
                        )}
                      >
                        {t(
                          project.status === "draft"
                            ? "lessonPlanning.projects.statusDraft"
                            : "lessonPlanning.projects.statusReady"
                        )}
                      </span>
                    </div>
                  </button>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Plus className="size-4" />
                  <span>{t("lessonPlanning.actions.newProject")}</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>

      <Collapsible
        open={chatsOpen}
        onOpenChange={setChatsOpen}
        className="group/collapsible"
      >
        <SidebarGroup>
          <SidebarGroupLabel>{t("lessonPlanning.chats.title")}</SidebarGroupLabel>
          <CollapsibleTrigger asChild>
            <SidebarGroupAction title={t("lessonPlanning.chats.toggle")}>
              <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupAction>
          </CollapsibleTrigger>
          <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t("lessonPlanning.chats.title")}>
                <MessageSquare className="size-4" />
                <span>{t("lessonPlanning.chats.title")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <CollapsibleContent>
            <SidebarMenu className="group-data-[collapsible=icon]:hidden">
              {selectedProject ? (
                <>
                  {selectedProject.chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedChatId(chat.id)}
                        className={cn(
                          "w-full rounded-md border px-3 py-2 text-left transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          chat.id === selectedChat?.id &&
                            "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate text-sm">
                              {chat.title}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                          {chat.pinned && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Pin className="size-2.5" />
                              {t("lessonPlanning.chats.pinnedLabel")}
                            </span>
                          )}
                        </div>
                      </button>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Plus className="size-4" />
                      <span>{t("lessonPlanning.chats.newChat")}</span>
                    </button>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <p className="px-2 text-xs text-muted-foreground">
                    {t("lessonPlanning.chats.empty")}
                  </p>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </>
  );
}

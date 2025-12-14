import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLessonPlanning } from "./nav-lesson-planning";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function LessonSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { t } = useTranslation();

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "group border-r border-l bg-muted/40 transition-[width] duration-200 ease-linear sticky top-0 h-screen max-h-screen",
        state === "collapsed"
          ? "w-(--sidebar-width-icon)!"
          : "w-(--sidebar-width)!",
      )}
      data-collapsible={state === "collapsed" ? "icon" : ""}
      {...props}
    >
      <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <span className="font-semibold group-data-[collapsible=icon]:hidden">
          {t("sidebar.items.lessonPlanning")}
        </span>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <NavLessonPlanning />
      </SidebarContent>
    </Sidebar>
  );
}

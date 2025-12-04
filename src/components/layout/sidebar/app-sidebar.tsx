import type { ComponentProps } from "react";
import {
  GalleryVerticalEnd,
  GraduationCap,
  NotebookPen,
  ScanLine,
  Lightbulb,
  Trophy,
  Newspaper,
  Folder,
} from "lucide-react";

import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { LanguageSwitcher } from "./language-switcher";

// This is sample data.
const data = {
  teams: [
    {
      name: "ELLA AI",
      logo: GalleryVerticalEnd,
      planKey: "team.plan.enterprise",
    },
  ],
  navigation: {
    preparation: [
      {
        titleKey: "sidebar.items.myClass",
        url: "/my-class",
        icon: GraduationCap,
      },
      {
        titleKey: "sidebar.items.lessonPlanning",
        url: "/lesson-planning",
        icon: NotebookPen,
      },
      {
        titleKey: "sidebar.items.scanYourFile",
        url: "#",
        icon: ScanLine,
      },
    ],
    tools: [
      {
        titleKey: "sidebar.items.tipsAndTricks",
        url: "#",
        icon: Lightbulb,
        isActive: true,
      },
      {
        titleKey: "sidebar.items.rewards",
        url: "#",
        icon: Trophy,
      },
      {
        titleKey: "sidebar.items.interestingArticles",
        url: "#",
        icon: Newspaper,
      },
      {
        titleKey: "sidebar.items.filesLibrary",
        url: "#",
        icon: Folder,
      },
    ],
  },
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center justify-between">
        <TeamSwitcher teams={data.teams} />
        <SidebarTrigger className="size-7" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          groupLabel="sidebar.groups.preparation"
          items={data.navigation.preparation}
        />
        <NavMain
          groupLabel="sidebar.groups.tools"
          items={data.navigation.tools}
        />
      </SidebarContent>
      <SidebarFooter>
        <LanguageSwitcher />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

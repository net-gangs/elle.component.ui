import * as React from "react";
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
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  user: {
    name: "test-user",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ELLA AI",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "My Class",
      url: "#",
      icon: GraduationCap,
      isActive: true,
    },
    {
      title: "Lesson Planning",
      url: "#",
      icon: NotebookPen,
    },
    {
      title: "Scan Your File",
      url: "#",
      icon: ScanLine,
    },
  ],
  tools: [
    {
      title: "Tips and Tricks",
      url: "#",
      icon: Lightbulb,
      isActive: true,
    },
    {
      title: "Rewards",
      url: "#",
      icon: Trophy,
    },
    {
      title: "Interesting Articles",
      url: "#",
      icon: Newspaper,
    },
    {
      title: "Files & Library",
      url: "#",
      icon: Folder,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groupLabel={"Preparation"} items={data.navMain} />
        <NavMain groupLabel={"Tools"} items={data.tools} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
